import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard-page').then((m) => m.DashboardPage),
    title: 'Dashboard · Makook',
    data: { breadcrumb: [{ label: 'Dashboard' }] },
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products-page').then((m) => m.ProductsPage),
    title: 'Products · Makook',
    data: { breadcrumb: [{ label: 'Products' }] },
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./pages/products/add-product-page').then((m) => m.AddProductPage),
    title: 'Add product · Makook',
    data: { breadcrumb: [{ label: 'Products', link: '/products' }, { label: 'Add product' }] },
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders-page').then((m) => m.OrdersPage),
    title: 'Orders · Makook',
    data: { breadcrumb: [{ label: 'Orders' }] },
  },
  { path: '**', redirectTo: '' },
];
