import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ChannelSlice } from '../../core/models';

const SIZE = 160;
const RADIUS = 58;
const STROKE = 20;
const GAP_PCT = 1.5;

@Component({
  selector: 'app-donut-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col items-center gap-4 sm:flex-row sm:items-center' },
  template: `
    <svg
      dir="ltr"
      [attr.viewBox]="'0 0 ' + size + ' ' + size"
      class="block h-auto w-40 shrink-0"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      <g [attr.transform]="'rotate(-90 ' + size / 2 + ' ' + size / 2 + ')'">
        <circle
          [attr.cx]="size / 2"
          [attr.cy]="size / 2"
          [attr.r]="radius"
          fill="none"
          stroke="var(--muted)"
          [attr.stroke-width]="stroke"
        />
        @for (seg of segments(); track seg.label) {
          <circle
            [attr.cx]="size / 2"
            [attr.cy]="size / 2"
            [attr.r]="radius"
            fill="none"
            [attr.stroke]="'var(' + seg.colorVar + ')'"
            [attr.stroke-width]="stroke"
            stroke-linecap="butt"
            pathLength="100"
            [attr.stroke-dasharray]="seg.dash + ' ' + (100 - seg.dash)"
            [attr.stroke-dashoffset]="seg.offset"
          >
            <title>{{ seg.label }}: {{ seg.value }} ({{ seg.percentLabel }})</title>
          </circle>
        }
      </g>
      <text
        [attr.x]="size / 2"
        [attr.y]="size / 2 - 4"
        text-anchor="middle"
        class="fill-foreground"
        font-size="22"
        font-weight="600"
      >
        {{ total() }}
      </text>
      <text
        [attr.x]="size / 2"
        [attr.y]="size / 2 + 16"
        text-anchor="middle"
        class="fill-muted-foreground"
        font-size="10"
      >
        orders
      </text>
    </svg>

    <ul class="flex w-full flex-col gap-2">
      @for (seg of segments(); track seg.label) {
        <li class="flex items-center gap-2 text-sm">
          <span class="size-2.5 shrink-0 rounded-full" [style.background]="'var(' + seg.colorVar + ')'"></span>
          <span class="flex-1">{{ seg.label }}</span>
          <span class="text-muted-foreground">{{ seg.percentLabel }}</span>
        </li>
      }
    </ul>
  `,
})
export class DonutChart {
  public readonly data = input.required<ChannelSlice[]>();
  public readonly ariaLabel = input.required<string>();

  protected readonly size = SIZE;
  protected readonly radius = RADIUS;
  protected readonly stroke = STROKE;

  protected readonly total = computed(() => this.data().reduce((sum, d) => sum + d.value, 0));

  protected readonly segments = computed(() => {
    const total = this.total() || 1;
    let cumulative = 0;
    return this.data().map((d) => {
      const pct = (d.value / total) * 100;
      const dash = Math.max(pct - GAP_PCT, 0);
      const offset = -(cumulative + GAP_PCT / 2);
      cumulative += pct;
      return {
        label: d.label,
        value: d.value,
        colorVar: d.colorVar,
        dash,
        offset,
        percentLabel: `${Math.round(pct)}%`,
      };
    });
  });
}
