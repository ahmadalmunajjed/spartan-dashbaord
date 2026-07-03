import { Injectable, signal } from '@angular/core';
import { MOCK_ORDERS } from './mock-data';
import type { Order } from './models';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly _orders = signal<Order[]>(MOCK_ORDERS);
  public readonly orders = this._orders.asReadonly();

  public markFulfilled(ids: ReadonlySet<string>): void {
    this._orders.update((orders) =>
      orders.map((o) => (ids.has(o.id) ? { ...o, fulfillment: 'fulfilled' } : o)),
    );
  }
}
