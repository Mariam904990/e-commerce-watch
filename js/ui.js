const Loader = {
  init() {
    document.body.classList.add("loading");

    window.addEventListener("load", () => {
      const loader = document.getElementById("loader");
      const content = document.querySelector(".content");

      if (!loader || !content) return;

      loader.classList.add("fade-bg");

      setTimeout(() => loader.classList.add("fade-img"), 1000);

      setTimeout(() => {
        loader.style.display = "none";
      }, 5000);

      content.style.display = "block";
    });
  },
};

const Sidebar = {
  init() {
    this.hamburger = document.getElementById("hamburger");
    this.navSidebar = document.getElementById("navSidebar");
    this.closeBtn = document.getElementById("closeBtn");
    this.overlay = document.getElementById("overlay");

    if (this.hamburger && this.navSidebar && this.closeBtn && this.overlay) {
      this.hamburger.addEventListener("click", () =>
        this.navSidebar.style.left === "0px"
          ? this.closeSidebar()
          : this.openSidebar()
      );

      this.closeBtn.addEventListener("click", () => this.closeSidebar());
      this.overlay.addEventListener("click", () => this.closeSidebar());
    }
  },

  openSidebar() {
    this.navSidebar.style.left = "0";
    this.overlay.style.display = "block";
  },

  closeSidebar() {
    this.navSidebar.style.left = "-250px";
    this.overlay.style.display = "none";
  },
};

const ScrollTop = {
  init() {
    this.btn = document.getElementById("backToTop");

    if (this.btn) {
      window.addEventListener("scroll", () => this.toggleVisibility());
      this.btn.addEventListener("click", () => this.scrollToTop());
    }
  },

  toggleVisibility() {
    if (window.scrollY > 300) {
      this.btn.style.display = "block";
    } else {
      this.btn.style.display = "none";
    }
  },

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
};

const CategoryFilter = {
  categoryLinks: document.querySelectorAll(".product-category-nav a"),
  productContainer: document.querySelector(".product-category-boxes"),

  orders: {
    classico: [0, 1, 2, 3, 4],
    executive: [2, 0, 4, 1, 3],
    sports: [4, 3, 2, 0, 1],
    dialer: [1, 3, 0, 4, 2],
  },

  init() {
    this.categoryLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.setActive(link);
        this.reorder(link.dataset.category);
      });
    });
  },

  setActive(link) {
    this.categoryLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  },

  reorder(category) {
    const order = this.orders[category];
    const boxes = Array.from(this.productContainer.children);
    const newOrder = order.map((i) => boxes[i]);

    this.productContainer.innerHTML = "";
    newOrder.forEach((box) => this.productContainer.appendChild(box));
  },
};
const CountdownModule = {
  countDownDate: null,
  timer: null,

  init(daysToAdd = 100, shopSelector = ".shop-btn", url = "shop.html") {
    this.countDownDate = new Date();
    this.countDownDate.setDate(this.countDownDate.getDate() + daysToAdd);

    this.timer = setInterval(() => this.updateCountdown(), 1000);
    this.updateCountdown();
    const shopButtons = document.querySelectorAll(shopSelector);
    if (shopButtons.length) {
      shopButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          window.location.href = url;
        });
      });
    }
  },
  updateCountdown() {
    const now = new Date().getTime();
    const distance = this.countDownDate - now;

    if (distance < 0) {
      document.querySelector(".counter-boxes").innerHTML = "<h4>Expired</h4>";
      clearInterval(this.timer);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.setText("days", days);
    this.setText("hours", hours.toString().padStart(2, "0"));
    this.setText("minutes", minutes.toString().padStart(2, "0"));
    this.setText("seconds", seconds.toString().padStart(2, "0"));
  },

  setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  },
};

document.addEventListener("DOMContentLoaded", () => {
  CountdownModule.init(100);
});
const QuoteSlider = {
  wrapper: document.querySelector(".quote-slides-wrapper"),
  slides: document.querySelectorAll(".quote-slide"),
  currentIndex: 0,
  prevBtn: document.getElementById("quote-prev"),
  nextBtn: document.getElementById("quote-next"),

  init() {
    if (this.slides.length === 0) return;

    this.updateSlide();

    if (this.prevBtn && this.nextBtn) {
      this.prevBtn.addEventListener("click", () => this.prevSlide());
      this.nextBtn.addEventListener("click", () => this.nextSlide());
    }
  },

  updateSlide() {
    const offset = -this.currentIndex * 100;
    this.wrapper.style.transform = `translateX(${offset}%)`;
  },

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlide();
  },

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlide();
  },
};

export {
  Loader,
  Sidebar,
  ScrollTop,
  CategoryFilter,
  CountdownModule,
  QuoteSlider,
};
