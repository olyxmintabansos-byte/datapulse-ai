'use client';

import { useState } from 'react';
import {
  Package,
  AlertTriangle,
  RefreshCw,
  Zap,
  Filter,
  CheckCircle,
  Tag,
  Truck
} from 'lucide-react';
import { storePresets, formatRupiah, Product } from '@/lib/data';

export default function InventoryRiskPage() {
  const [products, setProducts] = useState<Product[]>(storePresets[0].products);
  const [filter, setFilter] = useState<'all' | 'high-deadstock' | 'reorder-urgent' | 'optimal'>('all');
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const filtered = products.filter(p => {
    if (filter === 'all') return true;
    return p.riskLevel === filter;
  });

  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3000);
  };

  const handleAction = (sku: string, actionType: 'bundle' | 'discount' | 'reorder') => {
    const product = products.find(p => p.sku === sku);
    if (!product) return;

    if (actionType === 'bundle') {
      showToast(`Bundling dibuat: [${sku}] ${product.name} dipaketkan dengan 2 item terlaris!`);
    } else if (actionType === 'discount') {
      setProducts(prev => prev.map(p => p.sku === sku ? { ...p, price: Math.round(p.price * 0.85) } : p));
      showToast(`Diskon 15% diterapkan ke SKU ${sku}! Harga baru: ${formatRupiah(Math.round(product.price * 0.85))}`);
    } else if (actionType === 'reorder') {
      setProducts(prev => prev.map(p => p.sku === sku ? { ...p, stock: p.stock + 100, daysOfSupply: 30, riskLevel: 'optimal' } : p));
      showToast(`Draft Purchase Order dikirim ke Supplier untuk SKU ${sku} (+100 unit)!`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {activeToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white border border-slate-700 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{activeToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deadstock & SKU Risk Matrix</h1>
          <p className="text-sm text-slate-500">
            Deteksi dini barang mengendap (deadstock) dan inventaris yang akan habis dalam rentang 30 hari.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Semua ({products.length})
          </button>
          <button
            onClick={() => setFilter('high-deadstock')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              filter === 'high-deadstock' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            High Deadstock ({products.filter(p => p.riskLevel === 'high-deadstock').length})
          </button>
          <button
            onClick={() => setFilter('reorder-urgent')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              filter === 'reorder-urgent' ? 'bg-rose-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Reorder Urgent ({products.filter(p => p.riskLevel === 'reorder-urgent').length})
          </button>
          <button
            onClick={() => setFilter('optimal')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              filter === 'optimal' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Optimal ({products.filter(p => p.riskLevel === 'optimal').length})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">SKU</th>
                <th className="py-3 px-6">Nama Produk</th>
                <th className="py-3 px-6">Kategori</th>
                <th className="py-3 px-6 text-right">Harga Jual</th>
                <th className="py-3 px-6 text-right">HPP Modal</th>
                <th className="py-3 px-6 text-right">Stok Fisik</th>
                <th className="py-3 px-6 text-right">Terjual 30 Hari</th>
                <th className="py-3 px-6 text-center">Ketahanan Stok</th>
                <th className="py-3 px-6 text-center">Status Risk</th>
                <th className="py-3 px-6 text-center">Aksi Cerdas AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.map(p => (
                <tr key={p.sku} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{p.sku}</td>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 max-w-xs">{p.name}</td>
                  <td className="py-4 px-6 text-slate-500">{p.category}</td>
                  <td className="py-4 px-6 text-right font-medium">{formatRupiah(p.price)}</td>
                  <td className="py-4 px-6 text-right text-slate-400">{formatRupiah(p.cost)}</td>
                  <td className="py-4 px-6 text-right font-bold">{p.stock.toLocaleString('id-ID')} unit</td>
                  <td className="py-4 px-6 text-right">{p.sold30d.toLocaleString('id-ID')} unit</td>
                  <td className="py-4 px-6 text-center font-medium">{p.daysOfSupply} hari</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      p.riskLevel === 'high-deadstock'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                        : p.riskLevel === 'reorder-urgent'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    }`}>
                      {p.riskLevel === 'high-deadstock' ? 'High Deadstock' : p.riskLevel === 'reorder-urgent' ? 'Reorder Urgent' : 'Optimal'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {p.riskLevel === 'high-deadstock' && (
                        <>
                          <button
                            onClick={() => handleAction(p.sku, 'bundle')}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
                            title="Paketkan dengan item terlaris"
                          >
                            <Zap className="w-3 h-3" /> Auto-Bundle
                          </button>
                          <button
                            onClick={() => handleAction(p.sku, 'discount')}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
                            title="Terapkan Diskon 15%"
                          >
                            <Tag className="w-3 h-3" /> -15%
                          </button>
                        </>
                      )}
                      {p.riskLevel === 'reorder-urgent' && (
                        <button
                          onClick={() => handleAction(p.sku, 'reorder')}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
                        >
                          <Truck className="w-3 h-3" /> Reorder PO
                        </button>
                      )}
                      {p.riskLevel === 'optimal' && (
                        <span className="text-[10px] text-slate-400 italic">No Action Needed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
