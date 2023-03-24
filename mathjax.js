// This script loads the MathJax library and configures it to render LaTeX formulas in OpenAI chat messages

// Load the MathJax script from a CDN
var script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
document.head.appendChild(script);

// Configure MathJax to use inline and display delimiters for LaTeX formulas
var config = 'MathJax.Hub.Config({tex2jax: {inlineMath: [["$", "$"], ["\\\\(", "\\\\)"]], displayMath: [["$$", "$$"], ["\\\\[", "\\\\]"]], processEscapes: true}});';
var script = document.createElement('script');
script.type = 'text/x-mathjax-config';
script.textContent = config;
document.head.appendChild(script);

// A function that updates the MathJax rendering of all messages in the chat
function updateMathJax() {
  // Get all the message elements in the chat
  var messages = document.querySelectorAll('.message');
  // Loop through each message element
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    // Check if the message has been processed by MathJax before
    if (!message.classList.contains('mathjax-processed')) {
      // Mark the message as processed by MathJax
      message.classList.add('mathjax-processed');
      // Get the text content of the message
      var text = message.textContent;
      // Check if the text contains any LaTeX delimiters
      if (text.includes('$') || text.includes('\\(') || text.includes('\\[')) {
        // Replace the text content of the message with a span element that contains the original text
        var span = document.createElement('span');
        span.textContent = text;
        message.textContent = '';
        message.appendChild(span);
        // Tell MathJax to process the span element and render any LaTeX formulas inside it
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, span]);
      }
    }
  }
}

// A function that observes changes in the chat and calls updateMathJax when new messages are added

function observeChat() {
  // Get the chat container element
  var chatContainer = document.querySelector('.chat-container');
  if (chatContainer) {
    // Create a mutation observer that monitors child nodes changes in the chat container
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          // Call updateMathJax when new nodes are added to the chat container
          updateMathJax();
        }
      });
    });
    // Start observing the chat container with the specified configuration
    observer.observe(chatContainer, { childList: true });
  }
}

// Call observeChat when the document is ready

document.addEventListener('DOMContentLoaded', observeChat);