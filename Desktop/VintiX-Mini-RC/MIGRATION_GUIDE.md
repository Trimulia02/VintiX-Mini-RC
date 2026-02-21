# Migration Guide: Old Structure → New Structure

## 📦 What Changed?

### Before (Old Structure)

```
VintiX-Mini-RC/
├── index.html (monolithic)
├── style.css (all styles in one file)
├── script.js (all JavaScript in one file)
├── asset/ (3D models)
└── README.md
```

### After (New Structure)

```
VintiX-Mini-RC/
├── src/
│   ├── index.html
│   ├── css/
│   │   ├── main.css
│   │   ├── _variables.css
│   │   ├── _base.css
│   │   ├── components/
│   │   └── utilities/
│   └── js/
│       ├── main.js
│       ├── config.js
│       ├── modules/
│       └── utils/
├── assets/
│   └── models/
├── PROJECT_STRUCTURE.md
└── MIGRATION_GUIDE.md
```

---

## 🔄 Update Links in HTML

If you have references to the old files, update them:

### Old References

```html
<!-- Old -->
<link rel="stylesheet" href="style.css" />
<script src="script.js"></script>
```

### New References

```html
<!-- New -->
<link rel="stylesheet" href="src/css/main.css" />
<script type="module" src="src/js/main.js"></script>
```

---

## 🎨 CSS Migration

### Colors

Old style:

```css
/* In style.css */
:root {
  --primary-red: #c41e3a;
}
```

New style:

```css
/* In src/css/_variables.css */
:root {
  --primary-red: #c41e3a;
}
```

✅ Same variables! Just better organized.

### Component Styles

If you want to add styles for a new component:

1. Create file: `src/css/components/mycomponent.css`
2. Add styles using variables
3. Import in `src/css/main.css`:

```css
@import url("./components/mycomponent.css");
```

---

## 🔧 JavaScript Migration

### Old File Structure

```javascript
// script.js - everything in one file
let cart = [];

function formatIDR(amount) {
  /* ... */
}
function addToCart(product, price) {
  /* ... */
}
function initCart() {
  /* ... */
}
// ... 600+ lines of code
```

### New File Structure

```javascript
// src/js/config.js
export const CONFIG = {
  /* ... */
};

// src/js/utils/formatter.js
export function formatIDR(amount) {
  /* ... */
}

// src/js/modules/cart.js
export function initCart() {
  /* ... */
}
export function addToCart(product, price) {
  /* ... */
}

// src/js/main.js
import { initCart } from "./modules/cart.js";
// ...
initCart();
```

### API Changes

#### Cart Functions

```javascript
// Old
addToCart(product, price);

// New - Same! Still works the same way
import { addToCart } from "./modules/cart.js";
addToCart(product, price);
```

#### Modal Functions

```javascript
// Old
openModal("modalId");
closeModal("modalId");

// New - Same!
import { openModal, closeModal } from "./modules/modals.js";
openModal("modalId");
closeModal("modalId");
```

---

## 📁 Asset Organization

### Old

```
asset/
├── rc_highwayman_-_low_poly_model/
├── rc_annihilator_-_low_poly_model/
├── rc_shvan_-_low_poly_model/
└── fortnite_back_to_the_future_time_machine/
```

### New (Current Structure)

```
assets/
└── car-model/
    ├── rc_highwayman_-_low_poly_model/
    ├── rc_annihilator_-_low_poly_model/
    ├── rc_shvan_-_low_poly_model/
    └── fortnite_back_to_the_future_time_machine/
```

**Update model paths in HTML:**

```html
<!-- Old -->
src="asset/rc_highwayman_-_low_poly_model/scene.gltf"

<!-- New: Absolute path format -->
src="/assets/car-model/rc_highwayman_-_low_poly_model/scene.gltf"
```

**Important:** Gunakan path absolute (`/assets/...`) bukan relative (`./assets/` atau `../assets/`) agar bekerja di semua context (HTML, JavaScript, CSS).

---

## 🚀 How to Migrate Existing Code

### Step 1: Copy Files

```bash
# Copy new structure
cp -r src/ ./
cp -r assets/ ./

# Keep old files for reference
# mv index.html index.html.old
# mv style.css style.css.old
# mv script.js script.js.old
```

### Step 2: Update References

In your HTML, update:

```html
<link rel="stylesheet" href="src/css/main.css" />
<script type="module" src="src/js/main.js"></script>
```

### Step 3: Update Asset Paths (IMPORTANT)

Assets sekarang di `/assets/car-model/` dengan format absolute path:

```html
<!-- Correct: Absolute path -->
src="/assets/car-model/rc_highwayman_-_low_poly_model/scene.gltf"

<!-- JANGAN GUNAKAN: Relative path -->
<!-- src="assets/car-model/..." -->
❌
<!-- src="../assets/car-model/..." -->
❌
```

**Mengapa absolute path?**

- Bekerja di semua context (HTML, JavaScript, CSS)
- Tidak terpengaruh oleh lokasi file
- Lebih reliable untuk navigation aplikasi

### Step 4: Test

- Open index.html in browser
- Check browser console for errors
- Test all features (cart, checkout, preview)

---

## 🔧 Adding Custom Features

### Add a New Module

1. **Create file:** `src/js/modules/myfeature.js`

```javascript
export function initMyFeature() {
  console.log("My feature initialized");
}

export function myFeatureFunction() {
  // feature logic
}
```

2. **Import in main.js:**

```javascript
import { initMyFeature } from "./modules/myfeature.js";

function initializeApp() {
  // ... existing code
  initMyFeature();
}
```

### Add New Styles

1. **Create file:** `src/css/components/mycomponent.css`

```css
.my-component {
  color: var(--primary-red);
  padding: var(--spacing-lg);
}
```

2. **Import in main.css:**

```css
@import url("./components/mycomponent.css");
```

---

## 🐛 Troubleshooting

### Issue: Styles not loading

**Solution:** Check path is correct

```html
<!-- Must be relative to HTML location -->
<link rel="stylesheet" href="src/css/main.css" />
```

### Issue: JavaScript modules not working

**Solution:** Use `type="module"` on script tag

```html
<script type="module" src="src/js/main.js"></script>
```

### Issue: Import errors

**Solution:** Check file paths and extensions

```javascript
// ✅ Correct
import { initCart } from "./modules/cart.js";

// ❌ Wrong - missing .js
import { initCart } from "./modules/cart";
```

### Issue: Cart not working

**Solution:** Make sure all modules are imported in `main.js`

```javascript
import { initCart } from "./modules/cart.js";
// ... other imports
document.addEventListener("DOMContentLoaded", initializeApp);
```

---

## 📝 Keeping Old Files

You can safely keep the old files as reference:

- `index.html.old` - Old HTML
- `style.css.old` - Old CSS
- `script.js.old` - Old JavaScript

This helps if you need to copy code or remember functionality.

---

## ✅ Checklist for Migration

- [ ] Copy `src/` folder to project root
- [ ] Copy `assets/` folder to project root
- [ ] Update HTML links to `src/css/main.css` and `src/js/main.js`
- [ ] Update asset paths if moved
- [ ] Test in browser
- [ ] Check console for errors
- [ ] Test cart functionality
- [ ] Test checkout
- [ ] Test 3D model preview (models di `/assets/car-model/`)
- [ ] Test responsive design

---

## 🎉 You're Done!

Your project is now organized and maintainable!

### Next Steps:

1. Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed architecture
2. Familiarize yourself with the modules
3. Start customizing with the new structure
4. Add your own features using the new organization

Happy coding! 🚀
