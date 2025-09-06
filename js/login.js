// // login.js
const LoginForm = {
  init() {
    this.form = document.getElementById("loginForm");
    this.inputs = {
      loginEmail: document.getElementById("loginEmail"),
      loginPassword: document.getElementById("loginPassword"),
    };
    this.errors = {
      loginEmail: document.getElementById("loginEmailError"),
      loginPassword: document.getElementById("loginPasswordError"),
    };

    this.rules = {
      loginEmail: {
        test: (v) => /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(v),
        msg: "Invalid email format",
      },
      loginPassword: {
        test: (v) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/.test(v),
        msg: "Password must be 8+ chars, include upper, lower, number & symbol",
      },
    };

    if (this.form) {
      Object.values(this.inputs).forEach((input) => {
        input.addEventListener("input", () => this.validateField(input));
        input.addEventListener("blur", () => this.validateField(input));
      });

      // submit
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
    // forgot password form
    const forgotForm = document.getElementById("forgotForm");
    if (forgotForm) {
      forgotForm.addEventListener("submit", (e) =>
        this.handleForgotPassword(e)
      );
    }
    const closeBtn = document.getElementById("closeForgot");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        document.getElementById("forgotPopup").classList.remove("show");
        document.getElementById("popupOverlay").classList.remove("show");

        // reset inputs & messages
        document.getElementById("forgotEmail").value = "";
        document.getElementById("forgotEmailError").style.display = "none";
        document.getElementById("forgotResultMsg").style.display = "none";
      });
    }

    // open forgot popup
    const forgotLink = document.getElementById("forgotLink");
    if (forgotLink) {
      forgotLink.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("popupOverlay").classList.add("show");
        document.getElementById("forgotPopup").classList.add("show");
      });
    }
  },

  validateField(input) {
    const { value, id } = input;
    if (input.hasAttribute("required") && !value.trim()) {
      return this.showError(input, false, `${input.placeholder} is required`);
    }
    return this.showError(
      input,
      this.rules[id].test(value),
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

  handleSubmit(e) {
    e.preventDefault();
    let isValid = true;

    Object.values(this.inputs).forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
        input.focus();
      }
    });

    if (!isValid) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let matchedUser = users.find(
      (user) =>
        user.email === this.inputs.loginEmail.value &&
        user.password === this.inputs.loginPassword.value
    );

    if (matchedUser) {
      localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));

      const popup = document.getElementById("loginPopup");
      popup.classList.add("show");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      this.showError(
        this.inputs.loginPassword,
        false,
        "Invalid email or password"
      );
      this.inputs.loginPassword.focus();
    }
    this.form.reset();

    Object.values(this.errors).forEach((el) => (el.style.display = "none"));
  },
  handleForgotPassword(e) {
    e.preventDefault();
    const emailInput = document.getElementById("forgotEmail");
    const errorEl = document.getElementById("forgotEmailError");
    const resultMsg = document.getElementById("forgotResultMsg");

    if (!emailInput.value.trim()) {
      errorEl.textContent = "Email is required";
      errorEl.style.display = "block";
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let matchedUser = users.find((user) => user.email === emailInput.value);

    if (matchedUser) {
      resultMsg.textContent = `Your password is: ${matchedUser.password}`;
      resultMsg.style.color = "green";
    } else {
      resultMsg.textContent = "No account found with this email.";
      resultMsg.style.color = "red";
    }
    resultMsg.style.display = "block";
    // close popup
    // document.getElementById("forgotPopup").classList.remove("show");
    // document.getElementById("popupOverlay").classList.remove("show");

    emailInput.value = "";
    errorEl.style.display = "none";
  },
};

export default LoginForm;
