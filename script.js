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

  // Animation delay
  ANIMATION_DELAY: 0.3,

  // Default specs
  DEFAULT_SPECS: {
    battery: "2x AA",
    size: "16cm",
    speed: "20 km/h",
    feature: "Premium Grade",
  },
};

// Z-index management
const Z_INDEX = {
  DROPDOWN: 100,
  MODAL: 1000,
  NOTIFICATION: 2000,
};

// Brand colors
const COLORS = {
  PRIMARY_RED: "#c41e3a",
  TOSCA: "#4dbfb8",
  CREAM: "#fff8e7",
  WHITE: "#ffffff",
  DARK: "#333333",
  LIGHT_GRAY: "#f5f5f5",
};


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
 * Format date to readable string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  return new Intl.DateTimeFormat(CONFIG.LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Parse price from formatted string
 * @param {string} priceText - Price text with currency
 * @returns {number} Parsed numeric value
 */
function parsePrice(priceText) {
  return parseInt(priceText.replace(/[^\d]/g, "")) || 0;
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
    const cart = savedCart ? JSON.parse(savedCart) : [];

    // Migrate legacy cart items (add model paths if missing)
    return cart.map((item) => {
      if (!item.model) {
        item.model = getMigrationModelPath(item.name);
      }
      return item;
    });
  } catch (error) {
    console.error("Failed to load cart:", error);
    return [];
  }
}

/**
 * Get model path for legacy cart items migration
 * @param {string} productName - Product name
 * @returns {string} Model path
 */
function getMigrationModelPath(productName) {
  const modelMap = {
    "RC HIGHWAYMAN": CONFIG.MODELS.RC_HIGHWAYMAN,
    "RC ANNIHILATOR": CONFIG.MODELS.RC_ANNIHILATOR,
    "RC SHVAN": CONFIG.MODELS.RC_SHVAN,
    "FORTNITE TIME MACHINE": CONFIG.MODELS.FORTNITE_BTTF,
  };
  return modelMap[productName] || "";
}

/**
 * Clear cart from localStorage
 */
function clearCart() {
  try {
    localStorage.removeItem(CONFIG.CART_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear cart:", error);
  }
}

/**
 * Save any data to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
}

/**
 * Load any data from localStorage
 * @param {string} key - Storage key
 * @returns {*} Stored value or null
 */
function loadData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return null;
  }
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
function openModal(modalId) {
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
function closeModal(modalId) {
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
function isModalOpen(modalId) {
  const modal = document.getElementById(modalId);
  return modal ? modal.classList.contains("active") : false;
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
function updateCart() {
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
function showCartNotification(product) {
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
function validateCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  return form ? form.checkValidity() : false;
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

/**
 * Add fade-in animation to element
 * @param {Element} element - DOM element
 * @param {number} delay - Animation delay in ms
 */
function animateElement(element, delay = 0) {
  setTimeout(() => {
    element.classList.add("fade-in-up");
  }, delay);
}

/**
 * Remove animation class
 * @param {Element} element - DOM element
 */
function removeAnimation(element) {
  element.classList.remove("fade-in-up");
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

/**
 * Get current model source
 * @param {string} selector - CSS selector for viewer
 * @returns {string} Current model source
 */
function getModelSource(selector) {
  const viewer = document.querySelector(selector);
  return viewer ? viewer.src : "";
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
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
}

/**
 * Setup scroll listener for active nav update
 */
function setupScrollListener() {
  window.addEventListener("scroll", updateActiveNav);
}

/**
 * Update active navigation link on scroll
 */
function updateActiveNav() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-menu a");

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.style.borderBottom = "none";
    if (link.getAttribute("href") === `#${current}`) {
      link.style.borderBottom = "2px solid white";
    }
  });
}

/**
 * Scroll to section
 * @param {string} sectionId - Section ID
 */
function scrollToSection(sectionId) {
  const section = document.querySelector(`#${sectionId}`);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Get current section
 * @returns {string} Current section ID
 */
function getCurrentSection() {
  const sections = document.querySelectorAll("section");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  return current;
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


