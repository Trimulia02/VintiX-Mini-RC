/* ========================================
   MODULE: MODAL MANAGEMENT
   Handle modal open/close operations
   ======================================== */

/**
 * Initialize modal event listeners
 */
export function initModals() {
  setupCloseButtons();
  setupBackdropClose();
  setupCheckoutButton();
}

/**
 * Setup close button listeners
 */
function setupCloseButtons() {
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modalId = btn.dataset.modal;
      closeModal(modalId);
    });
  });

  document.querySelectorAll("[data-modal]").forEach((btn) => {
    if (btn.classList.contains("btn-secondary")) {
      btn.addEventListener("click", () => {
        const modalId = btn.dataset.modal;
        closeModal(modalId);
      });
    }
  });
}

/**
 * Setup backdrop click to close
 */
function setupBackdropClose() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
}

/**
 * Setup checkout button
 */
function setupCheckoutButton() {
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      // Cart check is in main.js with cart module access
      closeModal("cartModal");
      openModal("checkoutModal");
    });
  }
}

/**
 * Open modal
 * @param {string} modalId - Modal element ID
 */
export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

/**
 * Close modal
 * @param {string} modalId - Modal element ID
 */
export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

/**
 * Check if modal is open
 * @param {string} modalId - Modal element ID
 * @returns {boolean} True if modal is open
 */
export function isModalOpen(modalId) {
  const modal = document.getElementById(modalId);
  return modal ? modal.classList.contains("active") : false;
}
