# 🎯 Quick Reference - Struktur Baru

## File Paths

```
Component Styling      → src/css/components/[name].css
Global Variables      → src/css/_variables.css
Feature Module        → src/js/modules/[feature].js
Utility Functions     → src/js/utils/[utility].js
Main App Entry        → src/js/main.js
HTML Entry            → src/index.html
```

---

## CSS Variables (Gunakan di mana saja)

```css
/* Colors */
var(--primary-red)
var(--tosca)
var(--cream)
var(--dark)
var(--text-gray)

/* Spacing */
var(--spacing-xs)    /* 0.25rem */
var(--spacing-sm)    /* 0.5rem */
var(--spacing-md)    /* 1rem */
var(--spacing-lg)    /* 1.5rem */
var(--spacing-xl)    /* 2rem */
var(--spacing-2xl)   /* 3rem */
var(--spacing-3xl)   /* 4rem */

/* Typography */
var(--font-size-base)
var(--font-size-lg)
var(--font-size-xl)
var(--font-size-2xl)

/* Other */
var(--radius-md)
var(--transition-fast)
var(--shadow-lg)
```

---

## JS Modules Import

```javascript
// Cart
import { addToCart, removeFromCart } from "./modules/cart.js";

// Modals
import { openModal, closeModal } from "./modules/modals.js";

// Navigation
import { scrollToSection } from "./modules/navigation.js";

// Formatter
import { formatIDR, parsePrice } from "./utils/formatter.js";

// Storage
import { saveCart, loadCart } from "./utils/storage.js";

// Config
import { CONFIG, COLORS } from "./config.js";
```

---

## Module Functions

### Cart Module

```javascript
initCart();
addToCart(product, price);
removeFromCart(itemId);
updateQuantity(itemId, quantity);
updateCart();
getCart();
clearCartItems();
showCartNotification(product);
```

### Modal Module

```javascript
initModals();
openModal(modalId);
closeModal(modalId);
isModalOpen(modalId);
```

### Navigation Module

```javascript
initNavigation();
scrollToSection(sectionId);
getCurrentSection();
updateActiveNav();
```

### Animation Module

```javascript
initAnimations();
animateElement(element, delay);
removeAnimation(element);
```

### Model Viewer Module

```javascript
initModelViewers();
changeModelSource(selector, modelSrc);
getModelSource(selector);
```

---

## Workflow: Menambah Fitur Baru

### 1. Create Module

```javascript
// src/js/modules/myfeature.js
export function initMyFeature() {
  setupEventListeners();
}

function setupEventListeners() {
  // Your code
}

export function myFunction() {
  // ...
}
```

### 2. Import di Main

```javascript
// src/js/main.js
import { initMyFeature } from "./modules/myfeature.js";

function initializeApp() {
  initMyFeature(); // Add this line
}
```

### 3. Add Styling

```css
/* src/css/components/mycomponent.css */
.my-feature {
  background: var(--primary-red);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  transition: var(--transition-fast);
}
```

### 4. Import CSS

```css
/* src/css/main.css */
@import url("./components/mycomponent.css");
```

---

## Struktur Direktori Visual

```
📦 VintiX-Mini-RC
 ├── 📂 src/
 │   ├── 📄 index.html
 │   ├── 📂 css/
 │   │   ├── 📄 main.css ⭐ (import semua)
 │   │   ├── 📄 _variables.css (warna, spacing, dll)
 │   │   ├── 📄 _base.css (reset, global)
 │   │   ├── 📂 components/
 │   │   │   ├── 📄 navbar.css
 │   │   │   ├── 📄 hero.css
 │   │   │   ├── 📄 features.css
 │   │   │   ├── 📄 products.css
 │   │   │   ├── 📄 gallery.css
 │   │   │   ├── 📄 modal.css
 │   │   │   ├── 📄 forms.css
 │   │   │   └── 📄 footer.css
 │   │   └── 📂 utilities/
 │   │       ├── 📄 animations.css
 │   │       └── 📄 responsive.css
 │   └── 📂 js/
 │       ├── 📄 main.js ⭐ (entry point)
 │       ├── 📄 config.js (konstanta)
 │       ├── 📂 modules/ (fitur utama)
 │       │   ├── 📄 cart.js
 │       │   ├── 📄 modals.js
 │       │   ├── 📄 checkout.js
 │       │   ├── 📄 productPreview.js
 │       │   ├── 📄 animations.js
 │       │   ├── 📄 modelViewer.js
 │       │   ├── 📄 navigation.js
 │       │   └── 📄 buttons.js
 │       └── 📂 utils/ (helper functions)
 │           ├── 📄 formatter.js
 │           └── 📄 storage.js
 ├── 📂 assets/
 │   └── 📂 models/
 │       ├── rc_highwayman.../
 │       ├── rc_annihilator.../
 │       ├── rc_shvan.../
 │       └── fortnite_bttf.../
 ├── 📄 PROJECT_STRUCTURE.md (detail lengkap)
 ├── 📄 MIGRATION_GUIDE.md (panduan update)
 ├── 📄 STRUKTUR_FOLDER.md (Bahasa Indonesia)
 └── 📄 README.md
```

