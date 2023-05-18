const userNameInput = document.querySelector('.username-input');
const emailInput = document.querySelector('.email-input');
const passwordInput = document.querySelector('.password-input');
const cnfPasswordInput = document.querySelector('.cnfpassword-input');
const registerBtn = document.querySelector('.register');

// function logInputs() {
//    console.log(userNameInput.value);
//    console.log(emailInput.value);
//    console.log(passwordInput.value);
//    console.log(cnfPasswordInput.value);
// }

function showError(input) {
  const formControl = input.parentElement;
  formControl.className = 'input-container error';
}

function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = 'input-container success';
}

function validate() {
  if (userNameInput.value.trim() === '') {
    showError(userNameInput);
    alert('Please enter a username');
  } else {
    showSuccess(userNameInput);
  }

  if (userNameInput.value.length < 3) {
    showError(userNameInput);
    alert('Username must be at least 3 characters long');
  } else {
    showSuccess(userNameInput);
  }

  if (userNameInput.value.length > 10) {
    showError(userNameInput);
    alert('Username must be less than 15 characters long');
  } else {
    showSuccess(userNameInput);
  }
}

registerBtn.addEventListener('click', validate);

// Or to also log when Enter is pressed

document.addEventListener('keydown', function (event) {
  if (event.key === "Enter") {
    validate();
  }
});
