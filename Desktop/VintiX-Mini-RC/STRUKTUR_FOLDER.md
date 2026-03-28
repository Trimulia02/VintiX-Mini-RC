# 📚 VintiX Mini RC - Struktur Folder Baru

Struktur folder telah diorganisir untuk memudahkan pemeliharaan dan scalability kode!

## 🗂️ Perbandingan Struktur Lama vs Baru

### ❌ Struktur Lama (Monolith)

```
VintiX-Mini-RC/
├── index.html          (semua HTML)
├── style.css          (semua CSS - 1400+ lines)
├── script.js          (semua JS - 650+ lines)
└── asset/
```

### ✅ Struktur Baru (Modular)

```
VintiX-Mini-RC/
├── src/
│   ├── index.html
│   ├── css/
│   │   ├── main.css    (entry point)
│   │   ├── _variables.css
│   │   ├── _base.css
│   │   ├── components/ (8 file CSS terpisah)
│   │   └── utilities/  (2 file CSS terpisah)
│   └── js/
│       ├── main.js     (entry point)
│       ├── config.js   (konstanta)
│       ├── modules/    (8 file JS terpisah)
│       └── utils/      (2 file utilitas)
├── assets/
│   └── car-model/                (4 3D models GLTF)
│       ├── rc_highwayman_-_low_poly_model/
│       ├── rc_annihilator_-_low_poly_model/
│       ├── rc_shvan_-_low_poly_model/
│       └── fortnite_back_to_the_future_time_machine/
└── 📄 DOKUMENTASI
```

---

## 📂 Penjelasan Folder Utama

### 1. **src/css/** - Styling Terstruktur

| File             | Fungsi                                     |
| ---------------- | ------------------------------------------ |
| `main.css`       | Entry point yang import semua CSS          |
| `_variables.css` | Warna, spacing, typography (CSS variables) |
| `_base.css`      | Reset global & style dasar                 |
| `components/`    | Styling per komponen UI                    |
| `utilities/`     | Animasi & responsive design                |

**Keuntungan:**

- ✅ Mudah menemukan style komponen tertentu
- ✅ CSS variables terpusat untuk konsistensi
- ✅ Separasi concerns (utilities vs components)
- ✅ File lebih kecil = lebih mudah dibaca

### 2. **src/js/** - Logic Termodulasi

| Folder      | Fungsi                                |
| ----------- | ------------------------------------- |
| `main.js`   | App entry point, koordinator modul    |
| `config.js` | Konstanta & konfigurasi global        |
| `modules/`  | Fitur-fitur utama (cart, modal, dll)  |
| `utils/`    | Helper functions (formatter, storage) |

**Keuntungan:**

- ✅ Setiap modul punya tanggung jawab spesifik
- ✅ Mudah reuse fungsi dengan import
- ✅ Testing lebih mudah
- ✅ Debugging lebih cepat

### 3. **assets/car-model/** - 3D Models Terorganisir

Semua 3D model GLTF dikumpulkan di satu folder terstruktur:

```
assets/car-model/
├── rc_highwayman_-_low_poly_model/
│   └── scene.gltf
├── rc_annihilator_-_low_poly_model/
│   └── scene.gltf
├── rc_shvan_-_low_poly_model/
│   └── scene.gltf
└── fortnite_back_to_the_future_time_machine/
    └── scene.gltf
```

Path format: `/assets/car-model/[NAMA_MODEL]/scene.gltf`

---

## 🎯 Map Module JS

```
Cart Management
└─ modules/cart.js
   - addToCart()
   - removeFromCart()
   - updateQuantity()
   - updateCart()

Modal System
└─ modules/modals.js
   - openModal()
   - closeModal()
   - isModalOpen()

Checkout Flow
└─ modules/checkout.js
   - initCheckout()
   - processPayment()

Product Preview
└─ modules/productPreview.js
   - showModelPreview()

Animations
└─ modules/animations.js
   - initAnimations()
   - animateElement()

3D Viewer
└─ modules/modelViewer.js
   - changeModelSource()
   - getModelSource()

Navigation
└─ modules/navigation.js
   - scrollToSection()
   - getCurrentSection()

Buttons
└─ modules/buttons.js
   - handleProductView()

Utilities
├─ utils/formatter.js
│  - formatIDR()
│  - parsePrice()
└─ utils/storage.js
   - saveCart()
   - loadCart()
```

