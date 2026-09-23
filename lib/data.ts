// ==================== TYPES ====================
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sold30d: number;
  daysOfSupply: number;
  riskLevel: 'optimal' | 'reorder-urgent' | 'high-deadstock';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDays: number;
  avgOrderValue: number;
  segment: 'champions' | 'loyal' | 'at-risk' | 'lost' | 'new';
}

export interface Transaction {
  id: string;
  timestamp: number;
  platform: 'Shopify' | 'Tokopedia' | 'Shopee';
  customerName: string;
  product: string;
  quantity: number;
  total: number;
  status: 'completed' | 'pending' | 'processing';
}

export interface StorePreset {
  id: string;
  name: string;
  type: string;
  products: Product[];
  customers: Customer[];
}

// ==================== HELPERS ====================
const randomId = () => Math.random().toString(36).substring(2, 10);
const randomName = () => {
  const first = ['Andi', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fitri', 'Galih', 'Hana', 'Irfan', 'Joko', 'Karin', 'Lina', 'Mega', 'Nina', 'Oka', 'Putri', 'Raka', 'Sari', 'Toni', 'Umar', 'Vina', 'Wati', 'Yuli', 'Zahra'];
  const last = ['Pratama', 'Sari', 'Wijaya', 'Putri', 'Santoso', 'Hidayat', 'Rahman', 'Putra', 'Lestari', 'Kusuma'];
  return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
};

const platforms: Transaction['platform'][] = ['Shopify', 'Tokopedia', 'Shopee'];

// ==================== FASHION STORE ====================
const fashionProducts: Product[] = [
  { id: 'fp1', sku: 'FSH-001', name: 'Hoodie Oversize Premium', category: 'Outerwear', price: 289000, cost: 145000, stock: 245, sold30d: 187, daysOfSupply: 39, riskLevel: 'optimal' },
  { id: 'fp2', sku: 'FSH-002', name: 'Celana Jogger Slim Fit', category: 'Bottoms', price: 199000, cost: 85000, stock: 12, sold30d: 234, daysOfSupply: 2, riskLevel: 'reorder-urgent' },
  { id: 'fp3', sku: 'FSH-003', name: 'Kaos Basic V-Neck 3pcs', category: 'Tops', price: 149000, cost: 42000, stock: 890, sold30d: 45, daysOfSupply: 593, riskLevel: 'high-deadstock' },
  { id: 'fp4', sku: 'FSH-004', name: 'Jaket Denim Vintage', category: 'Outerwear', price: 459000, cost: 210000, stock: 78, sold30d: 56, daysOfSupply: 42, riskLevel: 'optimal' },
  { id: 'fp5', sku: 'FSH-005', name: 'Rok Plisket Midi', category: 'Bottoms', price: 179000, cost: 68000, stock: 340, sold30d: 23, daysOfSupply: 443, riskLevel: 'high-deadstock' },
  { id: 'fp6', sku: 'FSH-006', name: 'Kemeja Linen Oversized', category: 'Tops', price: 259000, cost: 120000, stock: 8, sold30d: 112, daysOfSupply: 2, riskLevel: 'reorder-urgent' },
  { id: 'fp7', sku: 'FSH-007', name: 'Sweater Rajut Cable', category: 'Outerwear', price: 329000, cost: 160000, stock: 156, sold30d: 89, daysOfSupply: 53, riskLevel: 'optimal' },
  { id: 'fp8', sku: 'FSH-008', name: 'Celana Cargo Wide Leg', category: 'Bottoms', price: 249000, cost: 105000, stock: 5, sold30d: 178, daysOfSupply: 1, riskLevel: 'reorder-urgent' },
  { id: 'fp9', sku: 'FSH-009', name: 'Tank Top Ribbed', category: 'Tops', price: 89000, cost: 28000, stock: 1200, sold30d: 18, daysOfSupply: 2000, riskLevel: 'high-deadstock' },
  { id: 'fp10', sku: 'FSH-010', name: 'Blazer Tailored Fit', category: 'Outerwear', price: 599000, cost: 280000, stock: 67, sold30d: 34, daysOfSupply: 59, riskLevel: 'optimal' },
];

const fashionCustomers: Customer[] = [
  { id: 'fc1', name: 'Sarah Wijaya', email: 'sarah@mail.com', totalOrders: 47, totalSpent: 12500000, lastOrderDays: 3, avgOrderValue: 265957, segment: 'champions' },
  { id: 'fc2', name: 'Rina Lestari', email: 'rina@mail.com', totalOrders: 28, totalSpent: 7800000, lastOrderDays: 8, avgOrderValue: 278571, segment: 'loyal' },
  { id: 'fc3', name: 'Budi Santoso', email: 'budi@mail.com', totalOrders: 15, totalSpent: 4200000, lastOrderDays: 45, avgOrderValue: 280000, segment: 'at-risk' },
  { id: 'fc4', name: 'Andi Pratama', email: 'andi@mail.com', totalOrders: 3, totalSpent: 890000, lastOrderDays: 120, avgOrderValue: 296667, segment: 'lost' },
  { id: 'fc5', name: 'Dewi Putri', email: 'dewi@mail.com', totalOrders: 2, totalSpent: 378000, lastOrderDays: 5, avgOrderValue: 189000, segment: 'new' },
  { id: 'fc6', name: 'Fitri Rahman', email: 'fitri@mail.com', totalOrders: 52, totalSpent: 15600000, lastOrderDays: 1, avgOrderValue: 300000, segment: 'champions' },
  { id: 'fc7', name: 'Galih Putra', email: 'galih@mail.com', totalOrders: 8, totalSpent: 2100000, lastOrderDays: 60, avgOrderValue: 262500, segment: 'at-risk' },
  { id: 'fc8', name: 'Hana Kusuma', email: 'hana@mail.com', totalOrders: 1, totalSpent: 289000, lastOrderDays: 180, avgOrderValue: 289000, segment: 'lost' },
  { id: 'fc9', name: 'Joko Hidayat', email: 'joko@mail.com', totalOrders: 19, totalSpent: 5400000, lastOrderDays: 12, avgOrderValue: 284210, segment: 'loyal' },
  { id: 'fc10', name: 'Karin Sari', email: 'karin@mail.com', totalOrders: 1, totalSpent: 149000, lastOrderDays: 2, avgOrderValue: 149000, segment: 'new' },
];

// ==================== GADGET STORE ====================
const gadgetProducts: Product[] = [
  { id: 'gp1', sku: 'GDG-001', name: 'TWS Earbuds Pro ANC', category: 'Audio', price: 899000, cost: 350000, stock: 120, sold30d: 210, daysOfSupply: 17, riskLevel: 'optimal' },
  { id: 'gp2', sku: 'GDG-002', name: 'Smartwatch Fitness AMOLED', category: 'Wearable', price: 1299000, cost: 550000, stock: 5, sold30d: 89, daysOfSupply: 2, riskLevel: 'reorder-urgent' },
  { id: 'gp3', sku: 'GDG-003', name: 'Keyboard Mechanical 75%', category: 'Peripherals', price: 649000, cost: 280000, stock: 450, sold30d: 32, daysOfSupply: 422, riskLevel: 'high-deadstock' },
  { id: 'gp4', sku: 'GDG-004', name: 'Powerbank 20000mAh PD', category: 'Accessories', price: 349000, cost: 140000, stock: 78, sold30d: 156, daysOfSupply: 15, riskLevel: 'optimal' },
  { id: 'gp5', sku: 'GDG-005', name: 'Webcam 4K Autofocus', category: 'Peripherals', price: 1199000, cost: 480000, stock: 3, sold30d: 67, daysOfSupply: 1, riskLevel: 'reorder-urgent' },
  { id: 'gp6', sku: 'GDG-006', name: 'Speaker Bluetooth 30W', category: 'Audio', price: 799000, cost: 320000, stock: 380, sold30d: 28, daysOfSupply: 407, riskLevel: 'high-deadstock' },
  { id: 'gp7', sku: 'GDG-007', name: 'USB-C Hub 8-in-1', category: 'Accessories', price: 499000, cost: 200000, stock: 92, sold30d: 145, daysOfSupply: 19, riskLevel: 'optimal' },
  { id: 'gp8', sku: 'GDG-008', name: 'Mouse Gaming Wireless', category: 'Peripherals', price: 549000, cost: 220000, stock: 7, sold30d: 198, daysOfSupply: 1, riskLevel: 'reorder-urgent' },
  { id: 'gp9', sku: 'GDG-009', name: 'Ring Light 18inch LED', category: 'Accessories', price: 399000, cost: 160000, stock: 520, sold30d: 15, daysOfSupply: 1040, riskLevel: 'high-deadstock' },
  { id: 'gp10', sku: 'GDG-010', name: 'Tablet Stand Adjustable', category: 'Accessories', price: 249000, cost: 95000, stock: 134, sold30d: 78, daysOfSupply: 52, riskLevel: 'optimal' },
];

const gadgetCustomers: Customer[] = [
  { id: 'gc1', name: 'Rizky Kurniawan', email: 'rizky@mail.com', totalOrders: 38, totalSpent: 28900000, lastOrderDays: 2, avgOrderValue: 760526, segment: 'champions' },
  { id: 'gc2', name: 'Toni Putra', email: 'toni@mail.com', totalOrders: 22, totalSpent: 16500000, lastOrderDays: 10, avgOrderValue: 750000, segment: 'loyal' },
  { id: 'gc3', name: 'Mega Sari', email: 'mega@mail.com', totalOrders: 9, totalSpent: 5600000, lastOrderDays: 55, avgOrderValue: 622222, segment: 'at-risk' },
  { id: 'gc4', name: 'Oka Pratama', email: 'oka@mail.com', totalOrders: 2, totalSpent: 1200000, lastOrderDays: 150, avgOrderValue: 600000, segment: 'lost' },
  { id: 'gc5', name: 'Nina Hidayat', email: 'nina@mail.com', totalOrders: 1, totalSpent: 899000, lastOrderDays: 4, avgOrderValue: 899000, segment: 'new' },
  { id: 'gc6', name: 'Umar Rahman', email: 'umar@mail.com', totalOrders: 45, totalSpent: 32000000, lastOrderDays: 1, avgOrderValue: 711111, segment: 'champions' },
  { id: 'gc7', name: 'Vina Lestari', email: 'vina@mail.com', totalOrders: 6, totalSpent: 3800000, lastOrderDays: 70, avgOrderValue: 633333, segment: 'at-risk' },
  { id: 'gc8', name: 'Wati Kusuma', email: 'wati@mail.com', totalOrders: 1, totalSpent: 349000, lastOrderDays: 200, avgOrderValue: 349000, segment: 'lost' },
  { id: 'gc9', name: 'Yuli Wijaya', email: 'yuli@mail.com', totalOrders: 18, totalSpent: 12800000, lastOrderDays: 7, avgOrderValue: 711111, segment: 'loyal' },
  { id: 'gc10', name: 'Zahra Putri', email: 'zahra@mail.com', totalOrders: 3, totalSpent: 2100000, lastOrderDays: 3, avgOrderValue: 700000, segment: 'new' },
];

// ==================== SKINCARE STORE ====================
const skincareProducts: Product[] = [
  { id: 'sp1', sku: 'SKN-001', name: 'Serum Vitamin C 20%', category: 'Serum', price: 189000, cost: 45000, stock: 320, sold30d: 450, daysOfSupply: 21, riskLevel: 'optimal' },
  { id: 'sp2', sku: 'SKN-002', name: 'Sunscreen SPF50 PA++++', category: 'Sun Care', price: 159000, cost: 38000, stock: 8, sold30d: 520, daysOfSupply: 0, riskLevel: 'reorder-urgent' },
  { id: 'sp3', sku: 'SKN-003', name: 'Toner AHA/BHA Gentle', category: 'Toner', price: 129000, cost: 32000, stock: 680, sold30d: 35, daysOfSupply: 583, riskLevel: 'high-deadstock' },
  { id: 'sp4', sku: 'SKN-004', name: 'Moisturizer Ceramide', category: 'Moisturizer', price: 219000, cost: 55000, stock: 150, sold30d: 280, daysOfSupply: 16, riskLevel: 'optimal' },
  { id: 'sp5', sku: 'SKN-005', name: 'Retinol Night Cream', category: 'Treatment', price: 279000, cost: 72000, stock: 4, sold30d: 190, daysOfSupply: 1, riskLevel: 'reorder-urgent' },
  { id: 'sp6', sku: 'SKN-006', name: 'Clay Mask Charcoal', category: 'Mask', price: 99000, cost: 25000, stock: 900, sold30d: 22, daysOfSupply: 1227, riskLevel: 'high-deadstock' },
  { id: 'sp7', sku: 'SKN-007', name: 'Eye Cream Peptide', category: 'Treatment', price: 249000, cost: 68000, stock: 88, sold30d: 95, daysOfSupply: 28, riskLevel: 'optimal' },
  { id: 'sp8', sku: 'SKN-008', name: 'Cleansing Oil Double', category: 'Cleanser', price: 169000, cost: 40000, stock: 6, sold30d: 310, daysOfSupply: 1, riskLevel: 'reorder-urgent' },
  { id: 'sp9', sku: 'SKN-009', name: 'Sheet Mask Set 10pcs', category: 'Mask', price: 149000, cost: 35000, stock: 750, sold30d: 18, daysOfSupply: 1250, riskLevel: 'high-deadstock' },
  { id: 'sp10', sku: 'SKN-010', name: 'Lip Balm SPF15 Tinted', category: 'Lip Care', price: 79000, cost: 18000, stock: 200, sold30d: 120, daysOfSupply: 50, riskLevel: 'optimal' },
];

const skincareCustomers: Customer[] = [
  { id: 'sc1', name: 'Dewi Natalia', email: 'dewi.n@mail.com', totalOrders: 56, totalSpent: 8900000, lastOrderDays: 1, avgOrderValue: 158928, segment: 'champions' },
  { id: 'sc2', name: 'Putri Sari', email: 'putri@mail.com', totalOrders: 31, totalSpent: 5200000, lastOrderDays: 6, avgOrderValue: 167741, segment: 'loyal' },
  { id: 'sc3', name: 'Lina Rahman', email: 'lina@mail.com', totalOrders: 12, totalSpent: 2100000, lastOrderDays: 40, avgOrderValue: 175000, segment: 'at-risk' },
  { id: 'sc4', name: 'Citra Hidayat', email: 'citra@mail.com', totalOrders: 2, totalSpent: 348000, lastOrderDays: 130, avgOrderValue: 174000, segment: 'lost' },
  { id: 'sc5', name: 'Irfan Pratama', email: 'irfan@mail.com', totalOrders: 1, totalSpent: 189000, lastOrderDays: 3, avgOrderValue: 189000, segment: 'new' },
  { id: 'sc6', name: 'Sari Kusuma', email: 'sari.k@mail.com', totalOrders: 62, totalSpent: 10200000, lastOrderDays: 2, avgOrderValue: 164516, segment: 'champions' },
  { id: 'sc7', name: 'Raka Wijaya', email: 'raka@mail.com', totalOrders: 7, totalSpent: 1250000, lastOrderDays: 65, avgOrderValue: 178571, segment: 'at-risk' },
  { id: 'sc8', name: 'Eko Putra', email: 'eko@mail.com', totalOrders: 1, totalSpent: 99000, lastOrderDays: 210, avgOrderValue: 99000, segment: 'lost' },
  { id: 'sc9', name: 'Hana Santoso', email: 'hana.s@mail.com', totalOrders: 25, totalSpent: 4100000, lastOrderDays: 9, avgOrderValue: 164000, segment: 'loyal' },
  { id: 'sc10', name: 'Fitri Wijaya', email: 'fitri.w@mail.com', totalOrders: 2, totalSpent: 348000, lastOrderDays: 4, avgOrderValue: 174000, segment: 'new' },
];

// ==================== STORE PRESETS ====================
export const storePresets: StorePreset[] = [
  { id: 'fashion', name: 'FashionElite ID', type: 'Fashion & Apparel', products: fashionProducts, customers: fashionCustomers },
  { id: 'gadget', name: 'GadgetMall', type: 'Gadget & Electronics', products: gadgetProducts, customers: gadgetCustomers },
  { id: 'skincare', name: 'GlowSkin ID', type: 'Skincare & Beauty', products: skincareProducts, customers: skincareCustomers },
];

// ==================== TRANSACTION GENERATOR ====================
export function generateTransaction(products: Product[]): Transaction {
  const product = products[Math.floor(Math.random() * products.length)];
  const qty = Math.floor(Math.random() * 3) + 1;
  const statuses: Transaction['status'][] = ['completed', 'pending', 'processing'];
  return {
    id: randomId(),
    timestamp: Date.now(),
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    customerName: randomName(),
    product: product.name,
    quantity: qty,
    total: product.price * qty,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
}

// ==================== CSV PARSER ====================
export function parseCSVToProducts(csvText: string): Product[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  return lines.slice(1).map((line, i) => {
    const cols = line.split(',').map(c => c.trim());
    const get = (key: string) => {
      const idx = headers.indexOf(key);
      return idx >= 0 ? cols[idx] : '';
    };
    const price = parseFloat(get('price') || get('harga') || '0');
    const cost = parseFloat(get('cost') || get('hpp') || '0');
    const stock = parseInt(get('stock') || get('stok') || '0', 10);
    const sold = parseInt(get('sold30d') || get('terjual') || get('sold') || '0', 10);
    const dos = sold > 0 ? Math.round((stock / sold) * 30) : stock > 0 ? 9999 : 0;
    let risk: Product['riskLevel'] = 'optimal';
    if (dos <= 5) risk = 'reorder-urgent';
    else if (dos > 90) risk = 'high-deadstock';
    return {
      id: `csv-${i}`,
      sku: get('sku') || get('id') || `SKU-${i + 1}`,
      name: get('name') || get('nama') || `Product ${i + 1}`,
      category: get('category') || get('kategori') || 'General',
      price,
      cost,
      stock,
      sold30d: sold,
      daysOfSupply: dos,
      riskLevel: risk,
    };
  });
}

// ==================== FORMAT HELPERS ====================
export function formatRupiah(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
