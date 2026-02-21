/* ========================================
   CONFIG & CONSTANTS
   ======================================== */

export const CONFIG = {
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
export const Z_INDEX = {
  DROPDOWN: 100,
  MODAL: 1000,
  NOTIFICATION: 2000,
};

// Brand colors
export const COLORS = {
  PRIMARY_RED: "#c41e3a",
  TOSCA: "#4dbfb8",
  CREAM: "#fff8e7",
  WHITE: "#ffffff",
  DARK: "#333333",
  LIGHT_GRAY: "#f5f5f5",
};
