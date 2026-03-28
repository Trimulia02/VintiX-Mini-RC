# VintiX Mini RC - Project Structure Documentation

## 📁 Folder Structure

```
VintiX-Mini-RC/
├── src/
│   ├── index.html                 # Main HTML entry point
│   ├── css/
│   │   ├── main.css              # Main CSS entry (imports all)
│   │   ├── _variables.css        # Design tokens & CSS variables
│   │   ├── _base.css             # Global styles & reset
│   │   ├── components/           # Component-specific styles
│   │   │   ├── navbar.css
│   │   │   ├── hero.css
│   │   │   ├── features.css
│   │   │   ├── products.css
│   │   │   ├── gallery.css
│   │   │   ├── modal.css
│   │   │   ├── forms.css
│   │   │   └── footer.css
│   │   └── utilities/            # Utility & helper styles
│   │       ├── animations.css
│   │       └── responsive.css
│   └── js/
│       ├── main.js               # App entry point
│       ├── config.js             # Configuration & constants
│       ├── modules/              # Feature modules
│       │   ├── cart.js
│       │   ├── modals.js
│       │   ├── checkout.js
│       │   ├── productPreview.js
│       │   ├── animations.js
│       │   ├── modelViewer.js
│       │   ├── navigation.js
│       │   └── buttons.js
│       └── utils/                # Utility functions
│           ├── formatter.js
│           └── storage.js
├── assets/                        # Asset files
│   └── car-model/                # 3D models GLTF
│       ├── rc_highwayman_-_low_poly_model/
│       │   └── scene.gltf
│       ├── rc_annihilator_-_low_poly_model/
│       │   └── scene.gltf
│       ├── rc_shvan_-_low_poly_model/
│       │   └── scene.gltf
│       └── fortnite_back_to_the_future_time_machine/
│           └── scene.gltf
├── README.md
└── PROJECT_STRUCTURE.md          # This file
```

---

## 🎨 CSS Architecture

### Structure Overview

The CSS is organized using the **SMACSS (Scalable and Modular Architecture for CSS)** methodology:

### Layers

#### 1. **\_variables.css** - Design Tokens

Centralized CSS custom properties (variables) for:

- **Colors**: Primary red, tosca, cream, etc.
- **Spacing**: xs, sm, md, lg, xl, 2xl, 3xl
- **Typography**: Font sizes, weights, line heights
- **Shadows**: Consistent shadow values
- **Transitions**: Animation timings
- **Z-index**: Layering management

```css
:root {
  --primary-red: #c41e3a;
  --spacing-lg: 1.5rem;
  --transition-fast: 0.3s ease;
}
```

#### 2. **\_base.css** - Global Styles

- HTML5 reset
- Basic element styling (typography, buttons, forms)
- Utility classes

#### 3. **components/** - Component Styles

Organized by UI components:

- `navbar.css` - Navigation bar styling
- `hero.css` - Hero banner
- `features.css` - Feature boxes
- `products.css` - Product cards & grid
- `gallery.css` - Gallery section
- `modal.css` - Modals & dialogs
- `forms.css` - Forms, buttons, cart items
- `footer.css` - Footer styling

#### 4. **utilities/** - Helper Styles

- `animations.css` - Keyframe animations & animation classes
- `responsive.css` - Media queries & breakpoints

### CSS Best Practices

✅ All CSS variables defined in `:root`  
✅ Consistent naming using BEM-like conventions  
✅ Mobile-first responsive design  
✅ Organized component separation  
✅ Reusable animation classes

---

## 🔧 JavaScript Architecture

### Module Structure

The JavaScript uses **ES6 modules** with clear separation of concerns:

### Core Modules

#### **config.js**

Central configuration and constants:

```javascript
export const CONFIG = {
  CURRENCY: "IDR",
  CART_STORAGE_KEY: "vintixCart",
  MODELS: {
    /* model paths */
  },
  TAX_RATE: 0.1,
};
```

#### **main.js**

Application entry point that:

- Initializes all modules
- Runs on DOM ready event
- Coordinates module communication

### Feature Modules (src/js/modules/)

#### **cart.js**

Shopping cart management:

