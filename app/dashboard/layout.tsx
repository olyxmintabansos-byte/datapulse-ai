'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  BarChart3,
  Home,
  Upload,
  Moon,
  Sun,
  Command as CommandIcon,
  Store,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { storePresets, parseCSVToProducts, StorePreset } from '@/lib/data';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // State Preset Toko aktif
  const [activePreset, setActivePreset] = useState<StorePreset>(storePresets[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: BarChart3 },
    { href: '/dashboard/revenue', label: 'Live Revenue Feed', icon: TrendingUp },
    { href: '/dashboard/pricing', label: 'Dynamic Pricing', icon: DollarSign },
    { href: '/dashboard/inventory', label: 'Deadstock Matrix', icon: Package },
    { href: '/dashboard/customers', label: 'Customer Radar', icon: Users },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const customProducts = parseCSVToProducts(text);
          if (customProducts.length > 0) {
            const customPreset: StorePreset = {
              id: 'custom',
              name: file.name.replace('.csv', ''),
              type: 'Uploaded CSV',
              products: customProducts,
              customers: storePresets[0].customers, // fallback customers
            };
            setActivePreset(customPreset);
            setUploadModalOpen(false);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed inset-y-0 z-30">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DataPulse AI
            </span>
          </Link>
        </div>

        {/* Store Preset Selector Dropdown */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-indigo-500 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-indigo-500" />
              <div>
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">{activePreset.name}</div>
                <div className="text-[10px] text-slate-500">{activePreset.type}</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2">
              <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase">Pilih Toko Demo</div>
              {storePresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setActivePreset(preset);
                    setDropdownOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-lg text-left text-xs flex items-center justify-between transition-colors ${
                    activePreset.id === preset.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{preset.name}</span>
                  <span className="text-[10px] text-slate-400">{preset.type}</span>
                </button>
              ))}
              <div className="border-t border-slate-200 dark:border-slate-800 mt-2 pt-2">
                <button
                  onClick={() => {
                    setUploadModalOpen(true);
                    setDropdownOpen(false);
                  }}
                  className="w-full p-2.5 rounded-lg text-left text-xs flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-semibold"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload CSV Toko Sendiri
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <Home className="w-4 h-4" /> Kembali ke Landing Page
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <kbd className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-500">
              <CommandIcon className="w-3.5 h-3.5" /> K untuk Pencarian
            </kbd>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Upload className="w-4 h-4 text-indigo-500" /> Import CSV
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>

      {/* CSV Upload Modal */}
      {uploadModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setUploadModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Import CSV Toko Sendiri</h3>
            <p className="text-sm text-slate-500 mb-6">
              Data diproses 100% lokal di browser Anda. Tidak ada data yang dikirim ke server luar.
            </p>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors mb-4">
              <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <label className="cursor-pointer font-semibold text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                Pilih file CSV dari komputer
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>
              <p className="text-xs text-slate-400 mt-2">Format kolom: sku, name, price, cost, stock, sold30d</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
