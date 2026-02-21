# 📋 INSTRUKSI LENGKAP - VintiX Mini RC

Panduan lengkap dan jelas untuk mengerti, menggunakan, dan mengembangkan VintiX Mini RC.

---

## ✅ Daftar Cepat

- **Folder Project:** `/Users/trimuliabahar/Hackathon-094/VintiX-Mini-RC`
- **File HTML:** `src/index.html`
- **Path 3D Models:** `/assets/car-model/` (ABSOLUTE PATH)
- **CSS Entry:** `src/css/main.css`
- **JS Entry:** `src/js/main.js`

---

## 🚀 1. Cara Membuka Project

### Option A: Double-Click (Paling Mudah)

```bash
# Buka Finder
open /Users/trimuliabahar/Hackathon-094/VintiX-Mini-RC/src/

# Double-click file: index.html
# Browser akan terbuka otomatis
```

### Option B: Menggunakan Terminal

```bash
# Buka terminal di folder project
cd /Users/trimuliabahar/Hackathon-094/VintiX-Mini-RC

# Jalankan Python server
python3 -m http.server 8000

# Buka di browser: http://localhost:8000/src/
```

### Option C: Buka dengan VS Code

```bash
# Dari terminal
code /Users/trimuliabahar/Hackathon-094/VintiX-Mini-RC

# Dari VS Code: File → Open Folder → pilih folder VintiX-Mini-RC
```

---

## 📂 2. Struktur Folder yang Benar

**ACTUAL STRUCTURE (Struktur Sebenarnya):**

```
VintiX-Mini-RC/
├── src/                          ← SUMBER CODE
│   ├── index.html                ← HTML UTAMA (buka file ini)
│   ├── css/
│   │   ├── main.css              ← Entry point CSS
│   │   ├── _variables.css        ← Design tokens (warna, spacing)
│   │   ├── _base.css             ← Global styles
│   │   ├── components/           ← Styling per komponen
│   │   └── utilities/            ← Helper styles (animasi, responsive)
│   └── js/
│       ├── main.js               ← Entry point JavaScript
│       ├── config.js             ← Constants & path 3D models
│       ├── modules/              ← Feature modules (cart, modals, dll)
│       └── utils/                ← Helper functions
│
├── assets/
│   └── car-model/                ← 3D MODELS (PATH PENTING!)
│       ├── rc_highwayman_-_low_poly_model/
│       │   └── scene.gltf        ← Model file
│       ├── rc_annihilator_-_low_poly_model/
│       │   └── scene.gltf
│       ├── rc_shvan_-_low_poly_model/
│       │   └── scene.gltf
│       └── fortnite_back_to_the_future_time_machine/
│           └── scene.gltf
│
├── README.md                     ← Deskripsi project
├── INSTRUKSI_LENGKAP.md          ← File ini (panduan lengkap)
├── STRUKTUR_FOLDER.md            ← Penjelasan struktur (Bahasa Indonesia)
├── PROJECT_STRUCTURE.md          ← Penjelasan struktur (Bahasa Inggris)
├── MIGRATION_GUIDE.md            ← Panduan update dari struktur lama
├── QUICK_REFERENCE.md            ← Referensi cepat
└── README_STRUKTUR_BARU.md       ← Ringkasan perubahan struktur

```

---

## 🔗 3. Path 3D Models (PENTING!)

### ✅ BENAR - Gunakan Path Absolute

Path format yang bekerja di semua situasi:

```
/assets/car-model/[MODEL_NAME]/scene.gltf
```

**Contoh lengkap:**

```
/assets/car-model/rc_highwayman_-_low_poly_model/scene.gltf
/assets/car-model/rc_annihilator_-_low_poly_model/scene.gltf
/assets/car-model/rc_shvan_-_low_poly_model/scene.gltf
/assets/car-model/fortnite_back_to_the_future_time_machine/scene.gltf
```

**Di mana digunakan:**