---

## Common Tasks

### Ubah Warna Primary

Edit: `src/css/_variables.css`

```css
--primary-red: #new-color;
```

### Ubah Spacing Global

Edit: `src/css/_variables.css`

```css
--spacing-lg: 2rem; /* dari 1.5rem */
```

### Add Animation

Edit: `src/css/utilities/animations.css`

```css
@keyframes myAnimation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

### Add Feature

1. Create `src/js/modules/myfeature.js`
2. Import & initialize di `src/js/main.js`
3. Create `src/css/components/myfeature.css` (optional)
4. Import CSS di `src/css/main.css` (optional)

### Add Utility Function

1. Create/Edit `src/js/utils/myutil.js`
2. Export function: `export function myUtil() { }`
3. Import where needed: `import { myUtil } from '../utils/myutil.js'`

### Link New Page

```html
<!-- Buat file: src/newpage.html -->
<link rel="stylesheet" href="css/main.css" />
<script type="module" src="js/main.js"></script>
```

---

## File Size Comparison

### Old Single Files

- `style.css`: ~1400 lines
- `script.js`: ~650 lines
- **Total**: 2050 lines (monolith)

### New Modular Files (avg lines per file)

- CSS files: 50-150 lines each
- JS files: 40-180 lines each
- **Total**: ~2050 lines (tapi lebih terstruktur!)

### Benefit: Clarity & Maintainability

- Lebih mudah menemukan code
- Lebih mudah debug
- Lebih mudah collaborate
- Lebih professional

---

## Tips & Tricks

### 💡 Gunakan Variable

```css
/* ✅ Good - Reusable */
background: var(--primary-red);
padding: var(--spacing-lg);

/* ❌ Bad - Hardcoded */
background: #c41e3a;
padding: 1.5rem;
```

### 💡 Import Pattern

```javascript
// ✅ Good - Semantic
import { formatIDR } from "../utils/formatter.js";

// ❌ Bad - Wrong path, no extension
import { formatIDR } from "formatter";
```

### 💡 Module Organization

```javascript
// ✅ Good - Clear responsibility
export function initFeature() {}
export function doSomething() {}
export function handleEvent() {}

// ❌ Bad - Mixed concerns
export function everyFunction() {}
```

---

## Debugging

Check console (F12):

```javascript
// If you see this - modules loaded
✅ App initialized successfully

// Check current section
console.log(getCurrentSection());

// Check cart
console.log(getCart());

// Check if modal open
console.log(isModalOpen('cartModal'));
```

---

## Learning Resources

- 📖 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Penjelasan detail
- 📖 [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Update dari struktur lama
- 📖 [STRUKTUR_FOLDER.md](STRUKTUR_FOLDER.md) - Bahasa Indonesia
- 🔗 [SMACSS](https://smacss.com/) - CSS Architecture
- 🔗 [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

## ⭐ Status Implementasi

- [x] Folder structure created
- [x] CSS modularized
- [x] JavaScript modularized
- [x] HTML updated
- [x] Config centralized
- [x] Documentation created
- [ ] Testing (your turn!)

---

## 🚀 Ready to Go!

Struktur baru siap digunakan. Happy coding! 🎉
