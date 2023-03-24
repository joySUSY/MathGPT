// This script detects calculation queries in OpenAI chat messages and calls wolfram function from content.js to display results

// A function that creates a new element with given tag name, attributes and text content

function createElement(tagName, attributes, textContent) {

var element = document.createElement(tagName);

for (var key in attributes) {

element.setAttribute(key, attributes[key]);

}

if (textContent) {

element.textContent = textContent;

}

return element;

}

// A function that inserts an element after another element

function insertAfter(newElement, targetElement) {

var parent = targetElement.parentNode;

if (parent.lastChild == targetElement) {

parent.appendChild(newElement);

} else {

parent.insertBefore(newElement, targetElement.nextSibling);

}

}

// A function that detects if a message contains a calculation query

function isCalculation(message) {

// A regular expression that matches arithmetic operators, parentheses, numbers and common math symbols
var regex = /[\+\-\*\/\^\(\)\d\.eπ√]|sin|cos|tan|log|ln|exp/g;

// Remove all spaces and lowercase the message
message = message.replace(/\s/g, '').toLowerCase();

// Replace all matches with x and check if the remaining string is empty
return message.replace(regex, 'x') === '';
}

// A function that observes changes in the chat and calls wolfram function when calculation queries are detected

function observeChat() {
  // Get the chat container element
  var chatContainer = document.querySelector('.chat-container');
  if (chatContainer) {
    // Create a mutation observer that monitors child nodes changes in the chat container
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          // Loop through each added node
          mutation.addedNodes.forEach(function (node) {
            // Check if the node is a message element
            if (node.classList && node.classList.contains('message')) {
              // Get the text content of the message
              var text = node.textContent;
              // Check if the message is a calculation query
              if (isCalculation(text)) {
                // Call wolfram function with the text and the node as arguments
                wolfram(text, node);
              }
            }
          });
        }
      });
    });
    // Start observing the chat container with the specified configuration
    observer.observe(chatContainer, { childList: true });
  }
}

// Call observeChat when the document is ready

document.addEventListener('DOMContentLoaded', observeChat);