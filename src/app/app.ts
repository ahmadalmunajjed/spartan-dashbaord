import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar } from './layout/app-sidebar';
import { SiteHeader } from './layout/site-header';

@Component({
  selector: 'app-root',
  imports: [HlmSidebarImports, AppSidebar, SiteHeader],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
