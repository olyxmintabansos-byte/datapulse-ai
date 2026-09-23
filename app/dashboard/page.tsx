'use client';

import { useState } from 'react';
import {
  TrendingUp,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Download,
  ShieldCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { storePresets, formatRupiah, formatCompact } from '@/lib/data';

export default function DashboardOverview() {
  const currentStore = storePresets[0]; // default Fashion

  // Mock Trend Data 7 Hari
  const trendData = [
    { day: 'Senin', omset: 38400000, profit: 14200000, orders: 142 },
    { day: 'Selasa', omset: 42100000, profit: 16800000, orders: 156 },
    { day: 'Rabu', omset: 39500000, profit: 15100000, orders: 148 },
    { day: 'Kamis', omset: 51200000, profit: 21400000, orders: 198 },
    { day: 'Jumat', omset: 68900000, profit: 28600000, orders: 265 },
    { day: 'Sabtu', omset: 82400000, profit: 34100000, orders: 310 },
    { day: 'Minggu', omset: 76500000, profit: 31200000, orders: 289 },
  ];

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Executive Dashboard Overview</h1>
          <p className="text-sm text-slate-500">
            Ringkasan kesehatan performa penjualan, risiko deadstock, dan sinyal churn toko Anda.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintAudit}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Printer className="w-4 h-4" /> Export Executive Audit PDF / Print
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Proyeksi Omset"
          value="Rp 284.500.000"
          change="+18.4%"
          isPositive={true}
          description="vs 30 hari sebelumnya"
        />
        <KpiCard
          title="Potensi Hemat Deadstock"
          value="Rp 42.100.000"
          change="3.2x"
          isPositive={true}
          description="Efisiensi biaya gudang AI"
        />
        <KpiCard
          title="Pelanggan Berisiko Churn"
          value="42 Klien"
          change="1.8%"
          isPositive={false}
          description="Perlu kampanye win-back"
        />
        <KpiCard
          title="SKU Butuh Reorder Cepat"
          value="4 Item"
          change="Urgent"
          isPositive={false}
          description="Stok habis < 3 hari"
        />
      </div>

      {/* Revenue & Profit Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold">Tren Revenue & Profit (7 Hari)</h3>
              <p className="text-xs text-slate-500">Korelasi performa omset kotor vs margin keuntungan bersih</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorOmset" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => formatCompact(v)} />
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
                <Area type="monotone" dataKey="omset" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorOmset)" name="Omset Kotor" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" name="Profit Bersih" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Priority Matrix */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-bold">Rekomendasi AI Realtime</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Aksi otomatis yang siap dieksekusi hari ini</p>

            <div className="space-y-3">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl">
                <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400 mb-1">
                  <span>Reorder Mendesak</span>
                  <span>4 SKU</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Stok Celana Jogger & Kemeja Linen tersisa &lt; 48 jam penjualan.
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl">
                <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                  <span>Deadstock Clearance</span>
                  <span>Rp 18.5 Jt Terikat</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Kaos V-Neck & Tank Top tidak terjual optimal &gt; 90 hari. Sarankan Auto-Bundle.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                  <span>Win-back Campaign</span>
                  <span>28 Klien VIP</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Kirim voucher private diskon 15% untuk pelanggan kategori Champions yang mulai inaktif.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-medium">Model AI Confidence: 99.4% • Update 2 Menit Lalu</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, change, isPositive, description }: { title: string; value: string; change: string; isPositive: boolean; description: string }) {
  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</div>
      <div className="text-2xl font-black mb-2">{value}</div>
      <div className="flex items-center gap-2 text-xs">
        <span className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded-md ${
          isPositive
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
        }`}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
          {change}
        </span>
        <span className="text-slate-500">{description}</span>
      </div>
    </div>
  );
}