1. **HTML** (`src/index.html`):

```html
<model-viewer src="/assets/car-model/..." /></model-viewer>
```

2. **JavaScript** (`src/js/config.js`):

```javascript
export const CONFIG = {
  MODELS: {
    RC_HIGHWAYMAN: "/assets/car-model/...",
    // ...
  },
};
```

### ❌ SALAH - Jangan Gunakan

```
assets/car-model/...             ❌ Relative (tidak konsisten)
./assets/car-model/...           ❌ Relative (dari file JS)
../assets/car-model/...          ❌ Relative (dari subfolder)
../../../assets/car-model/...    ❌ Terlalu kompleks
```

### Mengapa Absolute Path?

- ✅ Bekerja di semua context (HTML, JS, CSS)
- ✅ Tidak terpengaruh lokasi file
- ✅ Lebih reliable untuk SPA (Single Page App)
- ✅ Konsisten di seluruh codebase

---

## 🎨 4. Edit CSS (Styling)

### 4.1 Ubah Warna Global

**File:** `src/css/_variables.css`

```css
:root {
  --primary-red: #c41e3a;        ← Ubah di sini (berlaku di semua tempat)
  --tosca: #4dbfb8;
  --cream: #fff8e7;
  --dark: #333333;
}
```

**Gunakan di mana saja:**

```css
.button {
  background: var(--primary-red);  ← Otomatis pakai warna dari atas
  color: var(--cream);
  padding: var(--spacing-lg);
}
```

### 4.2 Edit Styling Komponen

**Struktur:**

```
src/css/
├── components/
│   ├── navbar.css
│   ├── hero.css
│   ├── products.css
│   ├── gallery.css
│   ├── modal.css
│   ├── forms.css
│   ├── features.css
│   └── footer.css
```

**Cara edit:**

1. Buka file komponen (e.g., `src/css/components/products.css`)
2. Edit styling di situ
3. Otomatis di-import oleh `src/css/main.css`

### 4.3 Tambah Styling Baru

1. **Buat file:** `src/css/components/my-component.css`

```css
.my-component {
  background: var(--primary-red);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}
```

2. **Import di:** `src/css/main.css`

```css
@import url("./components/my-component.css");
```

---

## 🔧 5. Edit JavaScript (Logic)

### 5.1 Struktur JavaScript

```
src/js/
├── main.js              ← Entry point (memanggil semua modul)
├── config.js            ← Constants & path 3D models
├── modules/             ← Feature-specific modules
│   ├── cart.js
│   ├── modals.js
│   ├── checkout.js
│   ├── productPreview.js
│   ├── animations.js
│   ├── modelViewer.js
│   ├── navigation.js
│   └── buttons.js
└── utils/              ← Helper functions
    ├── formatter.js    (formatIDR, parsePrice)
    └── storage.js      (saveCart, loadCart)
```

### 5.2 Import Path (PENTING!)

**✅ BENAR:**

```javascript
import { formatIDR } from "../utils/formatter.js";
import { addToCart } from "../modules/cart.js";
import { CONFIG } from "../config.js";
```

**❌ SALAH:**

```javascript
import { formatIDR } from "formatter"; // Missing .js
import { formatIDR } from "../utils/formatter"; // Missing .js
```

**Aturan:**

- Selalu gunakan path relatif di JavaScript
- Selalu tambahkan extension `.js`
- Dari `main.js` gunakan `./modules/` dan `./utils/`

### 5.3 Tambah Modul Baru

**Step 1:** Buat file `src/js/modules/myFeature.js`

```javascript
// Selalu export function init
export function initMyFeature() {
  console.log("My feature initialized");
  setupEventListeners();
}

function setupEventListeners() {
  // Logic di sini
}

export function myFunction() {
  // Function yang bisa di-import
  return "result";
}
```

**Step 2:** Import di `src/js/main.js`