- `initCart()` - Initialize cart
- `addToCart(product, price)` - Add item
- `removeFromCart(itemId)` - Remove item
- `updateQuantity(itemId, quantity)` - Update quantity
- `updateCart()` - Refresh UI

#### **modals.js**

Modal dialog handling:

- `openModal(modalId)` - Open a modal
- `closeModal(modalId)` - Close a modal
- `isModalOpen(modalId)` - Check if open

#### **checkout.js**

Payment processing:

- `initCheckout()` - Setup checkout
- `processPayment()` - Process payment
- `validateCheckoutForm()` - Validate form

#### **productPreview.js**

3D model preview:

- `initProductPreview()` - Setup preview
- `showModelPreview(productData)` - Show preview modal

#### **animations.js**

Scroll animations:

- `initAnimations()` - Setup animations
- `animateElement(element, delay)` - Animate element

#### **modelViewer.js**

3D model viewer management:

- `initModelViewers()` - Setup model viewers
- `changeModelSource(selector, modelSrc)` - Change model

#### **navigation.js**

Navigation & scrolling:

- `initNavigation()` - Setup nav
- `scrollToSection(sectionId)` - Scroll animation
- `getCurrentSection()` - Get current section

#### **buttons.js**

Button interactions:

- `initButtons()` - Setup all buttons
- `handleProductView(productName)` - Handle product view

### Utility Modules (src/js/utils/)

#### **formatter.js**

Data formatting utilities:

- `formatIDR(amount)` - Format currency
- `formatDate(date)` - Format date
- `parsePrice(priceText)` - Parse price

#### **storage.js**

LocalStorage management:

- `saveCart(cart)` - Save cart
- `loadCart()` - Load cart
- `saveData(key, value)` - Generic save
- `loadData(key)` - Generic load

---

## 📝 How to Use & Maintain

### Adding a New Feature

1. Create a new module in `src/js/modules/`
2. Export initialization function
3. Import and call in `src/js/main.js`

### Styling a New Component

1. Create component CSS file in `src/css/components/`
2. Use CSS variables from `_variables.css`
3. Import in `src/css/main.css`

### Modifying Colors

Update `src/css/_variables.css`:

```css
:root {
  --primary-red: #new-color;
}
```

Changes apply everywhere automatically!

### Adding Animations

Add keyframes to `src/css/utilities/animations.css`:

```css
@keyframes newAnimation {
  from {
    /* ... */
  }
  to {
    /* ... */
  }
}
```

---

## 🔄 Module Dependencies

```
main.js
├── config.js
├── modules/
│   ├── cart.js
│   │   ├── formatter.js
│   │   └── storage.js
│   ├── modals.js
│   ├── checkout.js
│   │   ├── formatter.js
│   │   ├── modals.js
│   │   └── cart.js
│   ├── productPreview.js
│   │   ├── formatter.js
│   │   ├── modals.js
│   │   └── cart.js
│   ├── animations.js
│   ├── modelViewer.js
│   ├── navigation.js
│   └── buttons.js
└── utils/
    ├── formatter.js
    └── storage.js
```

---

## 💡 Benefits of This Structure

✅ **Maintainability** - Clear organization makes changes easy  
✅ **Scalability** - Easy to add new features  
✅ **Reusability** - Components can be reused  
✅ **Testing** - Modules can be tested independently  
✅ **Performance** - Modular approach allows code splitting  
✅ **Consistency** - Centralized design tokens  
✅ **Team Collaboration** - Clear structure for team members

---

## 🚀 Development Tips

### File Naming Conventions

- CSS: `kebab-case.css` (e.g., `navbar.css`)
- JavaScript: `camelCase.js` (e.g., `productPreview.js`)
- Folders: `lowercase` (e.g., `components`, `modules`)

### Code Organization

- One main responsibility per file
- Related functionality in same module
- Utilities in separate util files
- Constants in `config.js`

### Adding New Pages

1. Create new HTML file in `src/`
2. Link to `src/css/main.css`
3. Link to `src/js/main.js`

### Debugging

- Check browser console for errors
- Use module exports/imports to verify dependencies
- Check CSS cascade and specificity if styles don't apply

---

## 📚 References

- SMACSS Methodology: https://smacss.com/
- CSS Variables: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- ES6 Modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
