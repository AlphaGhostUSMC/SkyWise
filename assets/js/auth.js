// const userNameInput = document.querySelector('.username-input');
// const emailInput = document.querySelector('.email-input');
// const passwordInput = document.querySelector('.password-input');
// const cnfPasswordInput = document.querySelector('.cnfpassword-input');
// const registerBtn = document.querySelector('.register');


const fs = require('fs');
const crypto = require('crypto');

function showNotification(message) {
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return;
  }

  // Check the notification permission
  if (Notification.permission === "granted") {
    // If permission is already granted, show the notification
    let notification = new Notification(message);
  } else if (Notification.permission !== "denied") {
    // Otherwise, request permission from the user
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        let notification = new Notification(message);
      }
    });
  }
}

function storeUserCredentials(username, email, password) {
  // Generate MD5 hash of the password
  const md5Hash = crypto.createHash('md5').update(password).digest('hex');

  // Create an object to store the user data
  const userData = {
    username: username,
    email: email,
    password: md5Hash
  };

  // Read the existing user data from the JSON file (if it exists)
  let existingData = [];
  try {
    const data = fs.readFileSync('users.json');
    existingData = JSON.parse(data);
  } catch (err) {
    // Ignore error if the file doesn't exist yet
  }

  // Add the new user data to the existing data
  existingData.push(userData);

  // Write the updated data back to the JSON file
  fs.writeFileSync('users.json', JSON.stringify(existingData));

  console.log('User data stored successfully');
}

function validateForm() {
  const username = document.querySelector('.reg-username-input').value;
  const email = document.querySelector('.email-input').value;
  const password = document.querySelector('.reg-password-input').value;
  const cnfpassword = document.querySelector('.reg-cnfpassword-input').value;

  // Validation check 1: Username
  if (username.trim() === '') {
    showNotification('Username should not be empty.');
    return false;
  }
  if (username.length < 5 || username.length > 15) {
    showNotification('Username should be between 5 and 15 characters.');
    return false;
  }
  if (/^\d+$/.test(username)) {
    showNotification('Username should not be only numbers.');
    return false;
  }
  if (/[^a-zA-Z0-9]/.test(username)) {
    showNotification('Username should not contain special characters.');
    return false;
  }

  // Validation check 2: Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification('Email is not valid.');
    return false;
  }

  // Validation check 3: Password
  if (password.length < 8 || password.length > 16) {
    showNotification('Password should be between 8 and 16 characters.');
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    showNotification('Password should contain at least one uppercase letter.');
    return false;
  }
  if (!/[a-z]/.test(password)) {
    showNotification('Password should contain at least one lowercase letter.');
    return false;
  }
  if (!/[0-9]/.test(password)) {
    showNotification('Password should contain at least one number.');
    return false;
  }
  if (!/[!@#$%^&*]/.test(password)) {
    showNotification('Password should contain at least one special character.');
    return false;
  }

  // Validation check 4: Confirm Password
  if (password !== cnfpassword) {
    showNotification('Password and Confirm Password do not match.');
    return false;
  }

  // All checks passed, store the user credentials
  storeUserCredentials(username, email, password);

  return true;
}

document.addEventListener('DOMContentLoaded', function () {
  const registerButton = document.querySelector('.register.button-control');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const cnfPasswordInput = document.getElementById('cnfpassword');

  registerButton.addEventListener('click', validateForm);

  usernameInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      validateForm();
    }
  });

  emailInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      validateForm();
    }
  });

  passwordInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      validateForm();
    }
  });

  cnfPasswordInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      validateForm();
    }
  });
});


// if all checks passed, then register the user credentials using MySQL database