```javascript
import { initMyFeature } from "./modules/myFeature.js";

function initializeApp() {
  // ... existing code ...
  initMyFeature(); // ← Tambah di sini
}
```

**Step 3:** Jalankan di browser

```
F12 → Console → Cek ada message "My feature initialized"
```

---

## 🛒 6. Shopping Cart Module

### Fungsi Utama

**File:** `src/js/modules/cart.js`

```javascript
// Tambah item ke cart
addToCart(productName, price);

// Hapus item dari cart
removeFromCart(itemId);

// Update jumlah item
updateQuantity(itemId, newQty);

// Update tampilan cart (refresh UI)
updateCart();

// Ambil data cart
getCart(); // → Array of items
```

### Cara Pakai

**HTML:**

```html
<button
  onclick="import('./js/modules/cart.js').then(m => m.addToCart('RC Highwayman', 150000))"
>
  Add to Cart
</button>
```

**Atau di JavaScript:**

```javascript
import { addToCart } from "./modules/cart.js";

addToCart("RC Highwayman", 150000);
```

### Data Structure

```javascript
// Item di cart
{
  id: "rc-highwayman-1",
  name: "RC Highwayman",
  price: 150000,
  quantity: 2,
  model: "/assets/car-model/rc_highwayman_-_low_poly_model/scene.gltf"
}
```

---

## 🎬 7. 3D Model Viewer

### File: `src/js/modules/modelViewer.js`

Menampilkan 3D model dengan fitur:

- ✅ Auto-rotate (putar otomatis)
- ✅ Shadow (bayangan)
- ✅ Loading indicator
- ✅ Error handling

### Cara Pakai HTML

```html
<model-viewer
  src="/assets/car-model/rc_highwayman_-_low_poly_model/scene.gltf"
  alt="RC Highwayman"
  auto-rotate
  shadow-intensity="1"
  style="width: 100%; height: 300px;"
>
</model-viewer>
```

### Path 3D Models di config.js

```javascript
// src/js/config.js
export const CONFIG = {
  MODELS: {
    RC_HIGHWAYMAN:
      "/assets/car-model/rc_highwayman_-_low_poly_model/scene.gltf",
    RC_ANNIHILATOR:
      "/assets/car-model/rc_annihilator_-_low_poly_model/scene.gltf",
    RC_SHVAN: "/assets/car-model/rc_shvan_-_low_poly_model/scene.gltf",
    FORTNITE_BTTF:
      "/assets/car-model/fortnite_back_to_the_future_time_machine/scene.gltf",
  },
};

// Gunakan saat tambah ke cart
import { CONFIG } from "./config.js";
addToCart(productName, price, (modelPath = CONFIG.MODELS.RC_HIGHWAYMAN));
```

---

## 🧪 8. Testing & Debug

### Browser Console (F12)

```javascript
// Buka browser console: F12 → Console tab

// Cek apakah modules loaded
console.log("Check console untuk messages saat app initialize");

// Test cart
// Masuk cart, add item, lihat console untuk messages

// Cek 3D model path
// Lihat Network tab (F12 → Network) saat load model
// Pastikan status 200 (tidak 404)
```

### Debug 3D Model Tidak Muncul

1. **Buka Console (F12)**
2. **Cek Network tab** → Filter: `scene.gltf`
3. **Pastikan status:** 200 (bukan 404)
4. **Jika 404:**
   - Path keliru di config.js atau HTML
   - File model tidak ada di `/assets/car-model/`

### Debug CSS Tidak Berubah

1. **Inspek element** (Right-click → Inspect)
2. **Lihat computed styles**
3. **Cek ada override dari CSS lain?**
4. **Clear cache:** Cmd+Shift+R (di Mac)

### Debug JavaScript Error

1. **Buka Console (F12)**
2. **Cari error message**
3. **Cek file & line number**
4. **Buka file tersebut & perbaiki**

---

## 📖 9. Dokumentasi Lengkap

