/* ========================================
   MODULE: CHECKOUT & PAYMENT
   Handle payment and checkout flow
   ======================================== */

import { formatIDR } from "../utils/formatter.js";
import { CONFIG } from "../config.js";
import { openModal, closeModal } from "./modals.js";
import { getCart, clearCartItems } from "./cart.js";

/**
 * Initialize checkout functionality
 */
export function initCheckout() {
  const checkoutForm = document.getElementById("checkoutForm");
  const payBtn = document.getElementById("payBtn");

  if (payBtn) {
    payBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (!checkoutForm || !checkoutForm.checkValidity()) {
        alert("Please fill in all required fields");
        payBtn.focus();
        return;
      }

      processPayment();
    });
  }
}

/**
 * Process payment
 */
function processPayment() {
  const payBtn = document.getElementById("payBtn");
  const originalText = payBtn.textContent;

  payBtn.disabled = true;
  payBtn.textContent = "PROCESSING...";

  setTimeout(() => {
    // Calculate total
    const cart = getCart();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const total = subtotal + subtotal * CONFIG.TAX_RATE;

    showPaymentSuccess(total);

    // Clear cart
    clearCartItems();

    // Reset button
    payBtn.disabled = false;
    payBtn.textContent = originalText;

    // Close checkout modal
    closeModal("checkoutModal");
  }, CONFIG.PAYMENT_TIMEOUT);
}

/**
 * Show payment success modal
 * @param {number} totalAmount - Total paid amount
 */
function showPaymentSuccess(totalAmount) {
  const orderId =
    "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  const orderIdEl = document.getElementById("orderId");
  const paidAmountEl = document.getElementById("paidAmount");

  if (orderIdEl) orderIdEl.textContent = orderId;
  if (paidAmountEl) paidAmountEl.textContent = formatIDR(totalAmount);

  openModal("successModal");

  const continueBtn = document.getElementById("continueShoppingBtn");
  if (continueBtn) {
    continueBtn.onclick = () => {
      closeModal("successModal");
      location.reload();
    };
  }
}

/**
 * Validate form
 * @returns {boolean} True if form is valid
 */
export function validateCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  return form ? form.checkValidity() : false;
}