---

## 🚀 Cara Menggunakan

### Menambah Fitur Baru

**Step 1:** Buat file modul di `src/js/modules/`

```javascript
// src/js/modules/newFeature.js
export function initNewFeature() {
  console.log("Feature initialized");
}
```

**Step 2:** Import di `src/js/main.js`

```javascript
import { initNewFeature } from "./modules/newFeature.js";

// Di dalam initializeApp()
initNewFeature();
```

### Menambah Styling Baru

**Step 1:** Buat file CSS di `src/css/components/`

```css
/* src/css/components/mycomponent.css */
.my-component {
  color: var(--primary-red); /* Gunakan variables! */
  padding: var(--spacing-lg);
}
```

**Step 2:** Import di `src/css/main.css`

```css
@import url("./components/mycomponent.css");
```

### Mengubah Warna Global

Edit di `src/css/_variables.css`:

```css
:root {
  --primary-red: #new-color; /* Berubah di semua tempat! */
}
```

---

## 📊 File Structure Tree

```
src/
├── index.html
├── css/
│   ├── main.css              (entry point)
│   ├── _variables.css        (60 lines)
│   ├── _base.css             (80 lines)
│   ├── components/
│   │   ├── navbar.css        (70 lines)
│   │   ├── hero.css          (75 lines)
│   │   ├── features.css      (50 lines)
│   │   ├── products.css      (150 lines)
│   │   ├── gallery.css       (80 lines)
│   │   ├── modal.css         (130 lines)
│   │   ├── forms.css         (180 lines)
│   │   └── footer.css        (70 lines)
│   └── utilities/
│       ├── animations.css    (100 lines)
│       └── responsive.css    (80 lines)
└── js/
    ├── main.js               (60 lines - koordinator)
    ├── config.js             (40 lines - konstanta)
    ├── modules/
    │   ├── cart.js           (180 lines)
    │   ├── modals.js         (65 lines)
    │   ├── checkout.js       (75 lines)
    │   ├── productPreview.js (100 lines)
    │   ├── animations.js     (45 lines)
    │   ├── modelViewer.js    (90 lines)
    │   ├── navigation.js     (70 lines)
    │   └── buttons.js        (75 lines)
    └── utils/
        ├── formatter.js      (40 lines)
        └── storage.js        (65 lines)
```

---

## 💡 Keuntungan Struktur Baru

| Aspek              | Lama              | Baru                  |
| ------------------ | ----------------- | --------------------- |
| **Menemukan Code** | Scroll 650 lines  | Buka file spesifik    |
| **Reusability**    | Sulit             | Import & export       |
| **Testing**        | Semua tercampur   | Modul independent     |
| **Collaboration**  | Banyak conflict   | Tiap orang: file beda |
| **Performance**    | 1 CSS, 1 JS besar | Bisa code splitting   |
| **Maintenance**    | Kompleks          | Mudah & terstruktur   |
| **Scalability**    | Terbatas          | Sangat mudah          |

---

## 📖 Dokumentasi Lengkap

- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Detail lengkap setiap folder & file
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Panduan update dari struktur lama

---

## ✅ Checklist Implementasi

- [x] Folder structure dibuat
- [x] CSS diorganisir dengan SMACSS
- [x] JavaScript dimodularisasi
- [x] HTML diupdate dengan links baru
- [x] Config & constants terpusat
- [x] Dokumentasi lengkap
- [ ] Test di browser
- [ ] Update asset paths (optional)

---

## 🧪 Testing Cepat

```bash
# Buka di browser
open src/index.html

# Atau setup HTTP server
python3 -m http.server 8000
# Buka http://localhost:8000/src/
```

Buka console browser (F12) untuk melihat messages dari module initialization.

---

## 🎉 Selesai!

Kode Anda sekarang:

- ✅ **Lebih mudah dibaca**
- ✅ **Lebih mudah dimaintain**
- ✅ **Lebih mudah ditambah fitur**
- ✅ **Lebih mudah di-debug**
- ✅ **Lebih professional**

Selamat! 🚀

---

**Pertanyaan?** Baca [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) untuk detail lengkap!
