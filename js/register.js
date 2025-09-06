const RegisterForm = {
  form: document.getElementById("registerForm"),
  inputs: {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
  },
  errors: {
    firstName: document.getElementById("firstNameError"),
    lastName: document.getElementById("lastNameError"),
    email: document.getElementById("emailError"),
    password: document.getElementById("passwordError"),
    confirmPassword: document.getElementById("confirmPasswordError"),
  },
  strengthMessage: document.getElementById("strengthMessage"),
  togglePassword: document.getElementById("togglePassword"),

  rules: {
    firstName: {
      test: (v) => /^[A-Za-z]{2,20}$/.test(v),
      msg: "First name must be 2-20 letters only",
    },
    lastName: {
      test: (v) => /^[A-Za-z]{2,20}$/.test(v),
      msg: "Last name must be 2-20 letters only",
    },
    email: {
      test: (v) => /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(v),
      msg: "Invalid email format",
    },
    password: {
      test: (v) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/.test(v),
      msg: "Password must be 8+ chars, include upper, lower, number & symbol",
    },
    confirmPassword: {
      test: (v, inputs) => v === inputs.password.value && v !== "",
      msg: "Passwords do not match",
    },
  },

  validateField(input) {
    const { value, id } = input;
    if (input.hasAttribute("required") && !value.trim()) {
      return this.showError(input, false, `${input.placeholder} is required`);
    }
    return this.showError(
      input,
      this.rules[id].test(value, this.inputs),
      this.rules[id].msg
    );
  },

  showError(input, valid, message) {
    const errorEl = this.errors[input.id];
    if (!valid) {
      input.classList.add("error");
      errorEl.textContent = message;
      errorEl.style.display = "block";
      return false;
    }
    input.classList.remove("error");
    errorEl.style.display = "none";
    return true;
  },

  init() {
    if (!this.form) return;
    if (!this.togglePassword || !this.inputs.password || !this.strengthMessage)
      return;
    // Toggle Password
    this.togglePassword.addEventListener("click", () => {
      if (this.inputs.password.type === "password") {
        this.inputs.password.type = "text";
        this.togglePassword.textContent = ":)";
      } else {
        this.inputs.password.type = "password";
        this.togglePassword.textContent = "👁";
      }
    });

    // Password strength checker
    this.inputs.password.addEventListener("input", () => {
      const val = this.inputs.password.value;
      let strength = "Weak",
        color = "red";
      if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/.test(val)) {
        strength = "Strong";
        color = "green";
      } else if (val.length >= 6) {
        strength = "Medium";
        color = "orange";
      }
      this.strengthMessage.textContent = `Password Strength: ${strength}`;
      this.strengthMessage.style.color = color;
    });

    // Input validation events
    Object.values(this.inputs).forEach((input) => {
      input.addEventListener("input", () => this.validateField(input));
      input.addEventListener("blur", () => this.validateField(input));
    });

    // Submit handler
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalid = null;

      for (let input of Object.values(this.inputs)) {
        if (!this.validateField(input)) {
          isValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      }

      if (!isValid) {
        firstInvalid.focus();
        return;
      }

      const newUser = {
        firstName: this.inputs.firstName.value,
        lastName: this.inputs.lastName.value,
        email: this.inputs.email.value,
        password: this.inputs.password.value,
      };

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const exists = users.some((u) => u.email === newUser.email);
      if (exists) {
        this.showError(this.inputs.email, false, "Email already exists!");
        this.inputs.email.focus();
        return;
      }

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", JSON.stringify(newUser));

      this.form.reset();
      Object.values(this.errors).forEach((el) => (el.style.display = "none"));
      this.strengthMessage.textContent = "";

      const popup = document.getElementById("successPopup");
      popup.classList.add("show");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    });
  },
};

export default RegisterForm;
