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
        item.model = getModelPathByProduct(item.name);
      }
      return item;
    });
  } catch (error) {
    console.error("Failed to load cart:", error);
    return [];
  }
}

/* ===== src/js/modules/modals.js ===== */

/* ========================================
   MODULE: MODAL MANAGEMENT
   Handle modal open/close operations
   ======================================== */

const FOCUSABLE_SELECTOR =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
let lastFocusedElement = null;

/**
 * Initialize modal event listeners
 */
function initModals() {
  setupModalAccessibility();
  setupCloseButtons();
  setupBackdropClose();
  setupCheckoutButton();
  setupEscapeClose();
}

/**
 * Initialize modal ARIA attributes and keyboard trapping
 */
function setupModalAccessibility() {
  document.querySelectorAll(".modal").forEach((modal) => {
    if (!modal.id) return;

    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("tabindex", "-1");

    const modalTitle = modal.querySelector(".modal-header h2, h2");
    if (modalTitle) {
      if (!modalTitle.id) {
        modalTitle.id = `${modal.id}Title`;
      }
      modal.setAttribute("aria-labelledby", modalTitle.id);
    }

    modal.querySelectorAll(".close-modal").forEach((closeBtn) => {
      if (!closeBtn.hasAttribute("aria-label")) {
        closeBtn.setAttribute("aria-label", "Close dialog");
      }
    });

    modal.addEventListener("keydown", trapModalFocus);
  });
}

/**
 * Trap keyboard tab focus inside active modal
 * @param {KeyboardEvent} event - Keydown event
 */
function trapModalFocus(event) {
  if (event.key !== "Tab") return;

  const modal = event.currentTarget;
  if (!modal.classList.contains("active")) return;

  const focusableElements = getFocusableElements(modal);
  if (focusableElements.length === 0) {
    event.preventDefault();
    modal.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

/**
 * Get visible focusable elements inside container
 * @param {Element} container - Parent container
 * @returns {HTMLElement[]} Focusable children
 */
function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      element instanceof HTMLElement &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.offsetParent !== null,
  );
}

/**
 * Focus first interactive element in modal
 * @param {Element} modal - Modal element
 */
function focusFirstModalElement(modal) {
  const focusableElements = getFocusableElements(modal);
  const firstFocusable = focusableElements[0];
  if (firstFocusable) {
    firstFocusable.focus();
  } else {
    modal.focus();
  }
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

  document.querySelectorAll(".btn-secondary[data-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.modal;
      closeModal(modalId);
    });
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
    checkoutBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Mencegah refresh

      // 1. Cek apakah keranjang kosong
      if (cart.length === 0) {
        showNotification("Your cart is empty!", '--primary-red');
        return;
      }

      // 2. Cek apakah user sudah login
      const currentUserStr = localStorage.getItem("vintixCurrentUser");
      if (!currentUserStr) {
        // Jika belum login, beri notifikasi dan pindahkan ke halaman login
        showNotification("Please login first to proceed to checkout!", '--primary-red');
        window.location.href = "login/login.html";
        return;
      }

      // 3. Jika sudah login dan keranjang terisi
      const user = JSON.parse(currentUserStr);

      // (Bonus) Isi otomatis Nama dan Email di form Checkout menggunakan data user
      const checkoutForm = document.getElementById("checkoutForm");
      if (checkoutForm) {
        const nameInput = checkoutForm.querySelector('input[name="fullName"]');
        const emailInput = checkoutForm.querySelector('input[name="email"]');
        
        // Gabungkan nama depan dan nama belakang
        if (nameInput) nameInput.value = `${user.firstName} ${user.lastName}`;
        if (emailInput) emailInput.value = user.email;
      }

      // Tutup keranjang dan buka modal Checkout
      closeModal("cartModal");
      openModal("checkoutModal");
    });
  }
}

/**
 * Setup Escape key handler for modals
 */
function setupEscapeClose() {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const activeModals = document.querySelectorAll(".modal.active");
    const lastActiveModal = activeModals[activeModals.length - 1];
    if (lastActiveModal) {
      closeModal(lastActiveModal.id);
    }
  });
}

