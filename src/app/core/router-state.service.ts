import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import type { Breadcrumb } from './models';

@Injectable({ providedIn: 'root' })
export class RouterStateService {
  private readonly router = inject(Router);

  private readonly navigation = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.readRouteState()),
    ),
    { initialValue: this.readRouteState() },
  );

  public readonly url = computed(() => this.navigation().url);
  public readonly breadcrumbs = computed(() => this.navigation().breadcrumbs);

  private readRouteState(): { url: string; breadcrumbs: Breadcrumb[] } {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return {
      url: this.router.url,
      breadcrumbs: (route.data['breadcrumb'] as Breadcrumb[] | undefined) ?? [],
    };
  }
}
