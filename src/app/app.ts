import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar } from './layout/app-sidebar';
import { MobileHeader } from './layout/mobile-header';
import { MobileTabBar } from './layout/mobile-tab-bar';
import { SiteHeader } from './layout/site-header';

@Component({
  selector: 'app-root',
  imports: [HlmSidebarImports, AppSidebar, SiteHeader, MobileHeader, MobileTabBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
