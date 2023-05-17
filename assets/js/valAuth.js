// Get the input elements
const usernameInput = document.querySelector('.username-input');
const passwordInput = document.querySelector('.password-input');

// Get the login button
const loginButton = document.querySelector('.login');

// Add event listener to the login button
loginButton.addEventListener('click', validateLogin);

// Function to validate the login
function validateLogin() {
  // Clear previous error messages
  clearErrorMessages();

  // Validate username
  const username = usernameInput.value.trim();
  if (username.length < 4 || username.length > 10) {
    showError(usernameInput, 'Username should be between 4 and 10 characters');
    return;
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    showError(usernameInput, 'Username can only contain alphabets and numbers');
    return;
  }
  if (/\s/.test(username)) {
    showError(usernameInput, 'Username should not contain spaces');
    return;
  }

  // Validate password
  const password = passwordInput.value;
  if (password.length < 8 || password.length > 16) {
    showError(passwordInput, 'Password should be between 8 and 16 characters');
    return;
  }

  // Submit the form if validation passes
  alert('Login successful');
}

// Function to show error message
function showError(inputElement, errorMessage) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = errorMessage;

  const parentElement = inputElement.parentElement;
  parentElement.appendChild(errorDiv);
}

// Function to clear error messages
function clearErrorMessages() {
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach((errorMessage) => {
    errorMessage.remove();
  });
}
