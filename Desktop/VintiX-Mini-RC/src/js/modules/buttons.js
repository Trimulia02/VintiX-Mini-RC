/* ========================================
   MODULE: BUTTONS
   Handle button interactions
   ======================================== */

import { CONFIG } from "../config.js";
import { scrollToSection } from "./navigation.js";
import { changeModelSource } from "./modelViewer.js";

/**
 * Initialize button handlers
 */
export function initButtons() {
  handleExploreButton();
  handleProductButtons();
  handleNotifyButton();
}

/**
 * Handle Explore Now button
 */
function handleExploreButton() {
  const exploreBtns = document.querySelectorAll(".btn-primary");
  exploreBtns.forEach((btn) => {
    if (btn.textContent.trim() === "EXPLORE NOW") {
      btn.addEventListener("click", () => {
        scrollToSection("models");
      });
    }
  });
}

/**
 * Handle product view buttons
 */
function handleProductButtons() {
  const viewButtons = document.querySelectorAll(
    ".btn-secondary:not([data-modal])",
  );

  viewButtons.forEach((btn) => {
    if (!btn.textContent.includes("NOTIFY")) {
      btn.addEventListener("click", (e) => {
        const card = btn.closest(".product-card");
        const productName = card?.querySelector("h3")?.textContent;

        if (productName) {
          handleProductView(productName);
        }
      });
    }
  });
}

/**
 * Handle product view
 * @param {string} productName - Product name
 */
function handleProductView(productName) {
  const modelMap = {
    "RC HIGHWAYMAN": CONFIG.MODELS.RC_HIGHWAYMAN,
    "RC ANNIHILATOR": CONFIG.MODELS.RC_ANNIHILATOR,
    "RC SHVAN": CONFIG.MODELS.RC_SHVAN,
    "RC TIME MACHINE": CONFIG.MODELS.FORTNITE_BTTF,
  };

  const modelSrc = modelMap[productName];
  if (modelSrc) {
    changeModelSource(".hero-model model-viewer", modelSrc);
    scrollToSection("home");
  }
}

/**
 * Handle Notify Me button
 */
function handleNotifyButton() {
  const notifyBtns = document.querySelectorAll(".btn-secondary");
  const notifyBtn = Array.from(notifyBtns).find((btn) =>
    btn.textContent.includes("NOTIFY"),
  );

  if (notifyBtn) {
    notifyBtn.addEventListener("click", () => {
      alert("Thank you! We'll notify you when new models are available.");
    });
  }
}
