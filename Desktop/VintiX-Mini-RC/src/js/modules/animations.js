/* ========================================
   MODULE: ANIMATIONS
   Handle scroll animations and effects
   ======================================== */

import { CONFIG } from "../config.js";

/**
 * Initialize animations
 */
export function initAnimations() {
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
export function animateElement(element, delay = 0) {
  setTimeout(() => {
    element.classList.add("fade-in-up");
  }, delay);
}

/**
 * Remove animation class
 * @param {Element} element - DOM element
 */
export function removeAnimation(element) {
  element.classList.remove("fade-in-up");
}
