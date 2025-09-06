document.addEventListener("DOMContentLoaded", () => {
  const productData = JSON.parse(localStorage.getItem("selectedProduct"));
  const cartCountEl = document.getElementById("cart-count");

  // --- CART COUNT FUNCTION ---
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) cartCountEl.textContent = totalItems;
  }

  updateCartCount();

  // --- PRODUCT DETAILS RENDER ---
  if (!productData) {
    document.getElementById("product-details").innerHTML =
      "<p>No product selected.</p>";
    return;
  }

  document.getElementById("product-details").innerHTML = `
    <div class="details-card">
      <img src="${productData.image}" alt="${productData.name}" />
      <div class="details-info">
        <h2>${productData.name}</h2>
        <p>Price: $${productData.price}</p>
        <p>Company: ${productData.company || "Unknown"}</p>
        <p>
          Rating:
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
        </p>
        <p>Color: ${productData.color || "-"}</p>
        <p>Stock: ${
          productData.stock === "true" ? "Available" : "Out of stock"
        }</p>
        <p>Quantity: <input type="number" id="qty" value="1" min="1" /></p>
        <button id="add-to-cart"><span>Add to Cart</span></button>
      </div>
    </div>
  `;

  // --- ADD TO CART LOGIC ---
  document.getElementById("add-to-cart").addEventListener("click", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      showMessage("❌ You must log in before adding to cart!", "error");
      return;
    }

    const qty = parseInt(document.getElementById("qty").value);
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((p) => p.id === productData.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ ...productData, quantity: qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showMessage("✅ Product added to cart!", "success");
  });

  // --- TABS BEHAVIOR (Description / Shipping / Reviews) ---
  const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
  const panels = Array.from(document.querySelectorAll(".tab-panel"));

  function activateTab(index, pushState = true) {
    tabButtons.forEach((b, i) => {
      const selected = i === index;
      b.classList.toggle("active", selected);
      b.setAttribute("aria-selected", selected ? "true" : "false");
      panels[i].hidden = !selected;
    });
    if (pushState && window.history && window.location) {
      const id = tabButtons[index].getAttribute("aria-controls");
      history.replaceState(null, "", `#${id}`);
    }
  }

  tabButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => activateTab(i));
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") activateTab((i + 1) % tabButtons.length);
      if (e.key === "ArrowLeft")
        activateTab((i - 1 + tabButtons.length) % tabButtons.length);
    });
  });

  // Open correct tab from URL hash if present
  const hash = window.location.hash.replace("#", "");
  const indexFromHash = tabButtons.findIndex(
    (b) => b.getAttribute("aria-controls") === hash
  );
  activateTab(indexFromHash >= 0 ? indexFromHash : 0, false);

  // --- REVIEW FORM (local only) ---
  document
    .getElementById("reviewForm")
    ?.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("reviewerName").value.trim();
      const rating = document.getElementById("reviewRating").value;
      const text = document.getElementById("reviewText").value.trim();
      if (!name || !rating || !text) return alert("Please fill all fields.");

      const reviewContainer = document.querySelector(".reviews-list");
      const article = document.createElement("article");
      article.className = "review";
      article.innerHTML = `
      <strong>${escapeHtml(name)}</strong>
      <span class="rating">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</span>
      <p>${escapeHtml(text)}</p>
    `;
      reviewContainer.prepend(article);

      this.reset();
      alert("Thanks — your review has been added!");
    });

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[m];
    });
  }
});
function showMessage(text, type = "success") {
  const msg = document.createElement("div");
  msg.className = `cart-message ${type}`;
  msg.textContent = text;
  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 3000);
}
