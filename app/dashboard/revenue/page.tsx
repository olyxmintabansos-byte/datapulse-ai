'use client';

import { useState, useEffect, useRef } from 'react';
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
import {
  storePresets,
  generateTransaction,
  Transaction,
  formatRupiah
} from '@/lib/data';

export default function RevenueFeedPage() {
  const currentProducts = storePresets[0].products;

  // Simulator controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(142500000);
  const [totalOrders, setTotalOrders] = useState<number>(432);

  // Inisialisasi awal 6 transaksi
  useEffect(() => {
    const initial: Transaction[] = [];
    for (let i = 0; i < 8; i++) {
      initial.push(generateTransaction(currentProducts));
    }
    setTransactions(initial);
  }, []);

  // Interval Simulator
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(1000 / speed, 300);
    const interval = setInterval(() => {
      const newTx = generateTransaction(currentProducts);
      setTransactions(prev => [newTx, ...prev.slice(0, 29)]); // keep max 30 items
      setTotalRevenue(prev => prev + newTx.total);
      setTotalOrders(prev => prev + 1);
    }, intervalMs * 2);

    return () => clearInterval(interval);
  }, [isPlaying, speed, currentProducts]);

  const handleReset = () => {
    setTransactions([]);
    setTotalRevenue(0);
    setTotalOrders(0);
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Live Transaction Stream Simulator</h1>
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-emerald-400' : 'bg-slate-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Simulasi live webhook order masuk dari platform Tokopedia, Shopee, & Shopify secara real-time.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause Feed' : 'Start Feed'}
          </button>

          <div className="flex items-center border-l border-r border-slate-200 dark:border-slate-800 px-2 gap-1">
            {[1, 2, 5].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                  speed === s
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 text-slate-500 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stream Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Live Total Omset</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{formatRupiah(totalRevenue)}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-500 animate-pulse" /> Terus bertambah real-time
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Pesanan Masuk</div>
          <div className="text-2xl font-black">{totalOrders.toLocaleString('id-ID')} Pesanan</div>
          <div className="text-xs text-slate-400 mt-1">Kecepatan streaming: {speed}x kecepatan normal</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Rata-Rata Nilai Keranjang (AOV)</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {totalOrders > 0 ? formatRupiah(Math.round(totalRevenue / totalOrders)) : 'Rp 0'}
          </div>
          <div className="text-xs text-slate-400 mt-1">Estimasi margin kotor: 42.5%</div>
        </div>
      </div>

      {/* Live Transaction Table Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold">Incoming Order Log Feed</h3>
          </div>
          <span className="text-xs text-slate-500">Menampilkan 30 transaksi terbaru</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Waktu</th>
                <th className="py-3 px-6">Platform</th>
                <th className="py-3 px-6">Pelanggan</th>
                <th className="py-3 px-6">Item Produk</th>
                <th className="py-3 px-6 text-right">Qty</th>
                <th className="py-3 px-6 text-right">Total Transaksi</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Tidak ada transaksi. Klik &quot;Start Feed&quot; untuk memulai simulasi.
                  </td>
                </tr>
              ) : (
                transactions.map((tx, idx) => (
                  <tr
                    key={tx.id + idx}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      idx === 0 ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-6 text-slate-500 whitespace-nowrap">
                      {new Date(tx.timestamp).toLocaleTimeString('id-ID')}
                    </td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.platform === 'Shopify'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                          : tx.platform === 'Tokopedia'
                          ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400'
                      }`}>
                        {tx.platform}
                      </span>
                    </td>
                    <td className="py-3 px-6 font-medium whitespace-nowrap">{tx.customerName}</td>
                    <td className="py-3 px-6 max-w-xs truncate">{tx.product}</td>
                    <td className="py-3 px-6 text-right font-semibold">{tx.quantity}x</td>
                    <td className="py-3 px-6 text-right font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {formatRupiah(tx.total)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        tx.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
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
