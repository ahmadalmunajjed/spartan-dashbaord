import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import type { SeriesPoint } from '../../core/models';

const WIDTH = 600;
const HEIGHT = 220;
const PAD = { top: 16, right: 12, bottom: 24, left: 12 };

@Component({
  selector: 'app-area-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', dir: 'ltr' },
  template: `
    <div class="relative w-full" (pointerleave)="hoverIndex.set(null)">
      <svg
        [attr.viewBox]="'0 0 ' + width + ' ' + height"
        class="block h-auto w-full"
        role="img"
        [attr.aria-label]="ariaLabel()"
        (pointermove)="onPointerMove($event)"
      >
        <defs>
          <linearGradient [attr.id]="gradientId()" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" [attr.stop-color]="'var(' + colorVar() + ')'" stop-opacity="0.22" />
            <stop offset="100%" [attr.stop-color]="'var(' + colorVar() + ')'" stop-opacity="0" />
          </linearGradient>
        </defs>

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

        <path [attr.d]="areaPath()" [attr.fill]="'url(#' + gradientId() + ')'" />
        <path
          [attr.d]="linePath()"
          fill="none"
          [attr.stroke]="'var(' + colorVar() + ')'"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
        />

        @if (points(); as pts) {
          @if (pts.length) {
            <circle
              [attr.cx]="pts[pts.length - 1].x"
              [attr.cy]="pts[pts.length - 1].y"
              r="4"
              [attr.fill]="'var(' + colorVar() + ')'"
              stroke="var(--card)"
              stroke-width="2"
            />
          }
        }

        @if (hovered(); as h) {
          <line
            [attr.x1]="h.x"
            [attr.x2]="h.x"
            [attr.y1]="pad.top"
            [attr.y2]="height - pad.bottom"
            stroke="var(--border)"
            stroke-width="1"
          />
          <circle [attr.cx]="h.x" [attr.cy]="h.y" r="5" [attr.fill]="'var(' + colorVar() + ')'" stroke="var(--card)" stroke-width="2" />
        }

        <text
          [attr.x]="pad.left"
          [attr.y]="height - 6"
          class="fill-muted-foreground"
          font-size="14"
        >
          {{ firstLabel() }}
        </text>
        <text
          [attr.x]="width - pad.right"
          [attr.y]="height - 6"
          text-anchor="end"
          class="fill-muted-foreground"
          font-size="14"
        >
          {{ lastLabel() }}
        </text>
      </svg>

      @if (hovered(); as h) {
        <div
          class="bg-popover text-popover-foreground border-border pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border px-2 py-1 text-xs shadow-md"
          [style.left.%]="(h.x / width) * 100"
          [style.top.%]="(h.y / height) * 100"
        >
          <div class="text-muted-foreground">{{ h.label }}</div>
          <div class="font-medium">{{ h.formattedValue }}</div>
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
export class AreaChart {
  public readonly data = input.required<SeriesPoint[]>();
  public readonly colorVar = input('--chart-1');
  public readonly ariaLabel = input.required<string>();
  public readonly valueFormatter = input<(value: number) => string>((v) => `${v}`);

  protected readonly width = WIDTH;
  protected readonly height = HEIGHT;
  protected readonly pad = PAD;
  protected readonly hoverIndex = signal<number | null>(null);
  protected readonly gradientId = computed(
    () => `area-gradient-${Math.round(Math.random() * 1e9)}`,
  );

  protected readonly points = computed(() => {
    const data = this.data();
    if (!data.length) return [];
    const values = data.map((d) => d.value);
    const max = Math.max(...values, 1);
    const min = Math.min(0, ...values);
    const plotWidth = WIDTH - PAD.left - PAD.right;
    const plotHeight = HEIGHT - PAD.top - PAD.bottom;
    const range = max - min || 1;
    return data.map((d, i) => ({
      x: PAD.left + (data.length === 1 ? plotWidth / 2 : (i / (data.length - 1)) * plotWidth),
      y: PAD.top + plotHeight - ((d.value - min) / range) * plotHeight,
      label: d.label,
      value: d.value,
    }));
  });

  protected readonly linePath = computed(() =>
    this.points()
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' '),
  );

  protected readonly areaPath = computed(() => {
    const pts = this.points();
    if (!pts.length) return '';
    const baseline = HEIGHT - PAD.bottom;
    return `${this.linePath()} L ${pts[pts.length - 1].x.toFixed(1)},${baseline} L ${pts[0].x.toFixed(1)},${baseline} Z`;
  });

  protected readonly gridlines = computed(() => {
    const plotHeight = HEIGHT - PAD.top - PAD.bottom;
    return [0, 0.5, 1].map((f) => ({ y: PAD.top + plotHeight * f }));
  });

  protected readonly firstLabel = computed(() => this.data()[0]?.label ?? '');
  protected readonly lastLabel = computed(() => this.data().at(-1)?.label ?? '');

  protected readonly hovered = computed(() => {
    const index = this.hoverIndex();
    const pts = this.points();
    if (index === null || !pts[index]) return null;
    const format = this.valueFormatter();
    const p = pts[index];
    return { x: p.x, y: p.y, label: p.label, formattedValue: format(p.value) };
  });

  protected onPointerMove(event: PointerEvent): void {
    const svg = event.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const localX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    const pts = this.points();
    if (!pts.length) return;
    let nearest = 0;
    let nearestDist = Infinity;
    pts.forEach((p, i) => {
      const dist = Math.abs(p.x - localX);
      if (dist < nearestDist) {
        nearest = i;
        nearestDist = dist;
      }
    });
    this.hoverIndex.set(nearest);
  }
}