Baca dokumentasi sesuai kebutuhan:

| File                        | Untuk Apa                                   |
| --------------------------- | ------------------------------------------- |
| **README.md**               | Overview project & fitur                    |
| **STRUKTUR_FOLDER.md**      | Penjelasan folder & file (Bahasa Indonesia) |
| **PROJECT_STRUCTURE.md**    | Penjelasan arsitektur (Bahasa Inggris)      |
| **QUICK_REFERENCE.md**      | Referensi cepat: CSS variables, functions   |
| **MIGRATION_GUIDE.md**      | Panduan update dari versi lama              |
| **README_STRUKTUR_BARU.md** | Ringkasan perubahan struktur                |
| **INSTRUKSI_LENGKAP.md**    | File ini (panduan lengkap)                  |

---

## 💡 10. Tips & Best Practices

### ✅ DO (Lakukan)

```css
/* CSS: Gunakan variables */
.button {
  color: var(--primary-red);
}
```

```javascript
// JS: Gunakan named imports
import { addToCart } from "./modules/cart.js";
```

```javascript
// JS: Selalu tambah .js extension
import { name } from "./file.js";
```

```
Paths: Gunakan absolute path untuk assets
/assets/car-model/...
```

### ❌ DON'T (Jangan)

```css
/* CSS: Jangan hardcode warna */
.button {
  color: #c41e3a;
}
```

```javascript
// JS: Jangan gunakan wildcard import
import * as cart from "./modules/cart.js";
```

```javascript
// JS: Jangan abaikan .js extension
import { name } from "./file";
```

```
Paths: Jangan gunakan relative path untuk assets
assets/car-model/...  ❌
./assets/car-model/...  ❌
```

---

## 🐛 11. Common Issues & Solutions

### Issue: 3D Model Tidak Tampil

**Cause:** Path salah atau file tidak ada

**Solution:**

1. Verifikasi path di config.js: `/assets/car-model/[model]/scene.gltf`
2. Buka DevTools F12 → Network
3. Filter: `.gltf`
4. Lihat status (200 = OK, 404 = Not Found)
5. Jika 404, cek path di config.js atau index.html

### Issue: Cart Tidak Tersimpan

**Cause:** localStorage disabled atau error saat save

**Solution:**

1. Buka DevTools F12 → Console
2. Ketik: `localStorage`
3. Pastikan tidak error
4. Cek browser localStorage isn't disabled

### Issue: CSS Tidak Berubah

**Cause:** File CSS tidak ter-import atau cache

**Solution:**

1. Clear cache: Cmd+Shift+R (Mac)
2. Pastikan file CSS di-import di main.css
3. Cek selector specificity

### Issue: JavaScript Error

**Cause:** Import path salah atau syntax error

**Solution:**

1. Buka Console F12
2. Baca error message dengan teliti
3. Cek file path & extension
4. Arahkan ke line error & perbaiki

---

## 📝 12. Checklist Development

Sebelum submit/push code:

- [ ] HTML valid (buka di browser, cek console)
- [ ] CSS berubah sesuai keinginan
- [ ] JavaScript loading tanpa error (F12 console)
- [ ] 3D models muncul (di Network tab: 200 OK)
- [ ] Shopping cart berfungsi (add, update, remove)
- [ ] Responsive design (test di mobile, tablet, desktop)
- [ ] localStorage bekerja (refresh halaman, cart tetap ada)

---

## 🎉 Final Notes

1. **Path 3D Models:** Selalu gunakan `/assets/car-model/...` (ABSOLUTE PATH)
2. **CSS:** Gunakan variables dari `_variables.css`
3. **JavaScript:** Gunakan module pattern dengan import/export
4. **Console:** Sering cek F12 console untuk debug
5. **Documentation:** Baca doc sesuai kebutuhan

---

**Good luck coding! 🚀**

Jika ada pertanyaan, baca dokumentasi yang sesuai atau cek source code langsung.