/**
 * Open modal
 * @param {string} modalId - Modal element ID
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    if (!modal.classList.contains("active")) {
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        lastFocusedElement = activeElement;
      }
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      focusFirstModalElement(modal);
    });
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
    modal.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal.active")) {
      document.body.style.overflow = "auto";

      if (lastFocusedElement && document.contains(lastFocusedElement)) {
        lastFocusedElement.focus();
      }
      lastFocusedElement = null;
    }
  }
}

/* ===== src/js/modules/cart.js ===== */

/* ========================================
   MODULE: CART MANAGEMENT
   Handle shopping cart operations
   ======================================== */

let cart = [];
const PRODUCT_MODEL_MAP = {
  "RC HIGHWAYMAN": CONFIG.MODELS.RC_HIGHWAYMAN,
  "RC ANNIHILATOR": CONFIG.MODELS.RC_ANNIHILATOR,
  "RC SHVAN": CONFIG.MODELS.RC_SHVAN,
  "BTTF TIME MACHINE": CONFIG.MODELS.FORTNITE_BTTF,
  "RC TIME MACHINE": CONFIG.MODELS.FORTNITE_BTTF,
};

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

  const cartItemsContainer = document.getElementById("cartItems");
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", handleCartActionClick);
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
  showNotification(`✓ ${product} added to cart!`, '--tosca');
}

/**
 * Handle cart item actions using event delegation
 * @param {MouseEvent} event - Click event
 */
function handleCartActionClick(event) {
  const clickTarget = event.target instanceof Element ? event.target : null;
  if (!clickTarget) return;

  const actionButton = clickTarget.closest("[data-cart-action][data-item-id]");
  if (!actionButton) return;

  const itemId = Number.parseInt(actionButton.dataset.itemId, 10);
  if (!itemId) return;

  const action = actionButton.dataset.cartAction;
  const item = cart.find((entry) => entry.id === itemId);

  if (!item && action !== "remove") return;

  if (action === "increase") {
    updateQuantity(itemId, item.quantity + 1);
  } else if (action === "decrease") {
    updateQuantity(itemId, Math.max(1, item.quantity - 1));
  } else if (action === "remove") {
    removeFromCart(itemId);
  }
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
  return PRODUCT_MODEL_MAP[productName] || "";
}

/**
 * Calculate cart totals
 * @returns {{subtotal: number, tax: number, total: number}}
 */
