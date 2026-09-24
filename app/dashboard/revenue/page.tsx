'use client';

import { useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  ShoppingBag,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { formatRupiah } from '@/lib/data';
import { useStore } from '@/context/StoreContext';

export default function RevenueFeedPage() {
  const {
    transactions,
    isStreaming,
    setIsStreaming,
    streamSpeed,
    setStreamSpeed,
    resetStreamTransactions,
    currentStore
  } = useStore();

  const totalRevenue = useMemo(() => {
    return transactions.reduce((acc, t) => acc + t.total, 0);
  }, [transactions]);

  const totalOrders = transactions.length;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Live Transaction Stream Simulator</h1>
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isStreaming ? 'bg-emerald-400' : 'bg-slate-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isStreaming ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              {currentStore.name}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Simulasi live webhook order masuk dari platform Tokopedia, Shopee, & Shopify secara real-time tersimpan di state lokal.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isStreaming
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isStreaming ? 'Pause Feed' : 'Start Feed'}
          </button>

          <div className="flex items-center border-l border-r border-slate-200 dark:border-slate-800 px-2 gap-1">
            {[1, 2, 5].map(s => (
              <button
                key={s}
                onClick={() => setStreamSpeed(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  streamSpeed === s
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={resetStreamTransactions}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Reset Feed Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Ticker Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Omset Stream Aktif</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{formatRupiah(totalRevenue)}</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Live Syncing dari webhook
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Transaksi Masuk</span>
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalOrders} Pesanan</div>
          <div className="text-xs text-slate-500 mt-1">Kecepatan streaming: {streamSpeed}x</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Rata-rata Nilai Keranjang (AOV)</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{formatRupiah(aov)}</div>
          <div className="text-xs text-slate-500 mt-1">Estimasi keranjang pesanan rata-rata</div>
        </div>
      </div>

      {/* Transaction Feed Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold">Stream Log Pesanan Masuk (Realtime)</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Maksimal 50 riwayat transaksi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">ID Order</th>
                <th className="py-3 px-6">Platform</th>
                <th className="py-3 px-6">Pelanggan</th>
                <th className="py-3 px-6">Item Produk</th>
                <th className="py-3 px-6 text-center">Jumlah</th>
                <th className="py-3 px-6 text-right">Total Transaksi</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Belum ada transaksi stream masuk. Klik "Start Feed" di atas untuk memulai simulasi webhook!
                  </td>
                </tr>
              ) : (
                transactions.map((tx, idx) => (
                  <tr
                    key={tx.id + idx}
                    className={`transition-colors ${
                      idx === 0 ? 'bg-indigo-50/60 dark:bg-indigo-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="py-3.5 px-6 font-mono text-[11px] text-slate-500">#{tx.id}</td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        tx.platform === 'Tokopedia'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                          : tx.platform === 'Shopee'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400'
                      }`}>
                        {tx.platform}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-900 dark:text-slate-100">{tx.customerName}</td>
                    <td className="py-3.5 px-6 max-w-xs truncate text-slate-600 dark:text-slate-400">{tx.product}</td>
                    <td className="py-3.5 px-6 text-center">{tx.quantity} pcs</td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-900 dark:text-slate-100">{formatRupiah(tx.total)}</td>
                    <td className="py-3.5 px-6 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
