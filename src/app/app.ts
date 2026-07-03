import { Dir } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { DirectionService } from './core/direction.service';
import { PlatformService } from './core/platform.service';
import { AppSidebar } from './layout/app-sidebar';
import { MobileHeader } from './layout/mobile-header';
import { MobileTabBar } from './layout/mobile-tab-bar';
import { SiteHeader } from './layout/site-header';

@Component({
  selector: 'app-root',
  imports: [
    HlmSidebarImports,
    HlmToasterImports,
    AppSidebar,
    SiteHeader,
    MobileHeader,
    MobileTabBar,
    RouterOutlet,
    Dir,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly direction = inject(DirectionService);
  // Unused in the template — injected to eagerly stamp platform-* on <html>
  // before any navigation can occur.
  private readonly platform = inject(PlatformService);
}
