// This script listens for messages from the content script and sends requests to Wolfram Alpha API

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'wolfram') {
    // Get the appid from the local storage or use a default one
    var appid = localStorage.getItem('appid') || 'DEMO';
    // Construct the Wolfram Alpha API url with the query and the appid
    var url = 'https://api.wolframalpha.com/v2/query?input=' + encodeURIComponent(request.query) + '&appid=' + appid;
    // Send a GET request to the url and parse the XML response
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'document';
    xhr.onload = function () {
      if (xhr.status === 200) {
        // Get the first pod element that contains the result
        var pod = xhr.response.querySelector('pod');
        if (pod) {
          // Get the plaintext or image element that contains the output
          var output = pod.querySelector('plaintext, img');
          if (output) {
            // Send back the output as a string or a url depending on its tag name
            sendResponse({
              output: output.tagName === 'IMG' ? output.src : output.textContent,
              format: output.tagName === 'IMG' ? 'image' : 'text'
            });
          } else {
            // No output found
            sendResponse({ error: 'No output found' });
          }
        } else {
          // No pod found
          sendResponse({ error: 'No pod found' });
        }
      } else {
        // Request failed
        sendResponse({ error: 'Request failed: ' + xhr.statusText });
      }
    };
    xhr.onerror = function () {
      // Request failed
      sendResponse({ error: 'Request failed: ' + xhr.statusText });
    };
    xhr.send();
    return true; // Indicate that the response is asynchronous
  }
});