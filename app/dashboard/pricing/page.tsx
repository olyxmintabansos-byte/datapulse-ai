'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Sliders,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { storePresets, formatRupiah, Product } from '@/lib/data';

export default function DynamicPricingPage() {
  const products = storePresets[0].products;
  const [selectedSku, setSelectedSku] = useState<string>(products[0].sku);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(10); // -30% to +50%
  const [elasticity, setElasticity] = useState<number>(1.2); // 0.5 (inelastic) to 2.5 (elastic)

  const currentProduct = products.find(p => p.sku === selectedSku) || products[0];

  // Hitung simulasi titik harga saat ini
  const originalPrice = currentProduct.price;
  const unitCost = currentProduct.cost;
  const baseVolume = currentProduct.sold30d;

  const newPrice = Math.round(originalPrice * (1 + priceChangePercent / 100));
  const newMarginPerUnit = newPrice - unitCost;
  const originalMarginPerUnit = originalPrice - unitCost;

  // Elastisitas: % perubahan volume = - elasticity * % perubahan harga
  const volumeChangePercent = -(elasticity * priceChangePercent);
  const newVolume = Math.max(0, Math.round(baseVolume * (1 + volumeChangePercent / 100)));

  const originalTotalProfit = originalMarginPerUnit * baseVolume;
  const newTotalProfit = newMarginPerUnit * newVolume;
  const profitDifference = newTotalProfit - originalTotalProfit;

  // Generate kurva simulasi untuk Recharts (-30% sd +50%)
  const simulationCurve = [];
  for (let delta = -30; delta <= 50; delta += 5) {
    const simPrice = Math.round(originalPrice * (1 + delta / 100));
    const simMargin = simPrice - unitCost;
    const simVolChange = -(elasticity * delta);
    const simVol = Math.max(0, Math.round(baseVolume * (1 + simVolChange / 100)));
    const simProfit = simMargin * simVol;
    simulationCurve.push({
      delta: `${delta > 0 ? '+' : ''}${delta}%`,
      price: simPrice,
      volume: simVol,
      totalProfit: simProfit,
    });
  }

  // Temukan titik optimal dalam kurva
  const optimalPoint = [...simulationCurve].sort((a, b) => b.totalProfit - a.totalProfit)[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dynamic Pricing & Elasticity Sandbox</h1>
        <p className="text-sm text-slate-500">
          Uji sensitivitas harga SKU terhadap penurunan volume pesanan dan temukan titik laba maksimal.
        </p>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product & Parameter Sliders */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Pilih SKU Produk Target
            </label>
            <select
              value={selectedSku}
              onChange={e => setSelectedSku(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              {products.map(p => (
                <option key={p.sku} value={p.sku}>
                  [{p.sku}] {p.name} — {formatRupiah(p.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Slider 1: Penyesuaian Harga */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-slate-500 uppercase tracking-wider">Simulasi Perubahan Harga</span>
              <span className={`text-sm ${priceChangePercent >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-500'}`}>
                {priceChangePercent > 0 ? `+${priceChangePercent}%` : `${priceChangePercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="5"
              value={priceChangePercent}
              onChange={e => setPriceChangePercent(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>-30% Diskon</span>
              <span>Harga Normal (0%)</span>
              <span>+50% Mark-up</span>
            </div>
          </div>

          {/* Slider 2: Koefisien Elastisitas */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-slate-500 uppercase tracking-wider">Sensitivitas Pasar (Elastisitas)</span>
              <span className="text-sm text-slate-900 dark:text-slate-100">{elasticity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={elasticity}
              onChange={e => setElasticity(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Inelastis (Brand Kuat)</span>
              <span>Sensitif (Kompetitif)</span>
            </div>
          </div>

          {/* Live Price Preview Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Harga Jual Baru:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{formatRupiah(newPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Modal / HPP:</span>
              <span className="font-medium text-slate-500">{formatRupiah(unitCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Margin Per Unit:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(newMarginPerUnit)} ({Math.round((newMarginPerUnit / newPrice) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Profit Curve Chart */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold">Kurva Optimasi Total Profit vs Delta Harga</h3>
              <p className="text-xs text-slate-500">Puncak kurva menunjukkan harga dengan perolehan margin bersih terbesar</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Rekomendasi AI: {optimalPoint.delta}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulationCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="delta" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => formatRupiah(v)} />
                <Tooltip
                  formatter={(val: any) => formatRupiah(Number(val))}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="totalProfit"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366f1' }}
                  name="Total Estimasi Profit Bersih"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Outcome Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Estimasi Volume Terjual</div>
              <div className="text-xl font-bold mt-1">{newVolume} Unit</div>
              <div className="text-[11px] text-slate-400">vs {baseVolume} unit sebelumnya</div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Total Profit Bulanan</div>
              <div className="text-xl font-bold mt-1">{formatRupiah(newTotalProfit)}</div>
              <div className="text-[11px] text-slate-400">vs {formatRupiah(originalTotalProfit)}</div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Dampak Laba Bersih</div>
              <div className={`text-xl font-bold mt-1 ${profitDifference >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                {profitDifference >= 0 ? `+${formatRupiah(profitDifference)}` : formatRupiah(profitDifference)}
              </div>
              <div className="text-[11px] text-slate-400">Potensi keuntungan tambahan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
