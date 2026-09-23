'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, TrendingUp, Package, Users, Zap, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Nav */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DataPulse AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/30"
            >
              Buka Live Sandbox <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8">
          <Zap className="w-4 h-4" />
          Model AI v4.2 — Akurasi Prediksi 99.4%
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
          Maksimalkan Profit<br />
          E-Commerce dengan<br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Prediksi Berbasis AI
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Otomatisasi peramalan inventaris, prediksi churn pelanggan, dan dynamic pricing real-time ke Shopify, Tokopedia, & WooCommerce.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            Coba Dashboard Interaktif <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="px-8 py-4 border-2 border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl font-bold text-lg transition-all">
            Lihat Demo Video
          </button>
        </div>

        {/* Trust Bar */}
        <div className="flex items-center justify-center gap-8 mt-16 opacity-60">
          <span className="font-bold text-sm tracking-wider text-slate-500">SHOPIFY</span>
          <span className="font-bold text-sm tracking-wider text-slate-500">TOKOPEDIA</span>
          <span className="font-bold text-sm tracking-wider text-slate-500">WOOCOMMERCE</span>
          <span className="font-bold text-sm tracking-wider text-slate-500">LAZADA</span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Fitur Tingkat Enterprise</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Dibangun khusus untuk seller skala menengah hingga multi-brand retail.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<TrendingUp className="w-7 h-7" />}
            title="Live Transaction Feed"
            description="Simulasi order masuk realtime dengan kontrol Play/Pause/Speed dari berbagai marketplace."
          />
          <FeatureCard
            icon={<BarChart3 className="w-7 h-7" />}
            title="Dynamic Pricing Engine"
            description="Slider elastisitas harga interaktif dengan visualisasi profit vs volume order real-time."
          />
          <FeatureCard
            icon={<Package className="w-7 h-7" />}
            title="Deadstock & SKU Risk Matrix"
            description="Filter inventaris dengan status risiko + aksi cerdas otomatis (bundle, diskon, reorder)."
          />
          <FeatureCard
            icon={<Users className="w-7 h-7" />}
            title="Customer Churn Radar"
            description="Visualisasi kuadran RFM (Champions, At Risk, Lost) dengan simulasi kampanye recovery."
          />
          <FeatureCard
            icon={<Zap className="w-7 h-7" />}
            title="Local CSV Importer"
            description="Upload data penjualan Anda sendiri (100% lokal di browser) atau pilih preset demo."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-7 h-7" />}
            title="Command Palette (⌘K)"
            description="Power-user UX: navigasi cepat antar fitur dan pencarian SKU dengan keyboard shortcut."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-black mb-4">Siap Mencoba Live Sandbox?</h2>
          <p className="text-lg mb-8 text-indigo-100">
            Tanpa login, tanpa registrasi. Langsung eksplorasi semua fitur enterprise.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            Buka Command Center <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-600 dark:text-slate-400">
          © 2026 DataPulse AI Technologies Inc. Enterprise-Grade SaaS Suite.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-xl hover:-translate-y-1 group">
      <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
