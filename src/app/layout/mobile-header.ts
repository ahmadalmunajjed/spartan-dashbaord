import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCommand } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { DirectionToggle } from './direction-toggle';
import { ThemeToggle } from './theme-toggle';

@Component({
  selector: 'app-mobile-header',
  imports: [NgIcon, HlmBadgeImports, ThemeToggle, DirectionToggle],
  providers: [provideIcons({ lucideCommand })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="bg-sidebar-primary text-sidebar-primary-foreground flex items-center gap-2 px-4 py-3 md:hidden"
    >
      <div class="bg-sidebar-primary-foreground/15 flex aspect-square size-8 items-center justify-center rounded-lg">
        <ng-icon name="lucideCommand" class="text-base" />
      </div>
      <span class="font-medium">Makook</span>
      <div class="ms-auto flex items-center gap-2">
        <app-theme-toggle />
        <app-direction-toggle />
        <span hlmBadge variant="secondary">Beta</span>
      </div>
    </header>
  `,
})
export class MobileHeader {}
