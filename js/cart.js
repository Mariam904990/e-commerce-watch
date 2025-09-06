document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const totalItemsEl = document.getElementById("cart-total-item");
  const totalPriceEl = document.getElementById("cart-t-price");
  const checkoutBtn = document.getElementById("checkout-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
      totalItemsEl.textContent = 0;
      totalPriceEl.textContent = 0;
      return;
    }

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach((item, index) => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;

      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>$${item.price} x ${item.quantity}</p>
        </div>
        <div>
          <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="qty-input">
          <button class="remove-btn" data-index="${index}">&times;</button>
        </div>
      `;

      cartContainer.appendChild(cartItem);
    });

    totalItemsEl.textContent = totalItems;
    totalPriceEl.textContent = totalPrice.toFixed(2);

    bindEvents();
  }

  function bindEvents() {
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });

    document.querySelectorAll(".qty-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const index = e.target.dataset.index;
        const newQty = parseInt(e.target.value);
        if (newQty > 0) {
          cart[index].quantity = newQty;
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
        }
      });
    });
  }

  checkoutBtn.addEventListener("click", () => {
    alert("Proceeding to checkout...");
  });

  renderCart();
});
