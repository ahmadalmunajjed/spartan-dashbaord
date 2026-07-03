import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucideLayoutDashboard, lucidePackage, lucideShoppingCart } from '@ng-icons/lucide';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { RouterStateService } from '../core/router-state.service';
import { MobileMoreMenu } from './mobile-more-menu';
import { sidebarData } from './sidebar-data';

@Component({
  selector: 'app-mobile-tab-bar',
  imports: [NgIcon, HlmSheetImports, RouterLink, MobileMoreMenu],
  providers: [
    provideIcons({ lucideLayoutDashboard, lucidePackage, lucideShoppingCart, lucideEllipsis }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      aria-label="Primary"
      class="bg-background fixed inset-x-0 bottom-0 z-10 flex h-16 items-stretch border-t md:hidden"
    >
      @for (item of items; track item.title) {
        <a
          [routerLink]="item.url"
          class="flex flex-1 flex-col items-center justify-center gap-1 text-xs"
          [class.text-sidebar-primary]="isActive(item.url)"
          [class.text-muted-foreground]="!isActive(item.url)"
          [attr.aria-current]="isActive(item.url) ? 'page' : null"
        >
          <ng-icon [name]="item.icon" class="text-lg" />
          {{ item.title }}
        </a>
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
  private readonly routerState = inject(RouterStateService);

  protected readonly items = sidebarData.navMain;

  protected isActive(url: string): boolean {
    const current = this.routerState.url();
    return url === '/' ? current === '/' : current.startsWith(url);
  }
}
