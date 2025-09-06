const CartSidebar = {
  init() {
    this.sidebar = document.getElementById("cart-sidebar");
    this.overlay = document.getElementById("overlay");
    this.cartItemsEl = document.getElementById("cart-items");
    this.totalItemsEl = document.getElementById("cart-total-items");
    this.totalPriceEl = document.getElementById("cart-total-price");
    this.closeBtn = document.getElementById("close-cart");
    this.goToCartBtn = document.getElementById("go-to-cart");
    this.cartCountEl = document.getElementById("cart-count");
    if (!this.sidebar || !this.cartItemsEl) return;

    this.bindEvents();
    this.renderCart();
  },

  bindEvents() {
    // close sidebar
    this.closeBtn.addEventListener("click", () => this.close());
    this.overlay.addEventListener("click", () => this.close());

    // go to cart page
    this.goToCartBtn.addEventListener("click", () => {
      window.location.href = "cart.html";
    });

    // icon in header (افترض انه id="cart-icon")
    const cartIcon = document.getElementById("cart-icon");
    if (cartIcon) {
      cartIcon.addEventListener("click", () => this.open());
    }
  },

  open() {
    this.sidebar.classList.add("open");
    this.overlay.classList.add("show");
    this.renderCart();
  },

  close() {
    this.sidebar.classList.remove("open");
    this.overlay.classList.remove("show");
  },

  getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  },

  saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  },

  updateCartCount() {
    const cart = this.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (this.cartCountEl) this.cartCountEl.textContent = totalItems;
  },

  renderCart() {
    const cart = this.getCart();
    this.cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
      this.cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      cart.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p>Price: $${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
            <div class="actions">
              <button class="decrease"><span>-</span></button>
              <button class="increase"><span>+</span></button>
              <button class="remove-btn"><span>Remove</span></button>
            </div>
          </div>
        `;

        // events
        div.querySelector(".decrease").addEventListener("click", () => {
          this.updateQuantity(item.id, item.quantity - 1);
        });
        div.querySelector(".increase").addEventListener("click", () => {
          this.updateQuantity(item.id, item.quantity + 1);
        });
        div.querySelector(".remove-btn").addEventListener("click", () => {
          this.removeItem(item.id);
        });

        this.cartItemsEl.appendChild(div);
      });
    }

    this.updateSummary();
  },

  updateSummary() {
    const cart = this.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    this.totalItemsEl.textContent = totalItems;
    this.totalPriceEl.textContent = totalPrice.toFixed(2);
    this.updateCartCount();
  },

  updateQuantity(productId, newQty) {
    let cart = this.getCart();
    const index = cart.findIndex((item) => item.id === productId);
    if (index > -1) {
      if (newQty <= 0) cart.splice(index, 1);
      else cart[index].quantity = newQty;
      this.saveCart(cart);
      this.renderCart();
    }
  },

  removeItem(productId) {
    let cart = this.getCart().filter((item) => item.id !== productId);
    this.saveCart(cart);
    this.renderCart();
  },
};
export { CartSidebar };
