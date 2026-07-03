import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideDollarSign,
  lucidePercent,
  lucideShoppingCart,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { OrdersService } from '../../core/orders.service';
import { AreaChart } from '../../shared/charts/area-chart';
import { BarChart } from '../../shared/charts/bar-chart';
import { DonutChart } from '../../shared/charts/donut-chart';
import { StatCard } from '../../shared/stat-card';
import { StatusBadge } from '../../shared/status-badge';
import { CHANNEL_SPLIT, ORDERS_PER_DAY, REVENUE_SERIES } from '../../core/mock-data';

const CURRENCY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const CONVERSION_BY_RANGE: Record<number, { rate: string; delta: string; positive: boolean }> = {
  7: { rate: '3.8%', delta: '+0.4%', positive: true },
  14: { rate: '3.6%', delta: '+0.1%', positive: true },
  30: { rate: '3.4%', delta: '-0.3%', positive: false },
};

@Component({
  selector: 'app-dashboard-page',
  imports: [
    RouterLink,
    HlmCardImports,
    HlmSelectImports,
    HlmProgressImports,
    StatCard,
    StatusBadge,
    AreaChart,
    BarChart,
    DonutChart,
  ],
  providers: [provideIcons({ lucideDollarSign, lucideShoppingCart, lucideUsers, lucidePercent })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold">Dashboard</h1>
          <p class="text-muted-foreground text-sm">Welcome back — here's how your store is doing.</p>
        </div>
        <hlm-select [(value)]="rangeDays" class="w-fit">
          <hlm-select-trigger class="w-36">
            <hlm-select-value />
          </hlm-select-trigger>
          <hlm-select-content *hlmSelectPortal>
            <hlm-select-item [value]="7">Last 7 days</hlm-select-item>
            <hlm-select-item [value]="14">Last 14 days</hlm-select-item>
            <hlm-select-item [value]="30">Last 30 days</hlm-select-item>
          </hlm-select-content>
        </hlm-select>
      </div>

      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <app-stat-card
          label="Revenue"
          [value]="revenueLabel()"
          delta="+12.4%"
          [deltaPositive]="true"
          icon="lucideDollarSign"
          colorVar="--chart-1"
        />
        <app-stat-card
          label="Orders"
          [value]="ordersInRange().length.toString()"
          delta="+8.1%"
          [deltaPositive]="true"
          icon="lucideShoppingCart"
          colorVar="--chart-2"
        />
        <app-stat-card
          label="Customers"
          [value]="customerCount().toString()"
          delta="+4.6%"
          [deltaPositive]="true"
          icon="lucideUsers"
          colorVar="--chart-4"
        />
        <app-stat-card
          label="Conversion rate"
          [value]="conversion().rate"
          [delta]="conversion().delta"
          [deltaPositive]="conversion().positive"
          icon="lucidePercent"
          colorVar="--chart-3"
        />
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <div hlmCard class="p-4 lg:col-span-2">
          <div hlmCardHeader class="px-0 pt-0">
            <h2 hlmCardTitle>Revenue trend</h2>
            <p hlmCardDescription>Daily revenue over the selected period</p>
          </div>
          <app-area-chart
            [data]="revenueSeries()"
            colorVar="--chart-1"
            ariaLabel="Revenue trend over the selected period"
            [valueFormatter]="formatCurrency"
          />
        </div>

        <div hlmCard class="p-4">
          <div hlmCardHeader class="px-0 pt-0">
            <h2 hlmCardTitle>Sales by channel</h2>
            <p hlmCardDescription>Where orders come from</p>
          </div>
          <app-donut-chart [data]="channelSplit" ariaLabel="Orders by sales channel" />
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <div hlmCard class="p-4 lg:col-span-2">
          <div hlmCardHeader class="px-0 pt-0">
            <h2 hlmCardTitle>Orders per day</h2>
            <p hlmCardDescription>Last 7 days</p>
          </div>
          <app-bar-chart [data]="ordersPerDay" colorVar="--chart-2" ariaLabel="Orders placed per day, last 7 days" />
        </div>

        <div hlmCard class="p-4">
          <div hlmCardHeader class="px-0 pt-0">
            <h2 hlmCardTitle>Top products</h2>
            <p hlmCardDescription>By revenue this period</p>
          </div>
          <ul class="flex flex-col gap-3">
            @for (item of topProducts(); track item.name; let i = $index) {
              <li class="flex flex-col gap-1">
                <div class="flex items-center justify-between text-sm">
                  <span class="truncate">{{ item.name }}</span>
                  <span class="text-muted-foreground shrink-0">{{ formatCurrency(item.revenue) }}</span>
                </div>
                <hlm-progress [value]="item.percent">
                  <div hlmProgressIndicator [style.background]="'var(--chart-' + ((i % 5) + 1) + ')'"></div>
                </hlm-progress>
              </li>
            }
          </ul>
        </div>
      </div>

      <div hlmCard class="p-4">
        <div hlmCardHeader class="px-0 pt-0">
          <h2 hlmCardTitle>Recent orders</h2>
          <p hlmCardDescription>Latest activity in your store</p>
          <a hlmCardAction routerLink="/orders" class="text-primary text-sm font-medium hover:underline">
            View all
          </a>
        </div>

        <ul class="flex flex-col divide-y">
          @for (order of recentOrders(); track order.id) {
            <li class="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
              <div class="min-w-0">
                <div class="font-medium">{{ order.number }}</div>
                <div class="text-muted-foreground truncate text-sm">{{ order.customer.name }}</div>
              </div>
              <div class="flex items-center gap-3">
                <app-status-badge [status]="order.fulfillment" />
                <span class="w-16 text-end font-medium">{{ formatCurrency(order.total) }}</span>
              </div>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
})
export class DashboardPage {
  private readonly ordersService = inject(OrdersService);

  protected readonly rangeDays = signal(30);
  protected readonly ordersPerDay = ORDERS_PER_DAY;
  protected readonly channelSplit = CHANNEL_SPLIT;

  protected readonly revenueSeries = computed(() => REVENUE_SERIES.slice(-this.rangeDays()));
  protected readonly revenueLabel = computed(() =>
    CURRENCY.format(this.revenueSeries().reduce((sum, p) => sum + p.value, 0)),
  );

  protected readonly ordersInRange = computed(() => {
    const cutoff = this.cutoffDate();
    return this.ordersService.orders().filter((o) => o.date >= cutoff);
  });

  protected readonly customerCount = computed(
    () => new Set(this.ordersInRange().map((o) => o.customer.email)).size,
  );

  protected readonly conversion = computed(() => CONVERSION_BY_RANGE[this.rangeDays()] ?? CONVERSION_BY_RANGE[30]);

  protected readonly topProducts = computed(() => {
    const totals = new Map<string, number>();
    for (const order of this.ordersInRange()) {
      for (const item of order.items) {
        totals.set(item.productName, (totals.get(item.productName) ?? 0) + item.price * item.quantity);
      }
    }
    const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    const max = sorted[0]?.[1] ?? 1;
    return sorted.map(([name, revenue]) => ({ name, revenue, percent: (revenue / max) * 100 }));
  });

  protected readonly recentOrders = computed(() => this.ordersService.orders().slice(0, 5));

  protected readonly formatCurrency = (value: number): string => CURRENCY.format(value);

  private cutoffDate(): string {
    const date = new Date('2026-07-03T00:00:00Z');
    date.setUTCDate(date.getUTCDate() - (this.rangeDays() - 1));
    return date.toISOString().slice(0, 10);
  }
}
