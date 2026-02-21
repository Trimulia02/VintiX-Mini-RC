/* ========================================
   MODULE: NAVIGATION
   Handle navigation and scroll behavior
   ======================================== */

/**
 * Initialize navigation
 */
export function initNavigation() {
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
export function scrollToSection(sectionId) {
  const section = document.querySelector(`#${sectionId}`);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Get current section
 * @returns {string} Current section ID
 */
export function getCurrentSection() {
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