function calculateCartTotals() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * CONFIG.TAX_RATE;
  return { subtotal, tax, total: subtotal + tax };
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
    const parsedQuantity = Number.parseInt(quantity, 10);
    const newQuantity = Number.isNaN(parsedQuantity)
      ? item.quantity
      : Math.max(1, parsedQuantity);

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
          <button
            class="qty-btn"
            type="button"
            data-cart-action="decrease"
            data-item-id="${item.id}"
            aria-label="Decrease quantity for ${item.name}"
          >−</button>
          <span class="cart-qty-value">${item.quantity}</span>
          <button
            class="qty-btn"
            type="button"
            data-cart-action="increase"
            data-item-id="${item.id}"
            aria-label="Increase quantity for ${item.name}"
          >+</button>
        </div>
        <button
          class="remove-btn"
          type="button"
          data-cart-action="remove"
          data-item-id="${item.id}"
          aria-label="Remove ${item.name} from cart"
        >Remove</button>
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
        <span>${item.name} x${item.quantity}</span>
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
function showNotification(text, color) {
  if (!text) return;

  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background-color: var(${color});
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    animation: slideInRight 0.3s ease;
    font-weight: bold;
  `;
  notification.textContent = text;
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
        showNotification("Please fill in all required fields", '--primary-red')
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
      location.reload();
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
    showNotification("Product is not available for purchase yet.", '--primary-red')
    return;
  }

  const price = parsePrice(priceText);

  if (price && !isNaN(price) && price > 0) {
    addToCart(productName, price);
    showNotification(`✓ ${productName} added to cart!`, '--tosca');
  } else {
    console.error("Invalid price:", priceText);
    showNotification("Could not parse product price.", '--primary-red');
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
  } catch {
    console.log("Could not parse specs");
  }

  // Update modal content
  if (previewTitle) previewTitle.textContent = productData.name;
  if (previewName) previewName.textContent = productData.name;
  if (previewDescription)
    previewDescription.textContent = productData.description;
  if (previewViewer) {
    setupLoadingIndicator(previewViewer);
    previewViewer.src = productData.model;
  }

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
  const lazyObserver = createLazyModelViewerObserver();

  modelViewers.forEach((viewer) => {
    setupModelViewerEvents(viewer);

    const hasImmediateSrc = Boolean(viewer.getAttribute("src"));
    const hasDeferredSrc = Boolean(viewer.dataset.modelSrc);

    if (hasDeferredSrc) {
      if (lazyObserver) {
        lazyObserver.observe(viewer);
      } else {
        loadDeferredModel(viewer);
      }
      return;
    }

    if (hasImmediateSrc) {
      setupLoadingIndicator(viewer);
    }
  });
}

/**
 * Create observer for lazy model source assignment
 * @returns {IntersectionObserver|null} Observer instance
 */
function createLazyModelViewerObserver() {
  if (!("IntersectionObserver" in window)) return null;

  return new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        loadDeferredModel(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "280px 0px",
      threshold: 0.01,
    },
  );
}

/**
 * Assign deferred src to model-viewer
 * @param {Element} viewer - model-viewer element
 */
function loadDeferredModel(viewer) {
  const deferredSrc = viewer.dataset.modelSrc;
  if (!deferredSrc || viewer.dataset.modelLoaded === "true") return;

  viewer.dataset.modelLoaded = "true";
  setupLoadingIndicator(viewer);
  viewer.setAttribute("src", deferredSrc);
}

/**
 * Setup loading indicator for model viewer
 * @param {Element} viewer - model-viewer element
 */
function setupLoadingIndicator(viewer) {
  if (viewer.loadingElement && viewer.loadingElement.parentNode) return;

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

  if (viewer.dataset.loadingListenerBound !== "true") {
    viewer.dataset.loadingListenerBound = "true";
    viewer.addEventListener("load", () => {
      removeLoadingIndicator(viewer);
    });
  }
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
    removeLoadingIndicator(viewer);
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
      viewer.loadingElement = null;
    }, 300);
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
 * Get sticky navbar offset to avoid clipped sections
 * @returns {number} Offset in pixels
 */
function getStickyNavOffset() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return 0;

  const navbarStyles = window.getComputedStyle(navbar);
  const navbarMarginBottom = parseFloat(navbarStyles.marginBottom) || 0;

  return Math.ceil(
    navbar.getBoundingClientRect().height + navbarMarginBottom + 8,
  );
}

/**
 * Smooth scroll to target with sticky navbar compensation
 * @param {Element} target - Target element
 */
function scrollWithStickyOffset(target) {
  const targetTop = window.scrollY + target.getBoundingClientRect().top;
  const scrollTarget = Math.max(0, targetTop - getStickyNavOffset());

  window.scrollTo({
    top: scrollTarget,
    behavior: "smooth",
  });
}

/**
 * Setup navigation link clicks
 */
function setupNavLinks() {
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      if (href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          scrollWithStickyOffset(target);
        }
      }
    });
  });
}

/**
 * Setup scroll listener for active nav update
 */
function setupScrollListener() {
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("resize", updateActiveNav);
}

/**
 * Update active navigation link on scroll
 */
function updateActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const scrollMarker = window.scrollY + getStickyNavOffset() + 24;

  let current = "";

  sections.forEach((section) => {
    if (scrollMarker >= section.offsetTop) {
      current = section.getAttribute("id") || "";
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "is-active",
      link.getAttribute("href") === `#${current}`,
    );
  });
}

/**
 * Scroll to section
 * @param {string} sectionId - Section ID
 */
