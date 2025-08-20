import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { dayReducer } from './store/reducers/day.reducer';
import { provideEffects } from '@ngrx/effects';
import { DayEffects } from './store/effects/day.effects';
import { SpinnerInterceptor } from './components/shared/interceptors/spinner.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([SpinnerInterceptor])),
    provideNativeDateAdapter(),
    provideStore({ day: dayReducer }),
    provideEffects([DayEffects])
  ]
};
