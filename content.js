// This script runs on every OpenAI chat page and modifies the DOM elements

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

// A function that sends a message to Wolfram Alpha API and displays the result

function wolfram(message, element) {

// Send a message to the background script with the query and a callback function
chrome.runtime.sendMessage({ type: 'wolfram', query: message }, function (response) {
  if (response) {
    if (response.error) {
      // Display the error message
      var error = createElement('div', { class: 'error' }, response.error);
      insertAfter(error, element);
    } else if (response.output) {
      // Display the output depending on its format
      var output;
      if (response.format === 'text') {
        // Create a span element with the text output
        output = createElement('span', { class: 'output' }, response.output);
      } else if (response.format === 'image') {
        // Create an image element with the image url
        output = createElement('img', { class: 'output', src: response.output });
      }
      if (output) {
        // Insert the output element after the message element
        insertAfter(output, element);
        // Update MathJax rendering in case the output contains LaTeX formulas
        updateMathJax();
      }
    }
  }
});