function scrollToSection(sectionId) {
  const section = document.querySelector(`#${sectionId}`);
  if (section) {
    scrollWithStickyOffset(section);
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
  handleNotifyButton();
}

/**
 * Handle Explore Now button
 */
function handleExploreButton() {
  const exploreBtns = document.querySelectorAll("[data-scroll-target]");
  exploreBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.dataset.scrollTarget;
      if (targetId) {
        scrollToSection(targetId);
      }
    });
  });
}

function handleNotifyButton() {
  document.querySelectorAll(".btn-secondary").forEach((btn) => {
    if (btn.textContent.includes("NOTIFY")) {
      btn.addEventListener("click", () => {
        showNotification("Thank you! We'll notify you when new models are available.", '--tosca')
      });
    }
  });
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
  initAuth();
  // ensure nav reflects login state
  updateAuthNav();
  initReviews();

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

/* ===== src/js/modules/auth.js ===== */

/* ========================================
   MODULE: AUTHENTICATION
   Handle Login & Register tab switching
   ======================================== */

// ----------------------
// AUTHENTICATION HELPERS
// ----------------------

/**
 * Load registered users from localStorage
 * @returns {Array} Array of user objects {name,email,password}
 */
function loadUsers() {
  try {
    const data = localStorage.getItem("vintixUsers");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse users from storage", e);
    return [];
  }
}

/**
 * Save users array to localStorage
 * @param {Array} users
 */
function saveUsers(users) {
  try {
    localStorage.setItem("vintixUsers", JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save users", e);
  }
}

/**
 * Attempt to register a new user. Returns user object on success or null if email already exists.
 */
function registerUser(name, email, password) {
  const users = loadUsers();
  if (users.find((u) => u.email === email)) {
    return null; // already registered
  }
  const newUser = { name, email, password };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

/**
 * Try to login with credentials. Returns user object or null.
 */
function loginUser(email, password) {
  const users = loadUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  return user || null;
}

/**
 * Persist currently logged in user
 */
function setCurrentUser(user) {
  if (user) {
    localStorage.setItem("vintixCurrentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("vintixCurrentUser");
  }
}

/**
 * Retrieve currently logged in user or null
 */
function getCurrentUser() {
  try {
    const data = localStorage.getItem("vintixCurrentUser");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

// ----------------------
// AUTH MODAL CONTROLS
// ----------------------

function initAuth() {
  const authTabs = document.querySelectorAll(".auth-tab");
  const authForms = document.querySelectorAll(".auth-form");

  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Sembunyikan semua tab dan form
      authTabs.forEach((t) => t.classList.remove("active"));
      authForms.forEach((f) => {
        f.classList.remove("active");
        f.classList.add("hidden");
      });

      // Aktifkan tab dan form yang diklik
      tab.classList.add("active");
      const targetFormId = tab.getAttribute("data-target");
      const targetForm = document.getElementById(targetFormId);

      if (targetForm) {
        targetForm.classList.remove("hidden");
        targetForm.classList.add("active");
      }
    });
  });

  // form submissions
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.loginEmail.value.trim();
      const password = loginForm.loginPassword.value;
      const user = loginUser(email, password);
      if (user) {
        setCurrentUser(user);
        updateAuthNav();
        closeModal("authModal");
        showNotification("Logged in successfully!", '--tosca')
      } else {
        showNotification("Invalid credentials. Please try again or register.", '--primary-red');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = registerForm.registerFullName.value.trim();
      const email = registerForm.registerEmail.value.trim();
      const password = registerForm.registerPassword.value;
      const user = registerUser(name, email, password);
      if (user) {
        setCurrentUser(user);
        updateAuthNav();
        closeModal("authModal");
        showNotification("Registration successful and logged in!", '--tosca');
      } else {
        showNotification("Email already registered. Please login instead.", '--tosca');
      }
    });
  }
}

/**
 * Effectively switches the login link to profile or vice versa
 */
/**
 * Mengubah tombol navigasi login menjadi Profil jika user sudah login
 */
