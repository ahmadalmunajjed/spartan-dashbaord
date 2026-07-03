export type ProductStatus = 'active' | 'draft' | 'archived';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  price: number;
  stock: number;
  status: ProductStatus;
  hue: number;
  createdAt: string;
}

export type PaymentStatus = 'paid' | 'pending' | 'refunded';
export type FulfillmentStatus = 'fulfilled' | 'unfulfilled' | 'shipped' | 'cancelled';
export type OrderChannel = 'online' | 'pos' | 'social';

export interface OrderLineItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  number: string;
  customer: { name: string; email: string };
  date: string;
  itemCount: number;
  total: number;
  payment: PaymentStatus;
  fulfillment: FulfillmentStatus;
  channel: OrderChannel;
  items: OrderLineItem[];
}

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface ChannelSlice {
  label: string;
  value: number;
  colorVar: string;
}

export interface Breadcrumb {
  label: string;
  link?: string;
}
