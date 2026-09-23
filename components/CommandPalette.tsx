'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, TrendingUp, Package, Users, DollarSign, BarChart3, Home } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const commands: Command[] = [
    { id: 'home', label: 'Beranda Landing', icon: Home, action: () => router.push('/') },
    { id: 'dashboard', label: 'Buka Dashboard', icon: BarChart3, action: () => router.push('/dashboard') },
    { id: 'revenue', label: 'Live Revenue Stream', icon: TrendingUp, action: () => router.push('/dashboard/revenue') },
    { id: 'pricing', label: 'Dynamic Pricing', icon: DollarSign, action: () => router.push('/dashboard/pricing') },
    { id: 'inventory', label: 'Deadstock & SKU Risk', icon: Package, action: () => router.push('/dashboard/inventory') },
    { id: 'customers', label: 'Customer Churn Radar', icon: Users, action: () => router.push('/dashboard/customers') },
  ];

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari fitur atau navigasi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            autoFocus
          />
          <kbd className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-600">
            ESC
          </kbd>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              Tidak ada hasil untuk &quot;{search}&quot;
            </div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onOpenChange(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <Icon className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {cmd.label}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
