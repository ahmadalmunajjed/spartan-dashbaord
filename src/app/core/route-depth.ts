import type { ActivatedRouteSnapshot } from '@angular/router';
import type { Breadcrumb } from './models';

export function leafBreadcrumb(snapshot: ActivatedRouteSnapshot): Breadcrumb[] {
  let route = snapshot;
  while (route.firstChild) {
    route = route.firstChild;
  }
  return (route.data['breadcrumb'] as Breadcrumb[] | undefined) ?? [];
}
