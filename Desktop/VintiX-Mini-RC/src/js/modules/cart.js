/* ========================================
   MODULE: CART MANAGEMENT
   Handle shopping cart operations
   ======================================== */

import { formatIDR } from "../utils/formatter.js";
import { saveCart, loadCart } from "../utils/storage.js";
import { CONFIG } from "../config.js";
import { openModal } from "./modals.js";

let cart = [];

/**
 * Initialize cart from localStorage
 */
export function initCart() {
  cart = loadCart();

  // Ensure all cart items have model paths (for legacy items)
  cart = cart.map((item) => {
    if (!item.model) {
      item.model = getModelPathByProduct(item.name);
    }
    return item;
  });

  setupCartEventListeners();
  updateCart();
}

/**
 * Setup cart event listeners
 */
function setupCartEventListeners() {
  const addToCartButtons = document.querySelectorAll(".btn-add-cart");
  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", handleAddToCart);
  });

  const cartIcon = document.getElementById("cartIcon");
  if (cartIcon) {
    cartIcon.addEventListener("click", () => openModal("cartModal"));
  }
}

/**
 * Handle add to cart button click
 */
function handleAddToCart(e) {
  e.preventDefault();
  const product = this.dataset.product;
  const price = parseFloat(this.dataset.price);

  addToCart(product, price);
  showCartNotification(product);
}

/**
 * Add item to cart
 * @param {string} product - Product name
 * @param {number} price - Product price
 */
export function addToCart(product, price) {
  const productCard = Array.from(
    document.querySelectorAll(".product-card"),
  ).find((card) => card.dataset.product === product.toUpperCase());

  // Try to get model from card first, then from config
  let modelPath = productCard?.dataset.model;
  if (!modelPath) {
    modelPath = getModelPathByProduct(product);
  }

  const existingItem = cart.find((item) => item.name === product);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: Date.now(),
      name: product,
      price: price,
      quantity: 1,
      model: modelPath || "",
    });
  }

  updateCart();
  saveCart(cart);
}

/**
 * Get model path by product name
 * @param {string} productName - Product name
 * @returns {string} Model path
 */
function getModelPathByProduct(productName) {
  const modelMap = {
    "RC HIGHWAYMAN": CONFIG.MODELS.RC_HIGHWAYMAN,
    "RC ANNIHILATOR": CONFIG.MODELS.RC_ANNIHILATOR,
    "RC SHVAN": CONFIG.MODELS.RC_SHVAN,
    "FORTNITE TIME MACHINE": CONFIG.MODELS.FORTNITE_BTTF,
  };
  return modelMap[productName] || "";
}

/**
 * Remove item from cart
 * @param {number} itemId - Item ID
 */
export function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  updateCart();
  saveCart(cart);
}

/**
 * Update item quantity
 * @param {number} itemId - Item ID
 * @param {number} quantity - New quantity
 */
export function updateQuantity(itemId, quantity) {
  const item = cart.find((item) => item.id === itemId);
  if (item) {
    const newQuantity = Math.max(1, parseInt(quantity) || 1);
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    item.quantity = newQuantity;
    updateCart();
    saveCart(cart);
  }
}

/**
 * Update cart display
 */
export function updateCart() {
  const cartItemsContainer = document.getElementById("cartItems");

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  // Update cart display
  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart">Your cart is empty. Start shopping!</p>';
  } else {
    cartItemsContainer.innerHTML = cart
      .map((item) => {
        const modelHTML = item.model
          ? `<model-viewer src="${item.model}" alt="${item.name}" auto-rotate shadow-intensity="1" style="width: 100%; height: 100%; display: block;"></model-viewer>`
          : `<div style="background: #f5f5f5; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 10px; text-align: center; color: #999; padding: 5px; box-sizing: border-box;">No 3D<br>Model</div>`;

        return `
      <div class="cart-item">
        <div class="cart-item-viewer">
          ${modelHTML}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatIDR(item.price)}</div>
        </div>
        <div class="cart-item-quantity">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
          <span style="width: 30px; text-align: center;">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
      })
      .join("");
  }

  updateSummary();
  updateCheckoutSummary();

  // Initialize model viewers in cart
  initializeCartModelViewers();
}

/**
 * Initialize model viewers in cart
 */
function initializeCartModelViewers() {
  const cartViewers = document.querySelectorAll(
    ".cart-item-viewer model-viewer",
  );
  cartViewers.forEach((viewer) => {
    // Ensure model viewer is loaded and configured correctly
    if (!viewer.hasAttribute("auto-rotate")) {
      viewer.setAttribute("auto-rotate", "");
    }
    if (!viewer.hasAttribute("shadow-intensity")) {
      viewer.setAttribute("shadow-intensity", "1");
    }
    // Disable camera controls to prevent user interaction
    if (viewer.hasAttribute("camera-controls")) {
      viewer.removeAttribute("camera-controls");
    }
  });
}

/**
 * Update cart summary
 */
function updateSummary() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * CONFIG.TAX_RATE;
  const total = subtotal + tax;

  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");

  if (subtotalEl) subtotalEl.textContent = formatIDR(subtotal);
  if (taxEl) taxEl.textContent = formatIDR(tax);
  if (totalEl) totalEl.textContent = formatIDR(total);
}

/**
 * Update checkout summary
 */
function updateCheckoutSummary() {
  const checkoutItemsContainer = document.getElementById("checkoutItems");

  if (cart.length === 0) {
    checkoutItemsContainer.innerHTML =
      '<p class="empty-cart">Your cart is empty.</p>';
  } else {
    checkoutItemsContainer.innerHTML = cart
      .map(
        (item) => `
      <div class="summary-row">
        <span>${item.name} x${item.quantity}</span>
        <span>${formatIDR(item.price * item.quantity)}</span>
      </div>
    `,
      )
      .join("");
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * CONFIG.TAX_RATE;
  const total = subtotal + tax;

  const totalEl = document.getElementById("checkoutTotal");
  if (totalEl) totalEl.textContent = formatIDR(total);
}

/**
 * Show cart notification
 * @param {string} product - Product name
 */
export function showCartNotification(product) {
  if (!product) return;

  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background-color: var(--primary-red);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    animation: slideInRight 0.3s ease;
    font-weight: bold;
  `;
  notification.textContent = `✓ ${product} added to cart!`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.3s ease";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

/**
 * Get current cart
 * @returns {Array} Cart items
 */
export function getCart() {
  return cart;
}

/**
 * Clear cart
 */
export function clearCartItems() {
  cart = [];
  updateCart();
  saveCart(cart);
}