function updateAuthNav() {
  const navLink = document.getElementById("authNavLink");
  if (!navLink) return;

  try {
    const currentUserStr = localStorage.getItem("vintixCurrentUser");
    
    if (currentUserStr) {
      // JIKA SUDAH LOGIN: Ubah jadi Ikon Profil
      const user = JSON.parse(currentUserStr);
      const initial = user.firstName.charAt(0).toUpperCase();

      // Membuat elemen HTML untuk ikon bulat premium
      navLink.innerHTML = `
        <span style="display:flex; align-items:center; gap:8px;">
          <div style="width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #ff2d78, #00e5ff); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; box-shadow: 0 0 10px rgba(0, 229, 255, 0.4);">
            ${initial}
          </div>
          ${user.firstName}
        </span>
      `;
      navLink.href = "login/profile.html";

    } else {
      // JIKA BELUM LOGIN: Tampilkan tombol default
      navLink.textContent = "LOGIN";
      navLink.href = "login/login.html";
      navLink.onclick = null;
    }
  } catch (e) {
    console.error("Auth error:", e);
  }
}


/* ===== src/js/modules/reviews.js ===== */

function initReviews() {
  const track1 = document.getElementById("track1");
  const track2 = document.getElementById("track2");

  if (!track1 || !track2) return;

  // Daftar ulasan yang akan terus berputar
  const reviewsData = [
    {
      name: "Ralffli Galon",
      initials: "RG",
      stars: "★★★★★",
      date: "Oct 20, 2025",
      comment: "Keren banget buat dipajang di meja kerja! Mobilnya responsif.",
    },
    {
      name: "Bima Sayur",
      initials: "BS",
      stars: "★★★★☆",
      date: "Oct 18, 2025",
      comment: "Detailnya mantap, lumayan buat main di sela-sela coding.",
    },
    {
      name: "Bina Malay",
      initials: "BM",
      stars: "★★★★★",
      date: "Oct 15, 2025",
      comment:
        "Absolutely love the RC Highwayman! The low-poly design looks amazing on my desk.",
    },
    {
      name: "Tri Cupang",
      initials: "TC",
      stars: "★★★★☆",
      date: "Oct 12, 2025",
      comment:
        "Great quality and fast shipping. The RC Annihilator is incredibly fast.",
    },
    {
      name: "Hariz Vermak",
      initials: "HV",
      stars: "★★★★☆",
      date: "Oct 12, 2025",
      comment:
        "Great quality and fast shipping. The RC Annihilator is incredibly fast.",
    },
    {
      name: "Aaron Sembako",
      initials: "AS",
      stars: "★★★★☆",
      date: "Oct 12, 2025",
      comment:
        "Great quality and fast shipping. The RC Annihilator is incredibly fast.",
    },
  ];

  // Template HTML untuk merakit kotak ulasan
  function createReviewHTML(rev) {
    return `
      <div class="review-card">
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar" style="background: linear-gradient(135deg, #ff2f72 0%, #ff9a56 100%); display: flex; align-items: center; justify-content: center; width: 45px; height: 45px; border-radius: 50%; font-weight: bold; color: white;">${rev.initials}</div>
            <div class="reviewer-details">
              <h4 style="margin: 0; color: #f4f8ff;">${rev.name}</h4>
              <div class="review-stars" style="color: #63f3e5; font-size: 0.9rem; letter-spacing: 2px;">${rev.stars}</div>
            </div>
          </div>
          <span class="review-date" style="font-size: 0.8rem; color: rgba(217, 228, 247, 0.5);">${rev.date}</span>
        </div>
        <p class="review-text" style="color: rgba(218, 229, 247, 0.85); font-size: 0.95rem; line-height: 1.6; margin: 0;">${rev.comment}</p>
      </div>
    `;
  }

  // Bersihkan track dan isi dengan data ulasan di atas secara berurutan
  track1.innerHTML = "";
  track2.innerHTML = "";

  reviewsData.forEach((rev) => {
    const html = createReviewHTML(rev);
    track1.insertAdjacentHTML("beforeend", html);
    track2.insertAdjacentHTML("beforeend", html); // Track 2 dibuat kembar identik
  });
}
