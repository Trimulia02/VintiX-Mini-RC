/* Bundled into a single script file */

/* ===== src/js/config.js ===== */

/* ========================================
   CONFIG & CONSTANTS
   ======================================== */

const CONFIG = {
  // Currency settings
  CURRENCY: "IDR",
  LOCALE: "id-ID",

  // Storage keys
  CART_STORAGE_KEY: "vintixCart",

  // URL/Path settings
  MODELS: {
    RC_HIGHWAYMAN:
      "/assets/car-model/rc_highwayman_-_low_poly_model/scene.gltf",
    RC_ANNIHILATOR:
      "/assets/car-model/rc_annihilator_-_low_poly_model/scene.gltf",
    RC_SHVAN: "/assets/car-model/rc_shvan_-_low_poly_model/scene.gltf",
    FORTNITE_BTTF:
      "/assets/car-model/fortnite_back_to_the_future_time_machine/scene.gltf",
  },

  // Tax rate
  TAX_RATE: 0.1,

  // Payment processing timeout
  PAYMENT_TIMEOUT: 2000,

  // Default specs
  DEFAULT_SPECS: {
    battery: "2x AA",
    size: "16cm",
    speed: "20 km/h",
    feature: "Premium Grade",
  },
};

const PRODUCT_MODEL_PATHS = {
  "RC HIGHWAYMAN": CONFIG.MODELS.RC_HIGHWAYMAN,
  "RC ANNIHILATOR": CONFIG.MODELS.RC_ANNIHILATOR,
  "RC SHVAN": CONFIG.MODELS.RC_SHVAN,
  "FORTNITE TIME MACHINE": CONFIG.MODELS.FORTNITE_BTTF,
  "RC TIME MACHINE": CONFIG.MODELS.FORTNITE_BTTF,
};

function normalizeProductName(name) {
  return typeof name === "string" ? name.trim().toUpperCase() : "";
}


/* ===== src/js/utils/formatter.js ===== */

/* ========================================
   UTILITY: FORMATTER
   Format numbers, currency, dates
   ======================================== */


/**
 * Format number to Indonesian Rupiah currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatIDR(amount) {
  return new Intl.NumberFormat(CONFIG.LOCALE, {
    style: "currency",
    currency: CONFIG.CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Parse price from formatted string
 * @param {string} priceText - Price text with currency
 * @returns {number} Parsed numeric value
 */
function parsePrice(priceText) {
  return parseInt(priceText.replace(/[^\d]/g, "")) || 0;
}

/**
 * Escape unsafe HTML characters to prevent injection
 * @param {string} value - Raw string
 * @returns {string} Escaped string
 */
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char] || char;
  });
}

/**
 * Show in-app toast notification
 * @param {string} message - Notification message
 * @param {("info"|"success"|"warning"|"error")} variant - Notification variant
 * @param {number} duration - Auto hide duration in ms
 */
function showAppNotification(message, variant = "info", duration = 2800) {
  if (!message || !document.body) return;

  let stack = document.querySelector(".app-toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "app-toast-stack";
    stack.setAttribute("aria-live", "polite");
    stack.setAttribute("aria-atomic", "true");
    document.body.appendChild(stack);
  }

  const toast = document.createElement("div");
  toast.className = `app-toast app-toast--${variant}`;
  toast.setAttribute("role", "status");
  toast.textContent = message;
  stack.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("is-hiding");
    window.setTimeout(() => {
      toast.remove();
      if (stack && stack.childElementCount === 0) {
        stack.remove();
      }
    }, 260);
  }, duration);
}


/* ===== src/js/utils/storage.js ===== */

/* ========================================
   UTILITY: STORAGE
   Handle localStorage operations
   ======================================== */


/**
 * Save cart to localStorage
 * @param {Array} cart - Cart items array
 */
