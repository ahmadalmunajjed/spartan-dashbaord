import type { ActivatedRouteSnapshot, ViewTransitionInfo } from '@angular/router';
import { leafBreadcrumb } from './route-depth';

export type RouteTransitionKind = 'tab-fade' | 'push-forward' | 'push-back';

let transitionSeq = 0;

function routeDepth(snapshot: ActivatedRouteSnapshot): number {
  return leafBreadcrumb(snapshot).length;
}

export function routeTransitionKind(
  from: ActivatedRouteSnapshot,
  to: ActivatedRouteSnapshot,
): RouteTransitionKind {
  const fromDepth = routeDepth(from);
  const toDepth = routeDepth(to);
  if (toDepth === fromDepth) return 'tab-fade';
  return toDepth > fromDepth ? 'push-forward' : 'push-back';
}

export function onRouteViewTransitionCreated({ transition, from, to }: ViewTransitionInfo): void {
  const kind = routeTransitionKind(from, to);
  const html = document.documentElement;
  const seq = ++transitionSeq;
  html.setAttribute('data-transition', kind);

  transition.finished.finally(() => {
    if (seq === transitionSeq) {
      html.removeAttribute('data-transition');
    }
  });
}
