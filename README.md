# 📊 DataPulse AI — Enterprise E-Commerce Analytics

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-2ea44f?style=flat&logo=github)](https://olyxmintabansos-byte.github.io/datapulse-ai/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-blue?style=flat)]()
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat)]()
[![Platform](https://img.shields.io/badge/Platform-Client--Side%20Local--First-orange?style=flat)]()

> **Live Production Demo**: [https://olyxmintabansos-byte.github.io/datapulse-ai/](https://olyxmintabansos-byte.github.io/datapulse-ai/)

---

## ⚡ Overview

**DataPulse AI** adalah platform analitik e-commerce berbasis kecerdasan buatan (*predictive analytics*) untuk mengoptimalkan omset, mencegah kerugian akibat *deadstock*, memprediksi *customer churn*, dan menerapkan dynamic pricing otomatis.

Aplikasi ini dibangun dengan paradigma **Zero-Dependency High-Performance Client-Side**, memanfaatkan rendering Canvas 2D terakselerasi hardware, tema adaptif Dark/Light mode tersinkronisasi `localStorage`, dan simulasi ROI real-time.

---

## ✨ Fitur Utama

- 🌌 **Reactive Particle Mesh Engine**: Latar belakang partikel Canvas interaktif dengan deteksi kursor mouse (gaya tolak repulsi + garis dinamis), adaptif terhadap Retina / HiDPI display.
- 📈 **Dynamic Live Revenue Chart**: Visualisasi bar chart animasi pada canvas 2D yang responsif dan sinkron dengan tema aktif (Dark / Light mode).
- 🧮 **Interactive 3-Slider ROI Calculator**: Kalkulasi estimasi penghematan deadstock, efisiensi margin harga, dan retensi pelanggan secara real-time.
- 🌓 **Persistent Theme Engine**: Toggle Dark / Light mode dengan penyimpanan otomatis ke `localStorage` dan auto-detect preferensi sistem (`prefers-color-scheme`).
- 💬 **Testimonial Carousel**: Slider otomatis dengan kontrol dot dinamis, swipe/pause on hover, dan auto-realign saat resize window.
- 📱 **Fully Responsive UI (320px – 2560px)**: Tampilan mobile-first dengan hamburger drawer menu yang mulus.
- 🛡️ **Zero QuerySelector DOM Crashes**: Pengamanan routing navigasi anchor dan bypass Jekyll (`.nojekyll`) untuk deployment GitHub Pages.

---

## 🛠️ Tech Stack & Architecture

- **Core**: Semantic HTML5, CSS3 Modern (Custom Variables, Flexbox, CSS Grid, Glassmorphism Backdrop Filter).
- **Scripting**: Pure Vanilla JavaScript (Zero External NPM Runtime Dependencies).
- **Graphics**: HTML5 Canvas 2D Context API (`requestAnimationFrame`, DPR scaling).
- **Hosting**: GitHub Pages Static Hosting via root `/` with `.nojekyll`.

---

## 🚀 Menjalankan Secara Lokal

Cukup clone repository dan buka `index.html` langsung di browser favorit Anda:

```bash
git clone https://github.com/olyxmintabansos-byte/datapulse-ai.git
cd datapulse-ai
# Buka di Windows
start index.html
# Buka di macOS
open index.html
# Buka di Linux
xdg-open index.html
```

---

## 👤 Author & Maintainer

* **Developer:** [olyxmintabansos-byte](https://github.com/olyxmintabansos-byte)
* **Portfolio Launcher:** [Olyx Project Portal](https://olyxmintabansos-byte.github.io/olyx-project-hub/)
