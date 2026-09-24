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
  Truck,
  Plus,
  Trash2,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { formatRupiah, Product } from '@/lib/data';
import { useStore } from '@/context/StoreContext';

export default function InventoryRiskPage() {
  const {
    products,
    currentStore,
    addProduct,
    updateProduct,
    deleteProduct,
    triggerCelebration,
    downloadSampleCSV
  } = useStore();

  const [filter, setFilter] = useState<'all' | 'high-deadstock' | 'reorder-urgent' | 'optimal'>('all');
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form State for New Product
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newPrice, setNewPrice] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newSold, setNewSold] = useState('');

  const filtered = products.filter(p => {
    if (filter === 'all') return true;
    return p.riskLevel === filter;
  });

  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3500);
  };

  const handleAction = (sku: string, actionType: 'bundle' | 'discount' | 'reorder') => {
    const product = products.find(p => p.sku === sku);
    if (!product) return;

    if (actionType === 'bundle') {
      showToast(`Bundling aktif: [${sku}] ${product.name} dipaketkan dengan item terlaris!`);
      triggerCelebration();
    } else if (actionType === 'discount') {
      const discountedPrice = Math.round(product.price * 0.85);
      updateProduct(product.id, { price: discountedPrice });
      showToast(`Diskon 15% disimpan permanen untuk ${sku}: ${formatRupiah(discountedPrice)}!`);
      triggerCelebration();
    } else if (actionType === 'reorder') {
      updateProduct(product.id, { stock: product.stock + 100 });
      showToast(`Purchase Order dibuat untuk ${sku}! Stok bertambah +100 unit tersimpan.`);
      triggerCelebration();
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku || !newName) return;

    addProduct({
      sku: newSku.trim().toUpperCase(),
      name: newName.trim(),
      category: newCategory.trim() || 'General',
      price: parseFloat(newPrice) || 0,
      cost: parseFloat(newCost) || 0,
      stock: parseInt(newStock, 10) || 0,
      sold30d: parseInt(newSold, 10) || 0
    });

    showToast(`Produk baru [${newSku}] ${newName} berhasil ditambahkan ke katalog!`);
    setAddModalOpen(false);

    // Reset Form
    setNewSku('');
    setNewName('');
    setNewPrice('');
    setNewCost('');
    setNewStock('');
    setNewSold('');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus produk "${name}" dari inventaris?`)) {
      deleteProduct(id);
      showToast(`Produk "${name}" telah dihapus.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {activeToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white border border-slate-700 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{activeToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Deadstock & SKU Risk Matrix</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              {currentStore.name}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Deteksi dini barang mengendap (deadstock) dan inventaris yang akan habis dalam rentang 30 hari.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah SKU Baru
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Semua ({products.length})
        </button>
        <button
          onClick={() => setFilter('high-deadstock')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            filter === 'high-deadstock' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          High Deadstock ({products.filter(p => p.riskLevel === 'high-deadstock').length})
        </button>
        <button
          onClick={() => setFilter('reorder-urgent')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            filter === 'reorder-urgent' ? 'bg-rose-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Reorder Urgent ({products.filter(p => p.riskLevel === 'reorder-urgent').length})
        </button>
        <button
          onClick={() => setFilter('optimal')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            filter === 'optimal' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Optimal ({products.filter(p => p.riskLevel === 'optimal').length})
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <Package className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold">Katalog Produk Masih Kosong</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tambahkan produk pertama Anda secara manual atau import file CSV langsung dari komputer.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setAddModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
              >
                + Tambah SKU Pertama
              </button>
              <button
                onClick={downloadSampleCSV}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl"
              >
                Download Template CSV
              </button>
            </div>
          </div>
        ) : (
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
                  <th className="py-3 px-4 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filtered.map(p => (
                  <tr key={p.id || p.sku} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{p.sku}</td>
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 max-w-xs">{p.name}</td>
                    <td className="py-4 px-6 text-slate-500">{p.category}</td>
                    <td className="py-4 px-6 text-right font-medium">{formatRupiah(p.price)}</td>
                    <td className="py-4 px-6 text-right text-slate-400">{formatRupiah(p.cost)}</td>
                    <td className="py-4 px-6 text-right font-bold">{p.stock.toLocaleString('id-ID')} unit</td>
                    <td className="py-4 px-6 text-right">{p.sold30d.toLocaleString('id-ID')} unit</td>
                    <td className="py-4 px-6 text-center font-medium">
                      {p.daysOfSupply >= 9999 ? '∞ (0 Penjualan)' : `${p.daysOfSupply} hari`}
                    </td>
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
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                              title="Paketkan dengan item terlaris"
                            >
                              <Zap className="w-3 h-3" /> Auto-Bundle
                            </button>
                            <button
                              onClick={() => handleAction(p.sku, 'discount')}
                              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                              title="Terapkan Diskon 15% Permanen"
                            >
                              <Tag className="w-3 h-3" /> -15%
                            </button>
                          </>
                        )}
                        {p.riskLevel === 'reorder-urgent' && (
                          <button
                            onClick={() => handleAction(p.sku, 'reorder')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            title="Generate Purchase Order Supplier"
                          >
                            <Truck className="w-3 h-3" /> Reorder PO (+100)
                          </button>
                        )}
                        {p.riskLevel === 'optimal' && (
                          <span className="text-[10px] text-slate-400 italic">No Action Needed</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                        title="Hapus SKU"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add SKU Modal */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Tambah SKU Baru</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Kode SKU</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: FSH-011"
                  value={newSku}
                  onChange={e => setNewSku(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jaket Kulit Biker Premium"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Kategori</label>
                  <input
                    type="text"
                    placeholder="Outerwear"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Stok Fisik</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={newStock}
                    onChange={e => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="299000"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">HPP Modal (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="150000"
                    value={newCost}
                    onChange={e => setNewCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Perkiraan Terjual / 30 Hari</label>
                <input
                  type="number"
                  placeholder="30"
                  value={newSold}
                  onChange={e => setNewSold(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
