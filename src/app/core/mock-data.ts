import type {
  ChannelSlice,
  Order,
  OrderChannel,
  Product,
  ProductStatus,
  SeriesPoint,
} from './models';

/** Deterministic PRNG (mulberry32) so the mock data — and any screenshots taken
 * against it — stay stable across reloads instead of reshuffling every run. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260703);
const pick = <T,>(items: readonly T[]): T => items[Math.floor(rand() * items.length)];
const toIso = (d: Date): string => d.toISOString().slice(0, 10);

const TODAY = new Date('2026-07-03T00:00:00Z');
const daysAgo = (n: number): Date => new Date(TODAY.getTime() - n * 86_400_000);

export const PRODUCT_CATEGORIES = ['Apparel', 'Footwear', 'Accessories', 'Home', 'Electronics'] as const;

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Aurora Wool Sweater', sku: 'APR-1001', category: 'Apparel', price: 78, stock: 42, status: 'active', hue: 293, createdAt: '2026-04-12' },
  { id: 'p2', name: 'Drift Cargo Pants', sku: 'APR-1002', category: 'Apparel', price: 64, stock: 5, status: 'active', hue: 200, createdAt: '2026-04-18' },
  { id: 'p3', name: 'Nimbus Rain Jacket', sku: 'APR-1003', category: 'Apparel', price: 120, stock: 18, status: 'draft', hue: 210, createdAt: '2026-05-02' },
  { id: 'p4', name: 'Solstice Linen Shirt', sku: 'APR-1004', category: 'Apparel', price: 52, stock: 0, status: 'archived', hue: 40, createdAt: '2026-01-20' },
  { id: 'p5', name: 'Trailhead Hiking Boots', sku: 'FTW-2001', category: 'Footwear', price: 145, stock: 27, status: 'active', hue: 25, createdAt: '2026-03-11' },
  { id: 'p6', name: 'Cloudstep Running Shoes', sku: 'FTW-2002', category: 'Footwear', price: 98, stock: 63, status: 'active', hue: 340, createdAt: '2026-05-14' },
  { id: 'p7', name: 'Harbor Canvas Sneakers', sku: 'FTW-2003', category: 'Footwear', price: 72, stock: 8, status: 'active', hue: 150, createdAt: '2026-02-27' },
  { id: 'p8', name: 'Meridian Leather Belt', sku: 'ACC-3001', category: 'Accessories', price: 34, stock: 91, status: 'active', hue: 30, createdAt: '2026-03-30' },
  { id: 'p9', name: 'Voyager Canvas Tote', sku: 'ACC-3002', category: 'Accessories', price: 46, stock: 3, status: 'active', hue: 60, createdAt: '2026-06-01' },
  { id: 'p10', name: 'Ember Wool Beanie', sku: 'ACC-3003', category: 'Accessories', price: 22, stock: 0, status: 'archived', hue: 15, createdAt: '2025-11-08' },
  { id: 'p11', name: 'Lumen Ceramic Mug Set', sku: 'HOM-4001', category: 'Home', price: 38, stock: 54, status: 'active', hue: 190, createdAt: '2026-04-05' },
  { id: 'p12', name: 'Haven Linen Throw', sku: 'HOM-4002', category: 'Home', price: 56, stock: 12, status: 'draft', hue: 280, createdAt: '2026-06-10' },
  { id: 'p13', name: 'Kindle Soy Candle Trio', sku: 'HOM-4003', category: 'Home', price: 29, stock: 71, status: 'active', hue: 45, createdAt: '2026-02-15' },
  { id: 'p14', name: 'Pulse Wireless Earbuds', sku: 'ELC-5001', category: 'Electronics', price: 89, stock: 33, status: 'active', hue: 260, createdAt: '2026-05-22' },
  { id: 'p15', name: 'Ridgeline Power Bank', sku: 'ELC-5002', category: 'Electronics', price: 44, stock: 6, status: 'active', hue: 205, createdAt: '2026-03-19' },
  { id: 'p16', name: 'Compass Smart Watch', sku: 'ELC-5003', category: 'Electronics', price: 165, stock: 0, status: 'draft', hue: 300, createdAt: '2026-06-20' },
];

const CUSTOMERS = [
  { name: 'Amara Chen', email: 'amara.chen@example.com' },
  { name: 'Liam O’Connor', email: 'liam.oconnor@example.com' },
  { name: 'Sofia Ramirez', email: 'sofia.ramirez@example.com' },
  { name: 'Noah Kim', email: 'noah.kim@example.com' },
  { name: 'Isabella Rossi', email: 'isabella.rossi@example.com' },
  { name: 'Ethan Novak', email: 'ethan.novak@example.com' },
  { name: 'Mia Andersen', email: 'mia.andersen@example.com' },
  { name: 'Yusuf Demir', email: 'yusuf.demir@example.com' },
  { name: 'Priya Nair', email: 'priya.nair@example.com' },
  { name: 'Lucas Silva', email: 'lucas.silva@example.com' },
  { name: 'Hana Suzuki', email: 'hana.suzuki@example.com' },
  { name: 'Omar Farouk', email: 'omar.farouk@example.com' },
] as const;

const PAYMENTS = ['paid', 'paid', 'paid', 'pending', 'refunded'] as const;
const FULFILLMENTS = ['fulfilled', 'fulfilled', 'shipped', 'unfulfilled', 'cancelled'] as const;
const CHANNELS: OrderChannel[] = ['online', 'online', 'online', 'pos', 'social'];

function buildOrders(count: number): Order[] {
  const orders: Order[] = [];
  for (let i = 0; i < count; i++) {
    const number = `#${1042 + count - i}`;
    const customer = pick(CUSTOMERS);
    const date = toIso(daysAgo(Math.floor(rand() * 30)));
    const lineCount = 1 + Math.floor(rand() * 3);
    const items = Array.from({ length: lineCount }, () => {
      const product = pick(MOCK_PRODUCTS);
      return { productName: product.name, quantity: 1 + Math.floor(rand() * 2), price: product.price };
    });
    const total = Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
    orders.push({
      id: `o${i + 1}`,
      number,
      customer,
      date,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      total,
      payment: pick(PAYMENTS),
      fulfillment: pick(FULFILLMENTS),
      channel: pick(CHANNELS),
      items,
    });
  }
  return orders.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const MOCK_ORDERS: Order[] = buildOrders(45);

export const REVENUE_SERIES: SeriesPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = daysAgo(29 - i);
  const dayTotal = MOCK_ORDERS.filter((o) => o.date === toIso(date) && o.payment !== 'refunded').reduce(
    (sum, o) => sum + o.total,
    0,
  );
  return { label: toIso(date), value: Math.round(dayTotal) };
});

export const ORDERS_PER_DAY: SeriesPoint[] = Array.from({ length: 7 }, (_, i) => {
  const date = daysAgo(6 - i);
  const count = MOCK_ORDERS.filter((o) => o.date === toIso(date)).length;
  const label = date.toLocaleDateString('en-US', { weekday: 'short' });
  return { label, value: count };
});

export const CHANNEL_SPLIT: ChannelSlice[] = (['online', 'pos', 'social'] as const).map((channel, i) => ({
  label: channel === 'online' ? 'Online store' : channel === 'pos' ? 'Point of sale' : 'Social',
  value: MOCK_ORDERS.filter((o) => o.channel === channel).length,
  colorVar: `--chart-${i + 1}`,
}));

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  active: 'Active',
  draft: 'Draft',
  archived: 'Archived',
};