function saveCart(cart) {
  try {
    localStorage.setItem(CONFIG.CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart:", error);
  }
}

/**
 * Load cart from localStorage
 * @returns {Array} Cart items array or empty array
 */
function loadCart() {
  try {
    const savedCart = localStorage.getItem(CONFIG.CART_STORAGE_KEY);
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    const cart = Array.isArray(parsedCart) ? parsedCart : [];

    return cart.map((item, index) => sanitizeCartItem(item, index));
  } catch (error) {
    console.error("Failed to load cart:", error);
    return [];
  }
}

/**
 * Validate and normalize cart item from storage
 * @param {Object} rawItem - Raw cart item
 * @param {number} index - Item index
 * @returns {Object} Sanitized cart item
 */
function sanitizeCartItem(rawItem, index) {
  const item = rawItem && typeof rawItem === "object" ? rawItem : {};

  const parsedId = Number.parseInt(item.id, 10);
  const safeId =
    Number.isFinite(parsedId) && parsedId > 0 ? parsedId : Date.now() + index;

  const safeName =
    typeof item.name === "string" && item.name.trim()
      ? item.name.trim().slice(0, 80)
      : "RC ITEM";

  const parsedPrice = Number(item.price);
  const safePrice =
    Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0;

  const parsedQty = Number.parseInt(item.quantity, 10);
  const safeQuantity =
    Number.isFinite(parsedQty) && parsedQty > 0 ? Math.min(parsedQty, 99) : 1;

  let safeModel = "";
  if (typeof item.model === "string") {
    const model = item.model.trim();
    if (/^\/?assets\/[a-zA-Z0-9_./-]+$/.test(model)) {
      safeModel = model;
    }
  }

  if (!safeModel) {
    safeModel = getMigrationModelPath(safeName);
  }

  return {
    id: safeId,
    name: safeName,
    price: safePrice,
    quantity: safeQuantity,
    model: safeModel || "",
  };
}

/**
 * Get model path for legacy cart items migration
 * @param {string} productName - Product name
 * @returns {string} Model path
 */
function getMigrationModelPath(productName) {
  const normalizedName = normalizeProductName(productName);
  return PRODUCT_MODEL_PATHS[normalizedName] || "";
}


/* ===== src/js/modules/modals.js ===== */

/* ========================================
   MODULE: MODAL MANAGEMENT
   Handle modal open/close operations
   ======================================== */

/**
 * Initialize modal event listeners
 */
function initModals() {
  setupCloseButtons();
  setupBackdropClose();
  setupEscapeClose();
  setupCheckoutButton();
}

/**
 * Setup close button listeners
 */
function setupCloseButtons() {
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
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
 * Setup escape key close for active modal
 */
function setupEscapeClose() {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const activeModals = Array.from(document.querySelectorAll(".modal.active"));
    const topMostModal = activeModals[activeModals.length - 1];
    if (topMostModal) {
      closeModal(topMostModal.id);
    }
  });
}

/**
 * Setup checkout button
 */
function setupCheckoutButton() {
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (typeof getCart === "function" && getCart().length === 0) {
        showAppNotification(
          "Keranjang masih kosong. Tambahkan produk terlebih dulu.",
          "warning",
        );
        return;
      }

      closeModal("cartModal");
      openModal("checkoutModal");
    });
  }
}

/**
 * Sync body scroll lock based on modal state
 */
function syncBodyScrollLock() {
  const hasActiveModal = Boolean(document.querySelector(".modal.active"));
  document.body.style.overflow = hasActiveModal ? "hidden" : "";
}

/**
 * Open modal
 * @param {string} modalId - Modal element ID
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    syncBodyScrollLock();
  }
}

/**
 * Close modal
 * @param {string} modalId - Modal element ID
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    syncBodyScrollLock();
  }
}

/* ===== src/js/modules/cart.js ===== */

/* ========================================
   MODULE: CART MANAGEMENT
   Handle shopping cart operations
   ======================================== */


let cart = [];

