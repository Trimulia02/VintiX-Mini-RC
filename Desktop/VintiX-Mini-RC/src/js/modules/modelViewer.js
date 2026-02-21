/* ========================================
   MODULE: 3D MODEL VIEWER
   Handle model-viewer web component
   ======================================== */

/**
 * Initialize model viewers
 */
export function initModelViewers() {
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
export function changeModelSource(selector, modelSrc) {
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
export function getModelSource(selector) {
  const viewer = document.querySelector(selector);
  return viewer ? viewer.src : "";
}
