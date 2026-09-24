'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Product,
  Customer,
  Transaction,
  StorePreset,
  storePresets as defaultPresets,
  parseCSVToProducts,
  generateTransaction,
  formatRupiah
} from '@/lib/data';

interface StoreContextType {
  stores: StorePreset[];
  currentStore: StorePreset;
  currentStoreId: string;
  products: Product[];
  customers: Customer[];
  transactions: Transaction[];
  isStreaming: boolean;
  streamSpeed: number;
  switchStore: (storeId: string) => void;
  createStore: (name: string, type: string) => void;
  deleteStore: (storeId: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'daysOfSupply' | 'riskLevel'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  importCSV: (csvText: string, storeName?: string) => boolean;
  downloadSampleCSV: () => void;
  sendWinbackVoucher: (customer: Customer, voucherCode: string, discount: number, channel: 'whatsapp' | 'email' | 'copy') => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setStreamSpeed: (speed: number) => void;
  resetStreamTransactions: () => void;
  exportAuditReport: () => void;
  resetToDefaults: () => void;
  triggerCelebration: () => void;
}

const STORAGE_STORES_KEY = 'datapulse_stores_v1';
const STORAGE_CURRENT_STORE_KEY = 'datapulse_active_store_v1';
const STORAGE_TRANSACTIONS_KEY = 'datapulse_transactions_v1';

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // 1. Initial State from LocalStorage or Defaults
  const [stores, setStores] = useState<StorePreset[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_STORES_KEY);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.warn('Failed to load stores from localStorage', err);
      }
    }
    return defaultPresets;
  });

  const [currentStoreId, setCurrentStoreId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedId = localStorage.getItem(STORAGE_CURRENT_STORE_KEY);
        if (savedId) return savedId;
      } catch (err) {}
    }
    return defaultPresets[0].id;
  });

  // 2. Transactions Stream State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTx = localStorage.getItem(STORAGE_TRANSACTIONS_KEY);
        if (savedTx) return JSON.parse(savedTx);
      } catch (err) {}
    }
    return [];
  });

  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(1);

  // 3. Save to LocalStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STORES_KEY, JSON.stringify(stores));
    } catch (err) {
      console.warn('Failed to save stores', err);
    }
  }, [stores]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CURRENT_STORE_KEY, currentStoreId);
    } catch (err) {}
  }, [currentStoreId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TRANSACTIONS_KEY, JSON.stringify(transactions.slice(0, 50)));
    } catch (err) {}
  }, [transactions]);

  // Active Store & Derived Data
  const currentStore = useMemo(() => {
    return stores.find(s => s.id === currentStoreId) || stores[0] || defaultPresets[0];
  }, [stores, currentStoreId]);

  const products = currentStore.products;
  const customers = currentStore.customers;

  // Confetti helper
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  // 4. Live Transaction Streamer Effect
  useEffect(() => {
    if (!isStreaming || products.length === 0) return;
    const intervalMs = Math.max(600, 3000 / streamSpeed);

    const interval = setInterval(() => {
      const newTx = generateTransaction(products);
      setTransactions(prev => [newTx, ...prev.slice(0, 49)]);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isStreaming, streamSpeed, products]);

  // 5. Store Switching & Management
  const switchStore = useCallback((storeId: string) => {
    if (stores.some(s => s.id === storeId)) {
      setCurrentStoreId(storeId);
    }
  }, [stores]);

  const createStore = useCallback((name: string, type: string) => {
    const newStore: StorePreset = {
      id: 'store-' + Date.now(),
      name,
      type,
      products: [],
      customers: defaultPresets[0].customers
    };
    setStores(prev => [...prev, newStore]);
    setCurrentStoreId(newStore.id);
    triggerCelebration();
  }, [triggerCelebration]);

  const deleteStore = useCallback((storeId: string) => {
    if (stores.length <= 1) return;
    setStores(prev => {
      const filtered = prev.filter(s => s.id !== storeId);
      if (currentStoreId === storeId) {
        setCurrentStoreId(filtered[0]?.id || defaultPresets[0].id);
      }
      return filtered;
    });
  }, [stores.length, currentStoreId]);

  // 6. Product Actions (CRUD)
  const addProduct = useCallback((item: Omit<Product, 'id' | 'daysOfSupply' | 'riskLevel'>) => {
    const sold = item.sold30d;
    const stock = item.stock;
    const dos = sold > 0 ? Math.round((stock / sold) * 30) : stock > 0 ? 9999 : 0;
    let risk: Product['riskLevel'] = 'optimal';
    if (dos <= 5) risk = 'reorder-urgent';
    else if (dos > 90) risk = 'high-deadstock';

    const newProd: Product = {
      ...item,
      id: 'prod-' + Date.now(),
      daysOfSupply: dos,
      riskLevel: risk
    };

    setStores(prev => prev.map(s => {
      if (s.id === currentStoreId) {
        return { ...s, products: [newProd, ...s.products] };
      }
      return s;
    }));
    triggerCelebration();
  }, [currentStoreId, triggerCelebration]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setStores(prev => prev.map(s => {
      if (s.id === currentStoreId) {
        const updatedProds = s.products.map(p => {
          if (p.id === id || p.sku === id) {
            const merged = { ...p, ...updates };
            // Recalculate DOS and Risk
            const sold = merged.sold30d;
            const stock = merged.stock;
            const dos = sold > 0 ? Math.round((stock / sold) * 30) : stock > 0 ? 9999 : 0;
            let risk: Product['riskLevel'] = 'optimal';
            if (dos <= 5) risk = 'reorder-urgent';
            else if (dos > 90) risk = 'high-deadstock';
            return { ...merged, daysOfSupply: dos, riskLevel: risk };
          }
          return p;
        });
        return { ...s, products: updatedProds };
      }
      return s;
    }));
  }, [currentStoreId]);

  const deleteProduct = useCallback((id: string) => {
    setStores(prev => prev.map(s => {
      if (s.id === currentStoreId) {
        return { ...s, products: s.products.filter(p => p.id !== id && p.sku !== id) };
      }
      return s;
    }));
  }, [currentStoreId]);

  // 7. CSV Importer
  const importCSV = useCallback((csvText: string, storeName?: string) => {
    const parsed = parseCSVToProducts(csvText);
    if (!parsed || parsed.length === 0) return false;

    const newId = 'custom-' + Date.now();
    const newStore: StorePreset = {
      id: newId,
      name: storeName?.trim() || `Toko Impor (${new Date().toLocaleDateString('id-ID')})`,
      type: 'Katalog Kustom / CSV Import',
      products: parsed,
      customers: defaultPresets[0].customers
    };

    setStores(prev => [newStore, ...prev]);
    setCurrentStoreId(newId);
    triggerCelebration();
    return true;
  }, [triggerCelebration]);

  // 8. Download Sample CSV Template
  const downloadSampleCSV = useCallback(() => {
    const sampleHeader = 'sku,name,category,price,cost,stock,sold30d\n';
    const sampleRows = [
      'SHP-001,Kaos Polos Cotton Combed 30s,Pakaian,75000,32000,450,180',
      'SHP-002,Kemeja Flanel Kotak Casual,Pakaian,165000,75000,12,140',
      'SHP-003,Celana Chino Slim Fit Stretch,Celana,189000,85000,850,25',
      'SHP-004,Jaket Bomber Parasut Windproof,Jaket,249000,110000,60,95',
      'SHP-005,Topi Baseball Bordir Classic,Aksesoris,49000,15000,1200,15'
    ].join('\n');

    const blob = new Blob([sampleHeader + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'datapulse_template_inventory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // 9. Send Win-Back Voucher
  const sendWinbackVoucher = useCallback((customer: Customer, voucherCode: string, discount: number, channel: 'whatsapp' | 'email' | 'copy') => {
    const message = `Halo Kak ${customer.name}! Terima kasih sudah setia belanja di ${currentStore.name}. Spesial hari ini, kami berikan voucher diskon ${discount}% (${voucherCode}) untuk pesanan kakak berikutnya! Yuk klaim sekarang.`;

    if (channel === 'whatsapp') {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    } else if (channel === 'email') {
      const mailto = `mailto:${customer.email}?subject=${encodeURIComponent(`Spesial Diskon ${discount}% dari ${currentStore.name}`)}&body=${encodeURIComponent(message)}`;
      window.open(mailto, '_blank');
    } else {
      navigator.clipboard.writeText(message);
    }
    triggerCelebration();
  }, [currentStore.name, triggerCelebration]);

  // 10. Reset Stream Transactions
  const resetStreamTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  // 11. Reset to Factory Defaults
  const resetToDefaults = useCallback(() => {
    if (confirm('Kembalikan semua data toko dan transaksi ke preset bawaan? Data custom akan dihapus.')) {
      setStores(defaultPresets);
      setCurrentStoreId(defaultPresets[0].id);
      setTransactions([]);
      try {
        localStorage.removeItem(STORAGE_STORES_KEY);
        localStorage.removeItem(STORAGE_CURRENT_STORE_KEY);
        localStorage.removeItem(STORAGE_TRANSACTIONS_KEY);
      } catch (e) {}
      triggerCelebration();
    }
  }, [triggerCelebration]);

  // 12. Export Executive Report
  const exportAuditReport = useCallback(() => {
    window.print();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        stores,
        currentStore,
        currentStoreId,
        products,
        customers,
        transactions,
        isStreaming,
        streamSpeed,
        switchStore,
        createStore,
        deleteStore,
        addProduct,
        updateProduct,
        deleteProduct,
        importCSV,
        downloadSampleCSV,
        sendWinbackVoucher,
        setIsStreaming,
        setStreamSpeed,
        resetStreamTransactions,
        exportAuditReport,
        resetToDefaults,
        triggerCelebration
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
