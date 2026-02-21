/* ========================================
   MAIN ENTRY POINT
   Initialize app and load all modules
   ======================================== */

// Core modules
import {
  initCart,
  getCart,
  updateQuantity,
  removeFromCart,
} from "./modules/cart.js";
import { initModals, openModal, closeModal } from "./modules/modals.js";
import { initCheckout } from "./modules/checkout.js";
import { initProductPreview } from "./modules/productPreview.js";
import { initAnimations } from "./modules/animations.js";
import { initModelViewers } from "./modules/modelViewer.js";
import { initNavigation } from "./modules/navigation.js";
import { initButtons } from "./modules/buttons.js";

// Utils
import { loadCart } from "./utils/storage.js";

/**
 * App initialization
 */
function initializeApp() {
  console.log("🚀 Initializing VintiX Mini RC App...");

  // Enable smooth scroll behavior
  document.documentElement.style.scrollBehavior = "smooth";

  // Initialize all modules
  initAnimations();
  initModelViewers();
  initNavigation();
  initButtons();
  initCart();
  initModals();
  initCheckout();
  initProductPreview();

  // Load cart from storage
  loadCart();

  // Setup checkout button with cart validation
  setupCheckoutValidation();

  // Setup error handling
  setupErrorHandlers();

  console.log("✅ App initialized successfully");
}

/**
 * Setup checkout validation
 */
function setupCheckoutValidation() {
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
      const cart = getCart();
      if (cart.length === 0) {
        e.preventDefault();
        alert("Your cart is empty!");
      }
    });
  }
}

/**
 * Setup error handlers
 */
function setupErrorHandlers() {
  // Handle model loading errors
  document.addEventListener(
    "error",
    (event) => {
      if (event.target.tagName === "MODEL-VIEWER") {
        console.error("Failed to load 3D model:", event.target.src);
      }
    },
    true,
  );

  // Handle global errors
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error || event.message);
  });

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled rejection:", event.reason);
  });
}

/**
 * DOM ready handler
 */
document.addEventListener("DOMContentLoaded", initializeApp);

// Make global functions available for inline HTML calls (onclick handlers)
// These are needed because inline onclick attributes can't access ES6 module exports
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
