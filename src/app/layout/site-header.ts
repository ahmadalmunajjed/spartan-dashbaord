import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { RouterStateService } from '../core/router-state.service';
import { DirectionToggle } from './direction-toggle';
import { ThemeToggle } from './theme-toggle';

@Component({
  selector: 'app-site-header',
  imports: [HlmSidebarImports, HlmSeparatorImports, HlmBreadcrumbImports, ThemeToggle, DirectionToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="hidden h-16 shrink-0 items-center gap-2 md:flex">
      <div class="flex items-center gap-2 px-4">
        <button hlmSidebarTrigger></button>
        <hlm-separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
        <nav hlmBreadcrumb>
          <ol hlmBreadcrumbList>
            @for (crumb of routerState.breadcrumbs(); track crumb.label; let last = $last) {
              @if (!last && crumb.link) {
                <li hlmBreadcrumbItem class="hidden sm:block">
                  <a hlmBreadcrumbLink [link]="crumb.link">{{ crumb.label }}</a>
                </li>
                <li hlmBreadcrumbSeparator class="hidden sm:block"></li>
              } @else if (!last) {
                <li hlmBreadcrumbItem class="hidden sm:block">{{ crumb.label }}</li>
                <li hlmBreadcrumbSeparator class="hidden sm:block"></li>
              } @else {
                <li hlmBreadcrumbItem>
                  <span hlmBreadcrumbPage>{{ crumb.label }}</span>
                </li>
              }
            }
          </ol>
        </nav>
      </div>

      <div class="ms-auto flex items-center gap-2 px-4">
        <app-theme-toggle />
        <app-direction-toggle />
      </div>
    </header>
  `,
})
export class SiteHeader {
  protected readonly routerState = inject(RouterStateService);
}
