/* ========================================
   UTILITY: FORMATTER
   Format numbers, currency, dates
   ======================================== */

import { CONFIG } from "../config.js";

/**
 * Format number to Indonesian Rupiah currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatIDR(amount) {
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
export function formatDate(date) {
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
export function parsePrice(priceText) {
  return parseInt(priceText.replace(/[^\d]/g, "")) || 0;
}
