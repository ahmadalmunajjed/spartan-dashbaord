import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import type { Order } from '../../core/models';
import { StatusBadge } from '../../shared/status-badge';

const CURRENCY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

@Component({
  selector: 'app-order-detail-sheet',
  imports: [HlmSeparatorImports, StatusBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (order(); as order) {
      <div class="flex max-h-[80vh] flex-col gap-4 overflow-y-auto px-4 pb-4 md:max-h-none">
        <div class="flex items-center gap-2">
          <app-status-badge [status]="order.payment" />
          <app-status-badge [status]="order.fulfillment" />
        </div>

        <div>
          <div class="text-muted-foreground text-sm">Customer</div>
          <div class="font-medium">{{ order.customer.name }}</div>
          <div class="text-muted-foreground text-sm">{{ order.customer.email }}</div>
        </div>

        <hlm-separator />

        <div>
          <div class="text-muted-foreground mb-2 text-sm">Items</div>
          <ul class="flex flex-col gap-2">
            @for (item of order.items; track item.productName) {
              <li class="flex items-center justify-between text-sm">
                <span>{{ item.quantity }}× {{ item.productName }}</span>
                <span class="text-muted-foreground">{{ currency(item.price * item.quantity) }}</span>
              </li>
            }
          </ul>
        </div>

        <hlm-separator />

        <div class="flex items-center justify-between font-medium">
          <span>Total</span>
          <span>{{ currency(order.total) }}</span>
        </div>

        <div class="text-muted-foreground text-sm">Placed via {{ order.channel }} on {{ order.date }}</div>
      </div>
    }
  `,
})
export class OrderDetailSheet {
  public readonly order = input<Order | null>(null);

  protected currency(value: number): string {
    return CURRENCY.format(value);
  }
}
