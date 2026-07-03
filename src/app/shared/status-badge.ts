import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const STATUS_CLASSES: Record<string, string> = {
  active: 'bg-success/15 text-success',
  paid: 'bg-success/15 text-success',
  fulfilled: 'bg-success/15 text-success',
  pending: 'bg-warning/15 text-warning',
  unfulfilled: 'bg-warning/15 text-warning',
  shipped: 'bg-info/15 text-info',
  refunded: 'bg-destructive/10 text-destructive',
  cancelled: 'bg-destructive/10 text-destructive',
  archived: 'bg-destructive/10 text-destructive',
  draft: 'bg-muted text-muted-foreground',
};

@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize whitespace-nowrap"
      [class]="colorClass()"
    >
      {{ status() }}
    </span>
  `,
})
export class StatusBadge {
  public readonly status = input.required<string>();

  protected readonly colorClass = computed(
    () => STATUS_CLASSES[this.status()] ?? 'bg-muted text-muted-foreground',
  );
}
