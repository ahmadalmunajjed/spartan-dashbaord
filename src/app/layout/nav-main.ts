import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideLayoutDashboard,
  lucidePackage,
  lucideShoppingCart,
} from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import type { NavMainItem } from './sidebar-data';

@Component({
  selector: 'app-nav-main',
  imports: [HlmSidebarImports, NgIcon, HlmCollapsibleImports, RouterLink, RouterLinkActive],
  providers: [
    provideIcons({ lucideLayoutDashboard, lucidePackage, lucideShoppingCart, lucideChevronRight }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-sidebar-group>
      <div hlmSidebarGroupLabel>Platform</div>
      <ul hlmSidebarMenu>
        @for (item of items(); track item.title) {
          <li
            hlmSidebarMenuItem
            routerLinkActive
            [routerLinkActiveOptions]="{ exact: item.url === '/' }"
            #topLink="routerLinkActive"
          >
            <hlm-collapsible [expanded]="topLink.isActive">
              <a hlmSidebarMenuButton [routerLink]="item.url" [isActive]="topLink.isActive">
                <ng-icon [name]="item.icon" />
                {{ item.title }}
              </a>
              @if (item.items; as subItems) {
                <button hlmCollapsibleTrigger hlmSidebarMenuAction class="data-[state=open]:rotate-90">
                  <ng-icon name="lucideChevronRight" />
                </button>
                <hlm-collapsible-content>
                  <ul hlmSidebarMenuSub>
                    @for (subItem of subItems; track subItem.title) {
                      <li hlmSidebarMenuSubItem>
                        <a
                          hlmSidebarMenuSubButton
                          [routerLink]="subItem.url"
                          routerLinkActive
                          [routerLinkActiveOptions]="{ exact: true }"
                          #subLink="routerLinkActive"
                          [isActive]="subLink.isActive"
                        >
                          {{ subItem.title }}
                        </a>
                      </li>
                    }
                  </ul>
                </hlm-collapsible-content>
              }
            </hlm-collapsible>
          </li>
        }
      </ul>
    </hlm-sidebar-group>
  `,
})
export class NavMain {
  public readonly items = input.required<NavMainItem[]>();
}
