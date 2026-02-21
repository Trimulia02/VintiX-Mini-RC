/* ========================================
   UTILITY: STORAGE
   Handle localStorage operations
   ======================================== */

import { CONFIG } from "../config.js";

/**
 * Save cart to localStorage
 * @param {Array} cart - Cart items array
 */
export function saveCart(cart) {
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
export function loadCart() {
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
export function clearCart() {
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
export function saveData(key, value) {
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
export function loadData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return null;
  }
}
