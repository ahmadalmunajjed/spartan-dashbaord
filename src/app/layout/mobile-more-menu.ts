import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChartPie, lucideFrame, lucideLifeBuoy, lucideMap, lucideSend } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSheetHeader, HlmSheetTitle } from '@spartan-ng/helm/sheet';
import { sidebarData } from './sidebar-data';

@Component({
  selector: 'app-mobile-more-menu',
  imports: [HlmButtonImports, HlmSeparatorImports, HlmAvatarImports, NgIcon, RouterLink, HlmSheetHeader, HlmSheetTitle],
  providers: [provideIcons({ lucideFrame, lucideChartPie, lucideMap, lucideLifeBuoy, lucideSend })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-sheet-header>
      <h3 hlmSheetTitle>More</h3>
    </hlm-sheet-header>

    <div class="flex flex-col gap-1 p-2">
      @for (project of data.projects; track project.name) {
        <a hlmBtn variant="ghost" class="justify-start" [routerLink]="project.url">
          <ng-icon [name]="project.icon" />
          {{ project.name }}
        </a>
      }
    </div>

    <hlm-separator />

    <div class="flex flex-col gap-1 p-2">
      @for (item of data.navSecondary; track item.title) {
        <a hlmBtn variant="ghost" class="justify-start" [routerLink]="item.url">
          <ng-icon [name]="item.icon" />
          {{ item.title }}
        </a>
      }
    </div>

    <hlm-separator />

    <div class="flex items-center gap-2 p-2">
      <hlm-avatar class="rounded-lg">
        <span hlmAvatarFallback>{{ _initials() }}</span>
      </hlm-avatar>
      <div class="grid flex-1 text-start text-sm leading-tight">
        <span class="truncate font-medium">{{ data.user.name }}</span>
        <span class="text-muted-foreground truncate text-xs">{{ data.user.email }}</span>
      </div>
    </div>
  `,
})
export class MobileMoreMenu {
  protected readonly data = sidebarData;

  protected readonly _initials = computed(() =>
    this.data.user.name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );
}
