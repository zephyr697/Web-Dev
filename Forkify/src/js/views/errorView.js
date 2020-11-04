import {elements} from './base';

export const displayError = (errMsg) => {
  // Create a div element                                                       
  const errorDiv = document.createElement('div');

  // Set className
  errorDiv.className = 'alert alert-danger';

  // Create textnode with error message
  errorDiv.appendChild(document.createTextNode(errMsg));

  // Get parent of "to be inserted" error div and its sibling
  document.body.insertBefore(errorDiv,elements.container);

  // Remove error after 3s
  setTimeout(removeError,3000);

};

const removeError = () => {
  const errorDiv = document.querySelector('.alert');
  errorDiv.remove();
}