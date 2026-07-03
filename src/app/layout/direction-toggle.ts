import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { DirectionService } from '../core/direction.service';

@Component({
  selector: 'app-direction-toggle',
  imports: [HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      hlmBtn
      variant="ghost"
      size="icon-sm"
      type="button"
      class="text-xs font-semibold"
      [attr.aria-label]="direction.locale() === 'ar' ? 'Switch to English' : 'Switch to Arabic'"
      (click)="direction.toggle()"
    >
      {{ _nextLabel() }}
    </button>
  `,
})
export class DirectionToggle {
  protected readonly direction = inject(DirectionService);
  protected readonly _nextLabel = computed(() => (this.direction.locale() === 'ar' ? 'EN' : 'AR'));
}
