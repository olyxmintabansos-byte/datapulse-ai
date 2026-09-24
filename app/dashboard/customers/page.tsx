'use client';

import { useState } from 'react';
import {
  Users,
  AlertCircle,
  Mail,
  Send,
  Award,
  UserCheck,
  UserX,
  UserPlus,
  CheckCircle2,
  MessageCircle,
  Copy
} from 'lucide-react';
import { formatRupiah, Customer } from '@/lib/data';
import { useStore } from '@/context/StoreContext';

export default function CustomerRadarPage() {
  const { customers, currentStore, sendWinbackVoucher, triggerCelebration } = useStore();

  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [campaignModalOpen, setCampaignModalOpen] = useState<boolean>(false);
  const [targetSegment, setTargetSegment] = useState<string>('at-risk');
  const [voucherDiscount, setVoucherDiscount] = useState<number>(15);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filtered = customers.filter(c => {
    if (selectedSegment === 'all') return true;
    return c.segment === selectedSegment;
  });

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLaunchCampaign = () => {
    const targetCustomers = customers.filter(c => c.segment === targetSegment);
    const voucherCode = `WINBACK${voucherDiscount}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    showNotification(
      `Kampanye Win-Back Berhasil! Kupon [${voucherCode}] diskon ${voucherDiscount}% siap dikirim ke ${targetCustomers.length} pelanggan ${targetSegment.toUpperCase()}.`
    );
    triggerCelebration();
    setCampaignModalOpen(false);
  };

  const handleDirectSend = (customer: Customer, channel: 'whatsapp' | 'email' | 'copy') => {
    const voucherCode = `VIP${customer.name.substring(0, 3).toUpperCase()}15`;
    sendWinbackVoucher(customer, voucherCode, 15, channel);
    if (channel === 'copy') {
      showNotification(`Pesan voucher untuk ${customer.name} disalin ke clipboard!`);
    } else {
      showNotification(`Membuka ${channel === 'whatsapp' ? 'WhatsApp' : 'Email'} untuk ${customer.name}...`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white border border-slate-700 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Customer Churn Radar & RFM Quadrant</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              {currentStore.name}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Analisis segmentasi Recency, Frequency, & Monetary (RFM) dengan integrasi langsung WhatsApp & Email win-back.
          </p>
        </div>

        <button
          onClick={() => setCampaignModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" /> Jalankan Kampanye Win-Back AI
        </button>
      </div>

      {/* RFM Quadrant Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <SegmentCard
          title="Champions"
          count={customers.filter(c => c.segment === 'champions').length}
          icon={<Award className="w-4 h-4 text-purple-500" />}
          active={selectedSegment === 'champions'}
          onClick={() => setSelectedSegment('champions')}
        />
        <SegmentCard
          title="Loyal Customers"
          count={customers.filter(c => c.segment === 'loyal').length}
          icon={<UserCheck className="w-4 h-4 text-emerald-500" />}
          active={selectedSegment === 'loyal'}
          onClick={() => setSelectedSegment('loyal')}
        />
        <SegmentCard
          title="At Risk (Warning)"
          count={customers.filter(c => c.segment === 'at-risk').length}
          icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
          active={selectedSegment === 'at-risk'}
          onClick={() => setSelectedSegment('at-risk')}
        />
        <SegmentCard
          title="Lost / Churned"
          count={customers.filter(c => c.segment === 'lost').length}
          icon={<UserX className="w-4 h-4 text-rose-500" />}
          active={selectedSegment === 'lost'}
          onClick={() => setSelectedSegment('lost')}
        />
        <SegmentCard
          title="New Buyers"
          count={customers.filter(c => c.segment === 'new').length}
          icon={<UserPlus className="w-4 h-4 text-blue-500" />}
          active={selectedSegment === 'new'}
          onClick={() => setSelectedSegment('new')}
        />
      </div>

      {/* Customer List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold">Daftar Segmen Pelanggan ({filtered.length})</h3>
          </div>
          {selectedSegment !== 'all' && (
            <button
              onClick={() => setSelectedSegment('all')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
            >
              Reset Filter Segmen
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Nama Pelanggan</th>
                <th className="py-3 px-6">Kontak / Email</th>
                <th className="py-3 px-6 text-right">Total Transaksi</th>
                <th className="py-3 px-6 text-right">Total Belanja</th>
                <th className="py-3 px-6 text-right">AOV</th>
                <th className="py-3 px-6 text-center">Inaktif Sejak</th>
                <th className="py-3 px-6 text-center">Segmen RFM</th>
                <th className="py-3 px-6 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">{c.name}</td>
                  <td className="py-4 px-6 text-slate-500">{c.email}</td>
                  <td className="py-4 px-6 text-right font-bold">{c.totalOrders} order</td>
                  <td className="py-4 px-6 text-right font-bold text-indigo-600 dark:text-indigo-400">{formatRupiah(c.totalSpent)}</td>
                  <td className="py-4 px-6 text-right text-slate-500">{formatRupiah(c.avgOrderValue)}</td>
                  <td className="py-4 px-6 text-center font-medium">{c.lastOrderDays} hari lalu</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      c.segment === 'champions'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400'
                        : c.segment === 'loyal'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                        : c.segment === 'at-risk'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                        : c.segment === 'lost'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400'
                    }`}>
                      {c.segment.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleDirectSend(c, 'whatsapp')}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                        title="Kirim Voucher via WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDirectSend(c, 'email')}
                        className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
                        title="Kirim Voucher via Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDirectSend(c, 'copy')}
                        className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                        title="Salin Pesan Kupon"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Modal */}
      {campaignModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setCampaignModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-bold">Simulasi Kampanye Recovery AI</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Target Segmen Pelanggan
                </label>
                <select
                  value={targetSegment}
                  onChange={e => setTargetSegment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-xs cursor-pointer"
                >
                  <option value="at-risk">At Risk (Potensi Churn)</option>
                  <option value="lost">Lost / Churned (Inaktif &gt; 90 Hari)</option>
                  <option value="champions">Champions (VIP Reward)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nilai Diskon Voucher Email / WA
                </label>
                <div className="flex items-center gap-2">
                  {[10, 15, 20, 25].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVoucherDiscount(v)}
                      className={`flex-1 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
                        voucherDiscount === v
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {v}% OFF
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCampaignModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleLaunchCampaign}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                Kirim Kampanye Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SegmentCard({ title, count, icon, active, onClick }: { title: string; count: number; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
        active
          ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase">{title}</span>
        {icon}
      </div>
      <div className="text-xl font-bold">{count} Pelanggan</div>
    </button>
  );
}
