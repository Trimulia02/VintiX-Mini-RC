# VintiX Mini RC - E-Commerce untuk Remote Control Cars

## 📱 Tentang Proyek

VintiX Mini RC adalah aplikasi e-commerce modern untuk menjual mobil remote control (RC) dengan fitur:

- 🛒 **Shopping Cart** - Tambah/kurangi produk
- 💳 **Checkout System** - Proses pembayaran
- 🎨 **3D Model Viewer** - Preview mobil dalam 3D
- 📱 **Responsive Design** - Bekerja di semua perangkat
- 💾 **Cart Persistence** - Keranjang tersimpan di localStorage
- 🎯 **Modern Architecture** - Modular JavaScript & CSS terstruktur

---

## 🚀 Mulai Cepat

### 1. Buka Project

```bash
# Navigasi ke folder project
cd /Users/trimuliabahar/Hackathon-094/VintiX-Mini-RC

# Buka di browser (double-click atau open dengan HTTP server)
open src/index.html
```

### 2. Atau Gunakan Local Server

```bash
# Python 3
python3 -m http.server 8000
# Buka http://localhost:8000/src/

# Atau Node.js (jika terinstall)
npx serve src
```

---

## 📂 Struktur Folder

```
src/
├── index.html                    # Main HTML
├── css/                         # Styling (modular)
│   ├── main.css                 # Entry point
│   ├── _variables.css           # Design tokens
│   ├── _base.css                # Global styles
│   ├── components/              # Component styles
│   └── utilities/               # Helper styles
└── js/                         # Logic (modular)
    ├── main.js                 # Entry point
    ├── config.js               # Constants & paths
    ├── modules/                # Feature modules
    └── utils/                  # Helper functions

assets/
└── car-model/                   # 3D models GLTF
    ├── rc_highwayman_-_low_poly_model/
    ├── rc_annihilator_-_low_poly_model/
    ├── rc_shvan_-_low_poly_model/
    └── fortnite_back_to_the_future_time_machine/
```

---

## 🎯 Fitur Utama

### Shopping Cart

- ✅ Tambah/kurangi item
- ✅ Hapus item
- ✅ Hitung total otomatis
- ✅ Simpan di localStorage

### 3D Model Viewer

- ✅ Preview mobil RC dalam 3D
- ✅ Auto-rotate otomatis
- ✅ Berbagai model tersedia

### Checkout

- ✅ Validasi form
- ✅ Hitung pajak & total
- ✅ Proses pembayaran

---

## 📚 Dokumentasi

Baca dokumentasi lengkap untuk pemahaman mendalam:

| File                                               | Tujuan                                    |
| -------------------------------------------------- | ----------------------------------------- |
| [STRUKTUR_FOLDER.md](STRUKTUR_FOLDER.md)           | Penjelasan struktur folder & file         |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)       | Detail arsitektur JavaScript & CSS        |
| [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)           | Panduan upgrade dari struktur lama        |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md)           | Referensi cepat CSS variables & functions |
| [README_STRUKTUR_BARU.md](README_STRUKTUR_BARU.md) | Ringkasan perubahan struktur baru         |

---

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling dengan CSS variables
- **JavaScript ES6** - Modular architecture
- **Google Model-Viewer** - 3D model rendering
- **localStorage** - Client-side persistence

---

## 💻 Cara Develop

### Edit HTML

```bash
# File: src/index.html
# Tambah section, card, atau element baru
```

### Edit CSS (Styling)

```bash
# Global variable: src/css/_variables.css
# Component styles: src/css/components/
# Helper styles: src/css/utilities/

# Semua import ke src/css/main.css
```

### Edit JavaScript (Logic)

```bash
# Main entry: src/js/main.js
# Features: src/js/modules/
# Helpers: src/js/utils/

# Import ke main.js untuk dijalankan
```

---

## 🎨 CSS Variables (Design Tokens)

Gunakan variables untuk konsistensi:

```css
/* Warna */
var(--primary-red)      /* #c41e3a */
var(--tosca)            /* #4dbfb8 */
var(--cream)            /* #fff8e7 */
var(--dark)             /* #333333 */

/* Spacing */
var(--spacing-sm)       /* 0.5rem */
var(--spacing-md)       /* 1rem */
var(--spacing-lg)       /* 1.5rem */

/* Lainnya */
var(--transition-fast)  /* 0.3s ease */
var(--radius-md)        /* Border radius */
```

---

## 🔧 Module Functions

### Cart Module

```javascript
impport { addToCart, removeFromCart } from './modules/cart.js';

addToCart(product, price);
removeFromCart(itemId);
updateQuantity(itemId, qty);
```

### Modal Module

```javascript
import { openModal, closeModal } from "./modules/modals.js";

openModal("modalId");
closeModal("modalId");
```

### Formatter Util

```javascript
import { formatIDR } from "./utils/formatter.js";

formatIDR(50000); // "Rp 50.000,00"
```

Lihat [QUICK_REFERENCE.md](QUICK_REFERENCE.md) untuk lengkap.

---

## 🐛 Troubleshooting

### 3D Models tidak muncul

1. Buka browser console (F12)
2. Cek apakah ada error 404
3. Pastikan path: `/assets/car-model/[model-name]/scene.gltf`
4. Refresh halaman

### Cart tidak tersimpan

1. Buka DevTools → Application → localStorage
2. Cek key: `vintixCart`
3. Pastikan localStorage tidak disabled

### CSS tidak berubah

1. Clear browser cache (Cmd+Shift+R)
2. Pastikan CSS file di-import di main.css
3. Cek style priority (specificity)

---

## 📞 Kontak & Support

Jika ada pertanyaan atau issue:

1. Baca dokumentasi di folder ini
2. Cek browser console untuk error
3. Lihat file source yang relevan

---

## 📄 License

Proyek ini milik VintiX Team. Mohon tidak di-copy tanpa izin.

---

**Happy coding! 🚀**
