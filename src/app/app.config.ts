import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideSpartanHlm } from '@spartan-ng/helm/utils';

import { routes } from './app.routes';
import { onRouteViewTransitionCreated } from './core/route-transition';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: onRouteViewTransitionCreated,
      }),
    ),
    provideSpartanHlm()
  ]
};
