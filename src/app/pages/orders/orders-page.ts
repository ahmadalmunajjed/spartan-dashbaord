import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDown, lucideArrowUp, lucideChevronsUpDown } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import type { FulfillmentStatus, Order } from '../../core/models';
import { OrdersService } from '../../core/orders.service';
import { StatusBadge } from '../../shared/status-badge';
import { OrderDetailSheet } from './order-detail-sheet';

const CURRENCY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

type SortKey = 'number' | 'date' | 'customer' | 'total';

@Component({
  selector: 'app-orders-page',
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmTableImports,
    HlmCheckboxImports,
    HlmToggleGroupImports,
    HlmPaginationImports,
    HlmSheetImports,
    StatusBadge,
    OrderDetailSheet,
  ],
  providers: [provideIcons({ lucideArrowUp, lucideArrowDown, lucideChevronsUpDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Orders</h1>
        <p class="text-muted-foreground text-sm">{{ filtered().length }} orders</p>
      </div>

      <hlm-toggle-group type="single" [(value)]="fulfillmentFilter" class="w-fit">
        <button hlmToggleGroupItem value="all">All</button>
        <button hlmToggleGroupItem value="unfulfilled">Unfulfilled</button>
        <button hlmToggleGroupItem value="shipped">Shipped</button>
        <button hlmToggleGroupItem value="fulfilled">Fulfilled</button>
      </hlm-toggle-group>

      <div hlmTableContainer class="rounded-xl border">
        <table hlmTable>
          <thead hlmTHead>
            <tr hlmTr>
              <th hlmTh class="w-10">
                <hlm-checkbox
                  [checked]="allSelected()"
                  [indeterminate]="partiallySelected()"
                  (checkedChange)="toggleSelectAll($event)"
                  aria-label="Select all orders on this page"
                />
              </th>
              <th hlmTh>
                <button type="button" class="inline-flex items-center gap-1" (click)="toggleSort('number')" [attr.aria-sort]="ariaSort('number')">
                  Order
                  <ng-icon [name]="sortIcon('number')" class="text-sm" />
                </button>
              </th>
              <th hlmTh>
                <button type="button" class="inline-flex items-center gap-1" (click)="toggleSort('customer')" [attr.aria-sort]="ariaSort('customer')">
                  Customer
                  <ng-icon [name]="sortIcon('customer')" class="text-sm" />
                </button>
              </th>
              <th hlmTh class="hidden md:table-cell">
                <button type="button" class="inline-flex items-center gap-1" (click)="toggleSort('date')" [attr.aria-sort]="ariaSort('date')">
                  Date
                  <ng-icon [name]="sortIcon('date')" class="text-sm" />
                </button>
              </th>
              <th hlmTh class="hidden sm:table-cell">Payment</th>
              <th hlmTh class="hidden sm:table-cell">Fulfillment</th>
              <th hlmTh class="text-end">
                <button type="button" class="inline-flex items-center gap-1" (click)="toggleSort('total')" [attr.aria-sort]="ariaSort('total')">
                  Total
                  <ng-icon [name]="sortIcon('total')" class="text-sm" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody hlmTBody>
            @for (order of paged(); track order.id) {
              <tr hlmTr>
                <td hlmTd (click)="$event.stopPropagation()">
                  <hlm-checkbox
                    [checked]="selected().has(order.id)"
                    (checkedChange)="toggleOne(order.id, $event)"
                    [aria-label]="'Select order ' + order.number"
                  />
                </td>
                <td hlmTd>
                  <button type="button" class="font-medium hover:underline" (click)="selectedOrder.set(order)">
                    {{ order.number }}
                  </button>
                </td>
                <td hlmTd>{{ order.customer.name }}</td>
                <td hlmTd class="hidden md:table-cell">{{ order.date }}</td>
                <td hlmTd class="hidden sm:table-cell"><app-status-badge [status]="order.payment" /></td>
                <td hlmTd class="hidden sm:table-cell"><app-status-badge [status]="order.fulfillment" /></td>
                <td hlmTd class="text-end">{{ currency(order.total) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <hlm-numbered-pagination [(currentPage)]="page" [(itemsPerPage)]="pageSize" [totalItems]="filtered().length" />
    </div>

    @if (selected().size > 0) {
      <div
        class="bg-card fixed inset-x-4 bottom-20 z-20 flex flex-wrap items-center gap-3 rounded-xl border p-3 shadow-lg md:inset-x-auto md:end-4 md:bottom-4"
      >
        <span class="text-sm font-medium">{{ selected().size }} selected</span>
        <button hlmBtn variant="outline" size="sm" (click)="markFulfilled()">Mark fulfilled</button>
      </div>
    }

    <hlm-sheet side="right" [state]="sheetState()" (stateChanged)="onSheetStateChanged($event)">
      <hlm-sheet-content *hlmSheetPortal="let ctx">
        <hlm-sheet-header>
          <h3 hlmSheetTitle>{{ selectedOrder()?.number }}</h3>
        </hlm-sheet-header>
        <app-order-detail-sheet [order]="selectedOrder()" />
      </hlm-sheet-content>
    </hlm-sheet>
  `,
})
export class OrdersPage {
  private readonly ordersService = inject(OrdersService);

  protected readonly fulfillmentFilter = signal<'all' | FulfillmentStatus>('all');
  protected readonly sortKey = signal<SortKey>('date');
  protected readonly sortDir = signal<'asc' | 'desc'>('desc');
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly selected = signal<ReadonlySet<string>>(new Set());
  protected readonly selectedOrder = signal<Order | null>(null);

  protected readonly filtered = computed(() => {
    const filter = this.fulfillmentFilter();
    const orders = this.ordersService.orders();
    return filter === 'all' ? orders : orders.filter((o) => o.fulfillment === filter);
  });

  protected readonly sorted = computed(() => {
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return [...this.filtered()].sort((a, b) => {
      switch (key) {
        case 'number':
          return a.number.localeCompare(b.number) * dir;
        case 'customer':
          return a.customer.name.localeCompare(b.customer.name) * dir;
        case 'total':
          return (a.total - b.total) * dir;
        case 'date':
        default:
          return a.date.localeCompare(b.date) * dir;
      }
    });
  });

  protected readonly paged = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.sorted().slice(start, start + this.pageSize());
  });

  protected readonly sheetState = computed<'open' | 'closed'>(() =>
    this.selectedOrder() ? 'open' : 'closed',
  );

  protected readonly allSelected = computed(() => {
    const ids = this.paged().map((o) => o.id);
    return ids.length > 0 && ids.every((id) => this.selected().has(id));
  });

  protected readonly partiallySelected = computed(() => {
    const ids = this.paged().map((o) => o.id);
    const count = ids.filter((id) => this.selected().has(id)).length;
    return count > 0 && count < ids.length;
  });

  protected currency(value: number): string {
    return CURRENCY.format(value);
  }

  protected toggleSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.page.set(1);
  }

  protected sortIcon(key: SortKey): string {
    if (this.sortKey() !== key) return 'lucideChevronsUpDown';
    return this.sortDir() === 'asc' ? 'lucideArrowUp' : 'lucideArrowDown';
  }

  protected ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
    if (this.sortKey() !== key) return 'none';
    return this.sortDir() === 'asc' ? 'ascending' : 'descending';
  }

  protected toggleOne(id: string, checked: boolean): void {
    const next = new Set(this.selected());
    if (checked) next.add(id);
    else next.delete(id);
    this.selected.set(next);
  }

  protected toggleSelectAll(checked: boolean): void {
    if (!checked) {
      this.selected.set(new Set());
      return;
    }
    this.selected.set(new Set(this.paged().map((o) => o.id)));
  }

  protected markFulfilled(): void {
    this.ordersService.markFulfilled(this.selected());
    toast.success(`Marked ${this.selected().size} order(s) as fulfilled`);
    this.selected.set(new Set());
  }

  protected onSheetStateChanged(state: 'open' | 'closed'): void {
    if (state === 'closed') this.selectedOrder.set(null);
  }
}
