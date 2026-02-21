/* ========================================
   MODULE: PRODUCT PREVIEW
   Handle 3D model preview modal
   ======================================== */

import { formatIDR, parsePrice } from "../utils/formatter.js";
import { CONFIG } from "../config.js";
import { openModal } from "./modals.js";
import { addToCart, showCartNotification } from "./cart.js";

/**
 * Initialize product preview
 */
export function initProductPreview() {
  const previewTriggers = document.querySelectorAll(".preview-trigger");

  previewTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const card = trigger.closest(".product-card");
      const productData = {
        model: card.dataset.model,
        name: card.dataset.product,
        price: card.dataset.price,
        description: card.dataset.description,
        specs: card.dataset.specs,
      };
      showModelPreview(productData);
    });
  });

  setupPreviewAddToCart();
}

/**
 * Setup Add to Cart button in preview modal
 */
function setupPreviewAddToCart() {
  const previewAddBtn = document.getElementById("previewAddToCart");
  if (previewAddBtn) {
    previewAddBtn.addEventListener("click", () => {
      handlePreviewAddToCart();
    });
  }
}

/**
 * Handle adding to cart from preview
 */
function handlePreviewAddToCart() {
  const productName = document
    .getElementById("previewProductName")
    ?.textContent?.trim();
  const priceText = document
    .getElementById("previewProductPrice")
    ?.textContent?.trim();

  if (!productName || !priceText) {
    console.error("Product name or price not found");
    return;
  }

  if (priceText === "COMING SOON") {
    alert("Product is not available for purchase yet.");
    return;
  }

  const price = parsePrice(priceText);

  if (price && !isNaN(price) && price > 0) {
    addToCart(productName, price);
    showCartNotification(productName);
  } else {
    console.error("Invalid price:", priceText);
    alert("Could not parse product price.");
  }
}

/**
 * Show model preview modal
 * @param {Object} productData - Product data
 */
export function showModelPreview(productData) {
  const previewTitle = document.getElementById("previewModelTitle");
  const previewViewer = document.getElementById("previewModelViewer");
  const previewName = document.getElementById("previewProductName");
  const previewDescription = document.getElementById(
    "previewProductDescription",
  );
  const previewPrice = document.getElementById("previewProductPrice");
  const previewAddBtn = document.getElementById("previewAddToCart");

  // Parse specs
  let specs = CONFIG.DEFAULT_SPECS;
  try {
    if (productData.specs) {
      specs = JSON.parse(productData.specs);
    }
  } catch (e) {
    console.log("Could not parse specs");
  }

  // Update modal content
  if (previewTitle) previewTitle.textContent = productData.name;
  if (previewName) previewName.textContent = productData.name;
  if (previewDescription)
    previewDescription.textContent = productData.description;
  if (previewViewer) previewViewer.src = productData.model;

  // Update specs
  updatePreviewSpecs(specs);

  // Update Add to Cart button state
  if (productData.price === "Coming Soon") {
    if (previewAddBtn) {
      previewAddBtn.disabled = true;
      previewAddBtn.textContent = "COMING SOON";
      previewAddBtn.style.opacity = "0.6";
    }
    if (previewPrice) previewPrice.textContent = "COMING SOON";
  } else {
    if (previewAddBtn) {
      previewAddBtn.disabled = false;
      previewAddBtn.textContent = "ADD TO CART";
      previewAddBtn.style.opacity = "1";
    }
    const price = parseInt(productData.price);
    if (previewPrice) previewPrice.textContent = formatIDR(price);
  }

  openModal("modelPreviewModal");
}

/**
 * Update preview specs display
 * @param {Object} specs - Specs object
 */
function updatePreviewSpecs(specs) {
  const specElements = {
    battery: "specBattery",
    size: "specSize",
    speed: "specSpeed",
    feature: "specFeature",
  };

  Object.entries(specElements).forEach(([specKey, elementId]) => {
    const element = document.getElementById(elementId);
    if (element && specs[specKey]) {
      element.textContent = specs[specKey];
    }
  });
}
