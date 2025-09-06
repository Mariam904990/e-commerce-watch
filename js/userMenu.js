const UserMenu = {
  init() {
    console.log("UserMenu.init() called");
    this.el = document.getElementById("userMenu");
    if (!this.el) {
      console.warn("UserMenu: #userMenu element not found in DOM");
      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("UserMenu: loggedInUser =", loggedInUser);

    if (loggedInUser) {
      // show name + dropdown
      this.el.innerHTML = `
        <a href="#" class="user-link" id="userLink" aria-haspopup="true" aria-expanded="false">
          <i class="fa-solid fa-user"></i> ${loggedInUser.firstName}
        </a>
        <ul class="dropdown" id="userDropdown" role="menu" aria-hidden="true">
          <li><a href="profile.html">Profile</a></li>
          <li><a href="#" id="logoutBtn">Logout</a></li>
        </ul>
      `;
    } else {
      // fallback: keep the login link
      this.el.innerHTML = `<a href="login.html" id="loginLink"><i class="fa-solid fa-user"></i></a>`;
    }

    this.bindEvents();
  },

  bindEvents() {
    // delegate within this.el (safer)
    const dropdown = this.el.querySelector("#userDropdown");
    const userLink = this.el.querySelector("#userLink");
    const logoutBtn = this.el.querySelector("#logoutBtn");
    const loginLink = this.el.querySelector("#loginLink");

    if (userLink && dropdown) {
      userLink.addEventListener("click", (e) => {
        e.preventDefault();
        const isShown = dropdown.classList.toggle("show");
        userLink.setAttribute("aria-expanded", isShown ? "true" : "false");
        dropdown.setAttribute("aria-hidden", isShown ? "false" : "true");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("cart");

        const cartCount = document.getElementById("cart-count");
        if (cartCount) cartCount.textContent = "0";

        console.log("UserMenu: user logged out, cart cleared");
        window.location.reload();
      });
    }

    // close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#userMenu")) {
        if (dropdown && dropdown.classList.contains("show")) {
          dropdown.classList.remove("show");
          const ul = this.el.querySelector("#userLink");
          if (ul) ul.setAttribute("aria-expanded", "false");
          dropdown.setAttribute("aria-hidden", "true");
        }
      }
    });

    // keyboard: Esc to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (dropdown && dropdown.classList.contains("show")) {
          dropdown.classList.remove("show");
          const ul = this.el.querySelector("#userLink");
          if (ul) ul.setAttribute("aria-expanded", "false");
          dropdown.setAttribute("aria-hidden", "true");
        }
      }
    });
  },
};

export default UserMenu;
