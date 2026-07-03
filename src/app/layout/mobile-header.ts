import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCommand } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

@Component({
  selector: 'app-mobile-header',
  imports: [NgIcon, HlmBadgeImports],
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
      <span hlmBadge variant="secondary" class="ml-auto">Beta</span>
    </header>
  `,
})
export class MobileHeader {}
