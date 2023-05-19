const userNameInput = document.querySelector('.username-input');
const emailInput = document.querySelector('.email-input');
const passwordInput = document.querySelector('.password-input');
const cnfPasswordInput = document.querySelector('.cnfpassword-input');
const registerBtn = document.querySelector('.register');

function togglePasswordVisibility(inputId, iconId) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.getElementById(iconId);

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

function passwordMatchIndicator() {
  const passwordInput = document.getElementById("password");
  const cnfPasswordInput = document.getElementById("cnfpassword");
  const passwordIcon = document.getElementById("key1");
  const cnfPasswordIcon = document.getElementById("key2");

  if (passwordInput.value === cnfPasswordInput.value) {
    passwordIcon.style.color = "var(--success-color)";
    cnfPasswordIcon.style.color = "var(--success-color)";
  } else {
    passwordIcon.style.color = "var(--error-color)";
    cnfPasswordIcon.style.color = "var(--error-color)";
  }

  if (passwordInput.value === "" && cnfPasswordInput.value === "") {
    passwordIcon.style.removeProperty("color");
    cnfPasswordIcon.style.removeProperty("color");
  }
}