/**
 * Initialize cart from localStorage
 */
function initCart() {
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
function addToCart(product, price) {
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
  const normalizedName = normalizeProductName(productName);
  return PRODUCT_MODEL_PATHS[normalizedName] || "";
}

/**
 * Remove item from cart
 * @param {number} itemId - Item ID
 */
function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  updateCart();
  saveCart(cart);
}

/**
 * Update item quantity
 * @param {number} itemId - Item ID
 * @param {number} quantity - New quantity
 */
function updateQuantity(itemId, quantity) {
  const item = cart.find((item) => item.id === itemId);
  if (item) {
    const parsedQuantity = parseInt(quantity, 10);
    if (!Number.isFinite(parsedQuantity)) {
      return;
    }

    if (parsedQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    item.quantity = Math.min(parsedQuantity, 99);
    updateCart();
    saveCart(cart);
  }
}

/**
 * Update cart display
 */
function updateCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  if (!cartItemsContainer) return;

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
        const safeId = Number.parseInt(item.id, 10);
        if (!Number.isFinite(safeId)) {
          return "";
        }

        const safeName = escapeHTML(item.name);
        const safeQuantity = Math.max(1, Number.parseInt(item.quantity, 10) || 1);
        const modelHTML = item.model
          ? `<model-viewer src="${item.model}" alt="${safeName}" auto-rotate shadow-intensity="1" style="width: 100%; height: 100%; display: block;"></model-viewer>`
          : `<div style="background: #f5f5f5; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 10px; text-align: center; color: #999; padding: 5px; box-sizing: border-box;">No 3D<br>Model</div>`;

        return `
      <div class="cart-item">
        <div class="cart-item-viewer">
          ${modelHTML}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${safeName}</div>
          <div class="cart-item-price">${formatIDR(item.price)}</div>
        </div>
        <div class="cart-item-quantity">
          <button class="qty-btn" type="button" aria-label="Kurangi jumlah ${safeName}" onclick="updateQuantity(${safeId}, ${safeQuantity - 1})">−</button>
          <span class="cart-qty-value">${safeQuantity}</span>
          <button class="qty-btn" type="button" aria-label="Tambah jumlah ${safeName}" onclick="updateQuantity(${safeId}, ${safeQuantity + 1})">+</button>
        </div>
        <button class="remove-btn" type="button" onclick="removeFromCart(${safeId})">Remove</button>
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

function calculateCartTotals() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * CONFIG.TAX_RATE;
  return {
    subtotal,
    tax,
    total: subtotal + tax,
  };
}

/**
 * Update cart summary
 */
function updateSummary() {
  const { subtotal, tax, total } = calculateCartTotals();

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
  if (!checkoutItemsContainer) return;

  if (cart.length === 0) {
    checkoutItemsContainer.innerHTML =
      '<p class="empty-cart">Your cart is empty.</p>';
  } else {
    checkoutItemsContainer.innerHTML = cart
      .map(
        (item) => `
      <div class="summary-row">
        <span>${escapeHTML(item.name)} x${item.quantity}</span>
        <span>${formatIDR(item.price * item.quantity)}</span>
      </div>
    `,
      )
      .join("");
  }

  const { total } = calculateCartTotals();

  const totalEl = document.getElementById("checkoutTotal");
  if (totalEl) totalEl.textContent = formatIDR(total);
}

/**
 * Show cart notification
 * @param {string} product - Product name
 */
function showCartNotification(product) {
  if (!product) return;
  showAppNotification(`✓ ${product} added to cart`, "success");
}

/**
 * Get current cart
 * @returns {Array} Cart items
 */
function getCart() {
  return cart;
}

/**
 * Clear cart
 */
function clearCartItems() {
  cart = [];
  updateCart();
  saveCart(cart);
}


/* ===== src/js/modules/checkout.js ===== */

/* ========================================
   MODULE: CHECKOUT & PAYMENT
   Handle payment and checkout flow
   ======================================== */


/**
 * Initialize checkout functionality
 */
function initCheckout() {
  const checkoutForm = document.getElementById("checkoutForm");
  const payBtn = document.getElementById("payBtn");

  if (payBtn) {
    payBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (!checkoutForm || !checkoutForm.checkValidity()) {
        showAppNotification("Please fill in all required fields.", "warning");
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
  if (!payBtn) return;

  const originalText = payBtn.textContent;

  payBtn.disabled = true;
  payBtn.textContent = "PROCESSING...";

  setTimeout(() => {
    const { total } = calculateCartTotals();

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
      showAppNotification("Pembayaran berhasil. Selamat berbelanja lagi!", "success");
      scrollToSection("models");
    };
  }
}

/* ===== src/js/modules/productPreview.js ===== */

/* ========================================
   MODULE: PRODUCT PREVIEW
   Handle 3D model preview modal
   ======================================== */


/**
 * Initialize product preview
 */
function initProductPreview() {
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
    showAppNotification("Product is not available for purchase yet.", "info");
    return;
  }

  const price = parsePrice(priceText);

  if (price && !isNaN(price) && price > 0) {
    addToCart(productName, price);
    showCartNotification(productName);
  } else {
    console.error("Invalid price:", priceText);
    showAppNotification(
      "Could not read product price. Please try again.",
      "error",
    );
  }
}

/**
 * Show model preview modal
 * @param {Object} productData - Product data
 */
function showModelPreview(productData) {
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
    console.warn("Could not parse specs");
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


/* ===== src/js/modules/animations.js ===== */

/* ========================================
   MODULE: ANIMATIONS
   Handle scroll animations and effects
   ======================================== */


/**
 * Initialize animations
 */
function initAnimations() {
  setupIntersectionObserver();
  setupElementAnimations();
}

/**
 * Setup intersection observer for scroll animations
 */
function setupIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  const elements = document.querySelectorAll(
    "section, .feature-box, .product-card",
  );
  elements.forEach((element) => {
    observer.observe(element);
  });
}

/**
 * Setup element animations on load
 */
function setupElementAnimations() {
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    heroContent.classList.add("fade-in-up");
  }
}

/* ===== src/js/modules/modelViewer.js ===== */

/* ========================================
   MODULE: 3D MODEL VIEWER
   Handle model-viewer web component
   ======================================== */

/**
 * Initialize model viewers
 */
function initModelViewers() {
  const modelViewers = document.querySelectorAll("model-viewer");

  modelViewers.forEach((viewer) => {
    setupLoadingIndicator(viewer);
    setupModelViewerEvents(viewer);
  });
}

/**
 * Setup loading indicator for model viewer
 * @param {Element} viewer - model-viewer element
 */
function setupLoadingIndicator(viewer) {
  const loadingWrapper = document.createElement("div");
  loadingWrapper.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    z-index: 10;
    border-radius: 12px;
  `;

  const spinner = document.createElement("div");
  spinner.style.cssText = `
    width: 40px;
    height: 40px;
    border: 4px solid #C41E3A;
    border-top-color: #4DBFB8;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  `;

  loadingWrapper.appendChild(spinner);

  if (viewer.parentNode) {
    viewer.parentNode.style.position = "relative";
    viewer.parentNode.appendChild(loadingWrapper);
  }

  viewer.loadingElement = loadingWrapper;

  // Add animation if not exists
  if (!document.querySelector("style[data-spin]")) {
    const style = document.createElement("style");
    style.setAttribute("data-spin", "true");
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // Remove loading when model loads
  viewer.addEventListener("load", () => {
    removeLoadingIndicator(viewer);
  });
}

/**
 * Setup model viewer events
 * @param {Element} viewer - model-viewer element
 */
function setupModelViewerEvents(viewer) {
  viewer.addEventListener("mouseenter", () => {
    viewer.style.transform = "scale(1.02)";
    viewer.style.transition = "transform 0.3s ease";
  });

  viewer.addEventListener("mouseleave", () => {
    viewer.style.transform = "scale(1)";
  });

  // Handle model load errors
  viewer.addEventListener("error", () => {
    console.error("Failed to load model:", viewer.src);
  });
}

/**
 * Remove loading indicator
 * @param {Element} viewer - model-viewer element
 */
function removeLoadingIndicator(viewer) {
  if (viewer.loadingElement) {
    viewer.loadingElement.style.transition = "opacity 0.3s ease";
    viewer.loadingElement.style.opacity = "0";
    setTimeout(() => {
      if (viewer.loadingElement && viewer.loadingElement.parentNode) {
        viewer.loadingElement.remove();
      }
    }, 300);
  }
}

/**
 * Change model viewer source
 * @param {string} selector - CSS selector for viewer
 * @param {string} modelSrc - Model source URL
 */
function changeModelSource(selector, modelSrc) {
  const viewer = document.querySelector(selector);
  if (viewer) {
    viewer.src = modelSrc;
  }
}

/* ===== src/js/modules/navigation.js ===== */

/* ========================================
   MODULE: NAVIGATION
   Handle navigation and scroll behavior
   ======================================== */

/**
 * Initialize navigation
 */
function initNavigation() {
  setupNavLinks();
  setupScrollListener();
  updateActiveNav();
}

/**
 * Get sticky navigation offset for anchor scrolling
 * @returns {number}
 */
function getNavigationOffset() {
  const navbar = document.querySelector(".navbar");
  const border = document.querySelector(".checkered-top-border");
  const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
  const borderHeight = border ? border.getBoundingClientRect().height : 0;

  return Math.round(navbarHeight + borderHeight + 12);
}

/**
 * Smooth scroll helper that respects sticky nav height
 * @param {Element} targetElement
 */
function smoothScrollToElement(targetElement) {
  if (!targetElement) return;

  const offset = getNavigationOffset();
  const top = targetElement.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });
}

