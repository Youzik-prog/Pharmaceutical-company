import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ChartService } from './services/chart.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      const chartService = inject(ChartService);
      return chartService.registerCharts();
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
