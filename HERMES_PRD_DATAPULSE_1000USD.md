# 🚀 MASTER SYSTEM SPECIFICATION & DIRECTIVE FOR HERMES
## Project: DataPulse AI — $1,000 Enterprise E-Commerce Predictive Analytics Suite
**Target Framework:** Next.js 15 (App Router), TypeScript (Strict), Tailwind CSS v4, Lucide React, Recharts, Framer Motion  
**Deployment Target:** GitHub Pages Static Export (`out/`, `.nojekyll`, `basePath: '/datapulse-ai'`)  
**Architecture:** 100% Client-Side, Local-First (LocalStorage + Zustand/Context), Zero Backend Dependency  

---

### 1. 🎯 MISSION OBJECTIVE
Transformasikan landing page statis DataPulse AI ($100 MVP) menjadi **Enterprise-Grade SaaS Web Application Suite bernilai $1,000 USD**. Bukan hanya sekadar landing page pemasaran, tetapi sebuah **Full-Featured Interactive Live SaaS Sandbox & Command Center** yang dapat dicoba langsung oleh klien, investor, dan pemilik toko e-commerce tanpa perlu login backend.

---

### 2. 🏛️ ENTERPRISE ARCHITECTURE & TECH STACK STANDARDS
1. **Core Framework**: Next.js 15 with App Router (`src/app`), React 19.
2. **Type Safety**: TypeScript Strict mode (`noImplicitAny: true`, zero `any` types).
3. **Styling Engine**: Tailwind CSS v4 (`@import "tailwindcss";` di `src/app/globals.css`, zero deprecated config).
4. **Data Visualization**: Recharts (ComposedChart, AreaChart, BarChart, ResponsiveContainer).
5. **Animation & Interaction**: Framer Motion (layout transitions, smooth entrance, modal springs) + Canvas 2D Particles.
6. **State Management**: Local-First with Zustand / React Context terikat ke `localStorage` (data toko tersimpan di browser user).
7. **Static Export Specs**:
   - `next.config.ts`: `output: 'export'`, `basePath: '/datapulse-ai'`, `images: { unoptimized: true }`.
   - Wajib generate `public/.nojekyll` dan `out/.nojekyll`.

---

### 3. 📦 VALUE BREAKDOWN ($1,000 USD SPECIFICATION)

#### A. Interactive Live SaaS Command Center (Value: $400)
User bisa berpindah dari "Landing Page Mode" ke "Live Demo Dashboard" secara instan:
1. **Real-Time Revenue & Order Stream Simulator**:
   - Ticker transaksi masuk secara berkala (simulasi webhook Tokopedia, Shopify, Shopee).
   - Kontrol simulator: `Play`, `Pause`, `Speed (1x/2x/5x)`, dan `Reset Seed`.
2. **Interactive Dynamic Pricing Sandbox**:
   - Slider elastisitas harga per kategori produk.
   - Grafik real-time interaktif memperlihatkan pergeseran kurva supply/demand, estimasi lonjakan margin vs risiko penurunan volume order.
3. **Deadstock & Inventory Predictive Matrix**:
   - Tabel SKU interaktif (filter: *High Risk Deadstock*, *Reorder Urgent*, *Optimal*).
   - AI Recommendation Action: Tombol "Auto-Bundle", "Discount 15%", "Supplier Reorder Trigger" dengan feedback interaktif.
4. **Customer Churn Radar & RFM Matrix**:
   - Visualisasi kuadran pelanggan (*Champions*, *At Risk*, *Lost*, *Loyal*).
   - Filter cohort dan simulasi kampanye re-engagement WhatsApp dengan kalkulasi recovery rate otomatis.

#### B. User Data Sandbox & Audit Tool (Value: $250)
1. **Custom CSV/JSON Importer**:
   - User dapat meng-upload file CSV riwayat transaksi mereka sendiri atau menggunakan 3 preset data enterprise: (1) Toko Fashion 5.000 SKU, (2) Gadget Store High-Ticket, (3) Skincare FMCG High-Velocity.
   - Parsing otomatis di sisi browser menggunakan Web Worker/FileReader tanpa dikirim ke server (100% privacy-safe).
2. **Instant Executive Audit Report Generator**:
   - Tombol "Export Executive PDF / Print Report" yang menghasilkan ringkasan audit toko lengkap dengan skor kesehatan inventaris, margin loss, dan rekomendasi aksi strategis.

#### C. Enterprise UX & Micro-Interactions (Value: $200)
1. **Command Palette (`Ctrl+K` / `Cmd+K`)**:
   - Navigasi instan ke fitur, pencarian SKU, beralih preset toko, atau ubah tema dengan keyboard shortcut.
2. **Interactive ROI Calculator v2**:
   - 5 parameter slider fleksibel (Omset, SKU, Margin rata-rata, Return rate, Biaya gudang) dengan kalkulasi proyeksi keuntungan 12 bulan dan breakdown penghematan modal.
3. **Fluid Theme Switcher & Audio-Visual Micro-Interactions**:
   - Dark Glassmorphism + Clean Crisp Light Mode dengan transisi tanpa glitch.
   - Partikel background berbasis Canvas dengan interaksi gravitasi kursor mouse adaptif.

#### D. Production Readiness & Code Quality (Value: $150)
- Modular component tree (`src/components/landing`, `src/components/dashboard`, `src/components/ui`).
- Zero console warnings, zero TypeScript lint errors, lolos `npm run build`.

---

### 4. 📂 TARGET DIRECTORY STRUCTURE
```text
datapulse-ai/
├── public/
│   └── .nojekyll
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── ChurnRadar.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── DataImporterModal.tsx
│   │   │   ├── InventoryMatrix.tsx
│   │   │   ├── LiveTransactionFeed.tsx
│   │   │   ├── PricingSandbox.tsx
│   │   │   └── RevenueChart.tsx
│   │   ├── landing/
│   │   │   ├── CTABanner.tsx
│   │   │   ├── FeaturesGrid.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PricingPlans.tsx
│   │   │   ├── ROICalculator.tsx
│   │   │   └── TestimonialsCarousel.tsx
│   │   └── ui/
│   │       ├── CommandPalette.tsx
│   │       ├── Modal.tsx
│   │       └── ParticleCanvas.tsx
│   ├── data/
│   │   └── mockStorePresets.ts
│   └── types/
│       └── ecommerce.ts
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

### 5. ⚡ EXECUTION RULES FOR HERMES
1. **No Truncation**: Tulis kode 100% lengkap tanpa komentar `// ... rest of code`.
2. **Build Verification**: Selalu jalankan `npm run build` sebelum menyelesaikan tugas untuk memastikan static export `out/` berhasil dibuat tanpa error.
3. **Auto GitHub Push**: Setelah build sukses, commit dan push ke remote `origin main` untuk update GitHub Pages secara live.
