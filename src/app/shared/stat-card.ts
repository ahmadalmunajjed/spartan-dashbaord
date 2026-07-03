import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingDown, lucideTrendingUp } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-stat-card',
  imports: [HlmCardImports, NgIcon],
  providers: [provideIcons({ lucideTrendingUp, lucideTrendingDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div hlmCard class="p-4">
      <div class="flex items-start justify-between gap-2">
        <span class="text-muted-foreground text-sm">{{ label() }}</span>
        <span
          class="flex size-9 shrink-0 items-center justify-center rounded-lg"
          [style.background]="chipBackground()"
          [style.color]="'var(' + colorVar() + ')'"
        >
          <ng-icon [name]="icon()" class="text-base" />
        </span>
      </div>
      <div class="mt-2 text-2xl font-semibold">{{ value() }}</div>
      @if (delta(); as d) {
        <div
          class="mt-1 flex items-center gap-1 text-xs font-medium"
          [class.text-success]="deltaPositive()"
          [class.text-destructive]="!deltaPositive()"
        >
          <ng-icon [name]="deltaPositive() ? 'lucideTrendingUp' : 'lucideTrendingDown'" />
          {{ d }}
          <span class="text-muted-foreground font-normal">vs last period</span>
        </div>
      }
    </div>
  `,
})
export class StatCard {
  public readonly label = input.required<string>();
  public readonly value = input.required<string>();
  public readonly delta = input<string>();
  public readonly deltaPositive = input<boolean>(true);
  public readonly icon = input.required<string>();
  public readonly colorVar = input.required<string>();

  protected readonly chipBackground = computed(
    () => `color-mix(in oklab, var(${this.colorVar()}) 15%, transparent)`,
  );
}
