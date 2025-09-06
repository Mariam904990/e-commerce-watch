const ShopPage = {
  currentPage: 1,
  productsPerPage: 6,
  products: [],
  cart: [],

  init() {
    this.products = Array.from(document.querySelectorAll(".product-card"));
    this.cartCount = document.getElementById("cart-count");
    this.paginationContainer = document.getElementById("pagination");

    this.availabilityFilters = Array.from(
      document.querySelectorAll("input[name='availability']")
    );
    this.typeFilters = Array.from(
      document.querySelectorAll("input[name='type']")
    );
    this.colorFilters = Array.from(
      document.querySelectorAll("input[name='color']")
    );

    this.priceFilter = document.getElementById("priceRange");
    this.priceValue = document.getElementById("priceValue");

    this.products.forEach((p) => {
      if (typeof p.dataset.visible === "undefined") p.dataset.visible = "true";
    });

    this.loadCart();
    this.bindEvents();
    this.applyFilters();
    this.renderPagination();
    this.showPage(1);
  },

  bindEvents() {
    const allFilters = [
      ...this.availabilityFilters,
      ...this.typeFilters,
      ...this.colorFilters,
    ];
    allFilters.forEach((f) =>
      f.addEventListener("change", () => {
        this.applyFilters();
        this.renderPagination();
        this.showPage(1);
      })
    );

    if (this.priceFilter) {
      this.priceFilter.addEventListener("input", () => {
        if (this.priceValue)
          this.priceValue.textContent = this.priceFilter.value;
        this.applyFilters();
        this.renderPagination();
        this.showPage(1);
      });
    }

    document.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".add-to-cart, .add-cart-btn");
      if (addBtn) {
        const productCard = addBtn.closest(".product-card");
        if (productCard) this.addToCart(productCard);
        return;
      }

      const detailBtn = e.target.closest(".product-detail");
      if (detailBtn) {
        const productCard = detailBtn.closest(".product-card");
        if (productCard) {
          // Collect full product data
          const product = {
            id: productCard.dataset.id,
            name: productCard.querySelector("h4")?.textContent || "Product",
            price: Number(productCard.dataset.price) || 0,
            image: productCard.querySelector("img")?.src || "",
            stock: productCard.dataset.stock || "true",
            type: productCard.dataset.type || "",
            color: productCard.dataset.color || "",
            rating: productCard.dataset.rating || 0,
            company: productCard.dataset.company || "",
          };
          localStorage.setItem("selectedProduct", JSON.stringify(product));
          window.location.href = "product-details.html";
        }
      }
    });
  },

  applyFilters() {
    const selectedAvailability =
      this.availabilityFilters.find((f) => f.checked)?.value || null;
    const selectedTypes = this.typeFilters
      .filter((f) => f.checked)
      .map((f) => f.value);
    const selectedColors = this.colorFilters
      .filter((f) => f.checked)
      .map((f) => f.value);
    const maxPrice = this.priceFilter
      ? Number(this.priceFilter.value)
      : Infinity;

    this.products.forEach((product) => {
      const inStock = String(product.dataset.stock) === "true";
      const type = product.dataset.type || "";
      const color = product.dataset.color || "";
      const price = Number(product.dataset.price) || 0;

      let visible = true;
      if (selectedAvailability === "in" && !inStock) visible = false;
      if (selectedAvailability === "out" && inStock) visible = false;
      if (selectedTypes.length && !selectedTypes.includes(type))
        visible = false;
      if (selectedColors.length && !selectedColors.includes(color))
        visible = false;
      if (price > maxPrice) visible = false;

      product.dataset.visible = visible ? "true" : "false";
    });
  },

  renderPagination() {
    if (!this.paginationContainer) return;

    const visibleProducts = this.products.filter(
      (p) => p.dataset.visible !== "false"
    );
    const totalPages = Math.max(
      1,
      Math.ceil(visibleProducts.length / this.productsPerPage)
    );

    this.paginationContainer.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "« Prev";
    prevBtn.disabled = this.currentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (this.currentPage > 1) this.showPage(this.currentPage - 1);
    });
    this.paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === this.currentPage) btn.classList.add("active");
      btn.addEventListener("click", () => this.showPage(i));
      this.paginationContainer.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next »";
    nextBtn.disabled = this.currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (this.currentPage < totalPages) this.showPage(this.currentPage + 1);
    });
    this.paginationContainer.appendChild(nextBtn);
  },

  showPage(page) {
    this.currentPage = page;
    const visibleProducts = this.products.filter(
      (p) => p.dataset.visible !== "false"
    );
    const start = (page - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    visibleProducts.forEach((p, idx) => {
      p.style.display = idx >= start && idx < end ? "" : "none";
    });
    this.products
      .filter((p) => p.dataset.visible === "false")
      .forEach((p) => (p.style.display = "none"));
    this.renderPagination();
  },

  addToCart(productCard) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      this.showPopup("❌ Please login first!", "error");
      return;
    }

    const qtyInput = productCard.querySelector('input[type="number"]');
    const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value) || 1) : 1;

    const product = {
      id: productCard.dataset.id || Date.now(),
      name: productCard.querySelector("h4")?.textContent || "Product",
      price: Number(productCard.dataset.price) || 0,
      quantity: qty,
      image: productCard.querySelector("img")?.src || "",
    };

    const existing = this.cart.find((p) => p.id == product.id);
    if (existing) existing.quantity += qty;
    else this.cart.push(product);

    this.saveCart();
    this.updateCartUI();
    this.showPopup("✅ Product added to cart!", "success");
  },

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  },

  loadCart() {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) this.cart = savedCart;
    this.updateCartUI();
  },

  updateCartUI() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (this.cartCount) this.cartCount.textContent = totalItems;
    console.log("🛒 Cart:", this.cart);
  },
  showPopup(message, type) {
    let popup = document.getElementById("cart-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "cart-popup";
      popup.className = "cart-message";
      document.body.appendChild(popup);
    }

    popup.textContent = message;
    popup.className = `cart-message ${type}`;
    popup.style.display = "block";

    setTimeout(() => {
      popup.style.display = "none";
    }, 3000);
  },
};

document.addEventListener("DOMContentLoaded", () => ShopPage.init());
