'use client';

import { useMemo } from 'react';
import {
  TrendingUp,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Download,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatRupiah, formatCompact } from '@/lib/data';
import { useStore } from '@/context/StoreContext';

export default function DashboardOverview() {
  const { currentStore, products, customers, exportAuditReport } = useStore();

  // Compute Real Metrics Dynamically from Store
  const metrics = useMemo(() => {
    const totalRevenue30d = products.reduce((acc, p) => acc + (p.price * p.sold30d), 0);
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.cost * p.stock), 0);
    const deadstockProducts = products.filter(p => p.riskLevel === 'high-deadstock');
    const deadstockValue = deadstockProducts.reduce((acc, p) => acc + (p.cost * p.stock), 0);
    const urgentReorders = products.filter(p => p.riskLevel === 'reorder-urgent');
    const atRiskCustomers = customers.filter(c => c.segment === 'at-risk' || c.segment === 'lost');

    return {
      revenue30d: totalRevenue30d,
      inventoryValue: totalInventoryValue,
      deadstockValue,
      deadstockCount: deadstockProducts.length,
      deadstockNames: deadstockProducts.slice(0, 2).map(p => p.name).join(' & ') || 'Tidak ada',
      urgentCount: urgentReorders.length,
      urgentNames: urgentReorders.slice(0, 2).map(p => p.name).join(' & ') || 'Semua aman',
      churnCount: atRiskCustomers.length,
    };
  }, [products, customers]);

  // Dynamic 7-day trend simulated around actual revenue
  const trendData = useMemo(() => {
    const baseDaily = Math.max(1000000, metrics.revenue30d / 30);
    const multipliers = [0.85, 0.95, 0.9, 1.15, 1.45, 1.8, 1.6];
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    return days.map((day, idx) => {
      const omset = Math.round(baseDaily * multipliers[idx]);
      const profit = Math.round(omset * 0.38);
      return { day, omset, profit };
    });
  }, [metrics.revenue30d]);

  return (
    <div className="space-y-8 print:p-0">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Executive Dashboard Overview</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800">
              {currentStore.name}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Analitik kesehatan performa penjualan, risiko deadstock, dan sinyal churn toko Anda secara realtime.
          </p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={exportAuditReport}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Export Executive Audit PDF / Print
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Proyeksi Omset (30 Hari)"
          value={formatRupiah(metrics.revenue30d)}
          change="+18.4%"
          isPositive={true}
          description="Berdasarkan laju penjualan aktif"
        />
        <KpiCard
          title="Nilai Deadstock Terikat"
          value={formatRupiah(metrics.deadstockValue)}
          change={`${metrics.deadstockCount} SKU`}
          isPositive={metrics.deadstockCount === 0}
          description="Stok macet > 90 hari penjualan"
        />
        <KpiCard
          title="Pelanggan Berisiko Churn"
          value={`${metrics.churnCount} Klien`}
          change="At-Risk"
          isPositive={metrics.churnCount === 0}
          description="Perlu voucher win-back segera"
        />
        <KpiCard
          title="SKU Butuh Reorder Cepat"
          value={`${metrics.urgentCount} SKU`}
          change="Urgent"
          isPositive={metrics.urgentCount === 0}
          description="Stok menipis < 5 hari penjualan"
        />
      </div>

      {/* Revenue & Profit Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold">Tren Revenue & Profit (7 Hari)</h3>
              <p className="text-xs text-slate-500">Estimasi margin kotor vs keuntungan bersih untuk {currentStore.name}</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              Avg Margin: ~38%
            </span>
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
            <p className="text-xs text-slate-500 mb-4">Aksi otomatis yang siap dieksekusi untuk {currentStore.name}</p>

            <div className="space-y-3">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl">
                <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400 mb-1">
                  <span>Reorder Mendesak</span>
                  <span>{metrics.urgentCount} SKU</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {metrics.urgentCount > 0 ? `Stok ${metrics.urgentNames} tersisa kritis < 5 hari penjualan.` : 'Semua stok dalam rentang aman.'}
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl">
                <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                  <span>Deadstock Clearance</span>
                  <span>{formatRupiah(metrics.deadstockValue)} Terikat</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {metrics.deadstockCount > 0 ? `${metrics.deadstockNames} menumpuk. Rekomendasi: Pasang bundling diskon.` : 'Tidak ada deadstock kritis terdeteksi.'}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                  <span>Win-back Campaign</span>
                  <span>{metrics.churnCount} Klien Berisiko</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Kirimkan kode voucher diskon via WhatsApp untuk mengaktifkan kembali pembeli.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-medium">DataPulse Engine v2.4 • Sinkronisasi LocalStorage Otomatis</span>
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