/**
 * Setup navigation link clicks
 */
function setupNavLinks() {
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          smoothScrollToElement(target);
        }
      }
    });
  });
}

/**
 * Setup scroll listener for active nav update
 */
function setupScrollListener() {
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateActiveNav();
        ticking = false;
      });
    },
    { passive: true },
  );
}

/**
 * Update active navigation link on scroll
 */
function updateActiveNav() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const activationOffset = Math.max(72, getNavigationOffset() - 20);

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - activationOffset;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  if (!current && sections.length) {
    current = sections[0].getAttribute("id");
  }

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${current}`;
    link.classList.toggle("is-active", isActive);
  });
}

/**
 * Scroll to section
 * @param {string} sectionId - Section ID
 */
function scrollToSection(sectionId) {
  const section = document.querySelector(`#${sectionId}`);
  if (section) {
    smoothScrollToElement(section);
  }
}

/* ===== src/js/modules/buttons.js ===== */

/* ========================================
   MODULE: BUTTONS
   Handle button interactions
   ======================================== */


/**
 * Initialize button handlers
 */
function initButtons() {
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
      btn.addEventListener("click", () => {
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
  const modelSrc = getModelPathByProduct(productName);
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
      showAppNotification(
        "Thanks. We'll notify you when new models are available.",
        "info",
      );
    });
  }
}


