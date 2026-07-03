import { Injectable, signal } from '@angular/core';
import { MOCK_PRODUCTS } from './mock-data';
import type { Product, ProductStatus } from './models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly _products = signal<Product[]>(MOCK_PRODUCTS);
  public readonly products = this._products.asReadonly();

  public add(input: Omit<Product, 'id' | 'createdAt'>): Product {
    const product: Product = {
      ...input,
      id: `p${crypto.randomUUID()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this._products.update((products) => [product, ...products]);
    return product;
  }

  public remove(ids: ReadonlySet<string>): void {
    this._products.update((products) => products.filter((p) => !ids.has(p.id)));
  }

  public setStatus(ids: ReadonlySet<string>, status: ProductStatus): void {
    this._products.update((products) =>
      products.map((p) => (ids.has(p.id) ? { ...p, status } : p)),
    );
  }
}
