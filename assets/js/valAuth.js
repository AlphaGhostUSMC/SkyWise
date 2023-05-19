const userNameInput = document.querySelector('.username-input');
const emailInput = document.querySelector('.email-input');
const passwordInput = document.querySelector('.password-input');
const cnfPasswordInput = document.querySelector('.cnfpassword-input');
const registerBtn = document.querySelector('.register');
// const.eyeIcon = document.querySelector('#eyeIcon');

function togglePasswordVisibility(inputId, iconId) {
  var passwordInput = document.getElementById(inputId);
  var eyeIcon = document.getElementById(iconId);

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
}


function showError(input) {
  const formControl = input.parentElement;
  formControl.className = 'input-container error';
}

function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = 'input-container success';
}