import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
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
            <li hlmBreadcrumbItem class="hidden sm:block">
              <a hlmBreadcrumbLink link="/">Building Your Application</a>
            </li>
            <li hlmBreadcrumbSeparator class="hidden sm:block"></li>
            <li hlmBreadcrumbItem>
              <span hlmBreadcrumbPage>Data Fetching</span>
            </li>
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
export class SiteHeader {}
