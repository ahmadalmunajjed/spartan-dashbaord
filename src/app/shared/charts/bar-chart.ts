import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import type { SeriesPoint } from '../../core/models';

const WIDTH = 600;
const HEIGHT = 220;
const PAD = { top: 16, right: 8, bottom: 24, left: 8 };
const BAR_MAX_WIDTH = 24;

@Component({
  selector: 'app-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', dir: 'ltr' },
  template: `
    <div class="relative w-full">
      <svg
        [attr.viewBox]="'0 0 ' + width + ' ' + height"
        class="block h-auto w-full"
        role="img"
        [attr.aria-label]="ariaLabel()"
      >
        @for (line of gridlines(); track line.y) {
          <line
            [attr.x1]="pad.left"
            [attr.x2]="width - pad.right"
            [attr.y1]="line.y"
            [attr.y2]="line.y"
            stroke="var(--border)"
            stroke-width="1"
          />
        }

        @for (bar of bars(); track bar.label; let i = $index) {
          <rect
            [attr.x]="bar.x"
            [attr.y]="bar.y"
            [attr.width]="bar.width"
            [attr.height]="bar.height"
            rx="4"
            [attr.fill]="'var(' + colorVar() + ')'"
            [attr.opacity]="hoverIndex() === null || hoverIndex() === i ? 1 : 0.5"
            (pointerenter)="hoverIndex.set(i)"
            (pointerleave)="hoverIndex.set(null)"
          />
          <text
            [attr.x]="bar.x + bar.width / 2"
            [attr.y]="height - 6"
            text-anchor="middle"
            class="fill-muted-foreground"
            font-size="14"
          >
            {{ bar.label }}
          </text>
        }
      </svg>

      @if (hovered(); as h) {
        <div
          class="bg-popover text-popover-foreground border-border pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border px-2 py-1 text-xs shadow-md"
          [style.left.%]="(h.x / width) * 100"
          [style.top.%]="(h.y / height) * 100"
        >
          <div class="text-muted-foreground">{{ h.label }}</div>
          <div class="font-medium">{{ h.value }}</div>
        </div>
      }

      <span class="sr-only">
        {{ ariaLabel() }}. Values:
        @for (p of data(); track p.label) {
          {{ p.label }}: {{ p.value }}.
        }
      </span>
    </div>
  `,
})
export class BarChart {
  public readonly data = input.required<SeriesPoint[]>();
  public readonly colorVar = input('--chart-2');
  public readonly ariaLabel = input.required<string>();

  protected readonly width = WIDTH;
  protected readonly height = HEIGHT;
  protected readonly pad = PAD;
  protected readonly hoverIndex = signal<number | null>(null);

  protected readonly bars = computed(() => {
    const data = this.data();
    if (!data.length) return [];
    const max = Math.max(...data.map((d) => d.value), 1);
    const plotWidth = WIDTH - PAD.left - PAD.right;
    const plotHeight = HEIGHT - PAD.top - PAD.bottom;
    const slot = plotWidth / data.length;
    const barWidth = Math.min(BAR_MAX_WIDTH, slot * 0.55);
    return data.map((d, i) => {
      const barHeight = (d.value / max) * plotHeight;
      return {
        x: PAD.left + slot * i + (slot - barWidth) / 2,
        y: PAD.top + plotHeight - barHeight,
        width: barWidth,
        height: Math.max(barHeight, 1),
        label: d.label,
        value: d.value,
      };
    });
  });

  protected readonly gridlines = computed(() => {
    const plotHeight = HEIGHT - PAD.top - PAD.bottom;
    return [0, 0.5, 1].map((f) => ({ y: PAD.top + plotHeight * f }));
  });

  protected readonly hovered = computed(() => {
    const index = this.hoverIndex();
    const bars = this.bars();
    if (index === null || !bars[index]) return null;
    const b = bars[index];
    return { x: b.x + b.width / 2, y: b.y, label: b.label, value: b.value };
  });
}
