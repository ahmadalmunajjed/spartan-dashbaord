import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideEllipsis,
  lucideSettings2,
  lucideSquareTerminal,
  lucideTag,
} from '@ng-icons/lucide';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { MobileMoreMenu } from './mobile-more-menu';
import { sidebarData } from './sidebar-data';

@Component({
  selector: 'app-mobile-tab-bar',
  imports: [NgIcon, HlmSheetImports, MobileMoreMenu],
  providers: [
    provideIcons({ lucideSquareTerminal, lucideTag, lucideSettings2, lucideEllipsis }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      aria-label="Primary"
      class="bg-background fixed inset-x-0 bottom-0 z-10 flex h-16 items-stretch border-t md:hidden"
    >
      @for (item of items; track item.title) {
        <button
          type="button"
          class="flex flex-1 flex-col items-center justify-center gap-1 text-xs"
          [class.text-sidebar-primary]="activeKey() === item.title"
          [class.text-muted-foreground]="activeKey() !== item.title"
          (click)="activeKey.set(item.title)"
        >
          <ng-icon [name]="item.icon" class="text-lg" />
          {{ item.title }}
        </button>
      }

      <hlm-sheet side="bottom" class="contents">
        <button
          hlmSheetTrigger
          type="button"
          class="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-1 text-xs"
        >
          <ng-icon name="lucideEllipsis" class="text-lg" />
          More
        </button>
        <hlm-sheet-content *hlmSheetPortal="let ctx">
          <app-mobile-more-menu />
        </hlm-sheet-content>
      </hlm-sheet>
    </nav>
  `,
})
export class MobileTabBar {
  protected readonly items = sidebarData.navMain;
  protected readonly activeKey = signal(sidebarData.navMain[0].title);
}