/* ===== src/js/main.js ===== */

/* ========================================
   MAIN ENTRY POINT
   Initialize app and load all modules
   ======================================== */

// Core modules

// Utils

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

  // Setup error handling
  setupErrorHandlers();

  console.log("✅ App initialized successfully");
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

/* ===== Intro Sequence (Scroll Controlled) ===== */
(function initIntroSequence() {
  const TOTAL_FRAMES = 240;
  const MAX_PRELOAD_CONCURRENCY = 12;
  const FIRST_FRAME = 1;
  const FRAME_PREFIX = "assets/sequens/ezgif-frame-";
  const FRAME_EXT = ".jpg";

  const sequenceOverlay = document.getElementById("sequenceOverlay");
  const sequenceTrack = document.getElementById("sequenceTrack");
  const canvas = document.getElementById("sequenceCanvas");
  const loadingOverlay = document.getElementById("sequenceLoadingOverlay");
  const loadingBarFill = document.getElementById("sequenceLoadingBarFill");
  const loadedFramesText = document.getElementById("sequenceLoadedFrames");
  const scrollHint = document.getElementById("sequenceScrollHint");

  if (
    !sequenceOverlay ||
    !sequenceTrack ||
    !canvas ||
    !loadingOverlay ||
    !loadingBarFill ||
    !loadedFramesText ||
    !scrollHint
  ) {
    return;
  }

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!ctx) {
    document.body.classList.remove("intro-loading");
    return;
  }

  const frames = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let currentFrame = 0;
  let rafPending = false;
  let isSequenceReady = false;
  let isSequenceFinished = false;
  let failedCount = 0;

  function getFramePath(frameNumber) {
    return `${FRAME_PREFIX}${String(frameNumber).padStart(3, "0")}${FRAME_EXT}`;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function updateLoaderUI() {
    const progress = loadedCount / TOTAL_FRAMES;
    loadingBarFill.style.width = `${Math.round(progress * 100)}%`;
    loadedFramesText.textContent = String(loadedCount);
  }

  function resolveRenderableFrame(targetIndex) {
    if (frames[targetIndex]) {
      return frames[targetIndex];
    }

    for (let offset = 1; offset < TOTAL_FRAMES; offset += 1) {
      const prevIndex = targetIndex - offset;
      if (prevIndex >= 0 && frames[prevIndex]) {
        return frames[prevIndex];
      }

      const nextIndex = targetIndex + offset;
      if (nextIndex < TOTAL_FRAMES && frames[nextIndex]) {
        return frames[nextIndex];
      }
    }

    return null;
  }

  function drawFrame(index) {
    const image = resolveRenderableFrame(index);
    if (!image) {
      return;
    }

    const viewWidth = canvas.clientWidth;
    const viewHeight = canvas.clientHeight;
    if (!viewWidth || !viewHeight) {
      return;
    }

    const imageRatio = image.naturalWidth / image.naturalHeight;
    const viewportRatio = viewWidth / viewHeight;

    let drawWidth;
    let drawHeight;
    let offsetX;
    let offsetY;

    if (imageRatio > viewportRatio) {
      drawHeight = viewHeight;
      drawWidth = drawHeight * imageRatio;
      offsetX = (viewWidth - drawWidth) * 0.5;
      offsetY = 0;
    } else {
      drawWidth = viewWidth;
      drawHeight = drawWidth / imageRatio;
      offsetX = 0;
      offsetY = (viewHeight - drawHeight) * 0.5;
    }

    ctx.clearRect(0, 0, viewWidth, viewHeight);
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(window.innerWidth * dpr);
    const height = Math.round(window.innerHeight * dpr);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawFrame(currentFrame);
  }

  function updateTrackHeight() {
    const viewportHeight = window.innerHeight || 1;
    const pixelsPerFrame =
      window.innerWidth >= 1280 ? 9 : window.innerWidth >= 768 ? 7 : 5.5;
    const sequenceSpan = Math.max(
      (TOTAL_FRAMES - 1) * pixelsPerFrame,
      viewportHeight * 2.4,
    );
    sequenceTrack.style.height = `${Math.round(viewportHeight + sequenceSpan)}px`;
  }

  function getScrollProgress() {
    const startY = sequenceTrack.offsetTop;
    const endY = startY + sequenceTrack.offsetHeight - window.innerHeight;

    if (endY <= startY) {
      return 1;
    }

    return clamp((window.scrollY - startY) / (endY - startY), 0, 1);
  }

  function finishSequence() {
    if (isSequenceFinished) {
      return;
    }

    isSequenceFinished = true;
    sequenceTrack.classList.add("is-complete");
    scrollHint.classList.remove("is-visible");
    sequenceOverlay.classList.add("is-fading");
    window.removeEventListener("scroll", requestRender);
  }

  function renderFromScroll() {
    rafPending = false;

    if (!isSequenceReady || isSequenceFinished) {
      return;
    }

    const progress = getScrollProgress();
    const targetFrame = Math.round(progress * (TOTAL_FRAMES - 1));

    if (targetFrame !== currentFrame) {
      currentFrame = targetFrame;
      drawFrame(currentFrame);
    }

    if (progress >= 1) {
      finishSequence();
      return;
    }

    if (progress > 0.015) {
      scrollHint.classList.remove("is-visible");
    } else {
      scrollHint.classList.add("is-visible");
    }
  }

  function requestRender() {
    if (rafPending) {
      return;
    }

    rafPending = true;
    window.requestAnimationFrame(renderFromScroll);
  }

  function preloadFrame(frameNumber) {
    return new Promise((resolve) => {
      const frameIndex = frameNumber - FIRST_FRAME;
      const image = new Image();
      image.decoding = "async";

      let finalized = false;
      const finalize = () => {
        if (finalized) {
          return;
        }
        finalized = true;

        frames[frameIndex] = image;
        loadedCount += 1;
        updateLoaderUI();

        if (frameIndex === 0) {
          currentFrame = 0;
          drawFrame(0);
        }

        resolve();
      };

      image.onload = () => {
        if (typeof image.decode === "function") {
          image.decode().catch(() => {}).finally(finalize);
          return;
        }

        finalize();
      };

      image.onerror = () => {
        frames[frameIndex] = null;
        failedCount += 1;
        loadedCount += 1;
        updateLoaderUI();
        resolve();
      };

      image.src = getFramePath(frameNumber);
    });
  }

  async function preloadAllFrames() {
    await preloadFrame(FIRST_FRAME);

    const frameNumbers = [];
    for (let frame = FIRST_FRAME + 1; frame <= TOTAL_FRAMES; frame += 1) {
      frameNumbers.push(frame);
    }

    const concurrency = Math.min(
      MAX_PRELOAD_CONCURRENCY,
      frameNumbers.length || 1,
    );
    const workers = Array.from({ length: concurrency }, async (_, workerIdx) => {
      for (let i = workerIdx; i < frameNumbers.length; i += concurrency) {
        await preloadFrame(frameNumbers[i]);
      }
    });

    await Promise.all(workers);
  }

  function onSequenceReady() {
    if (isSequenceReady) return;

    isSequenceReady = true;
    document.body.classList.remove("intro-loading");
    loadingOverlay.classList.add("is-hidden");

    scrollHint.hidden = false;
    window.requestAnimationFrame(() => {
      scrollHint.classList.add("is-visible");
    });

    if (failedCount > 0) {
      showAppNotification(
        `${failedCount} frame gagal dimuat. Sequence tetap berjalan.`,
        "warning",
        3800,
      );
    }

    requestRender();
  }

  async function bootSequence() {
    updateTrackHeight();
    resizeCanvas();
    updateLoaderUI();

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener(
      "resize",
      () => {
        updateTrackHeight();
        resizeCanvas();
        if (!isSequenceFinished) {
          requestRender();
        }
      },
      { passive: true },
    );

    try {
      await preloadAllFrames();
    } catch (error) {
      console.error("Sequence preload failed:", error);
      showAppNotification(
        "Gagal preload sequence sepenuhnya. Menjalankan mode fallback.",
        "warning",
        4000,
      );
    } finally {
      onSequenceReady();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootSequence, { once: true });
  } else {
    bootSequence();
  }
})();
