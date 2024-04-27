import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {HttpClientModule} from "@angular/common/http";
import {provideNativeDateAdapter} from "@angular/material/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes), importProvidersFrom(HttpClientModule), provideNativeDateAdapter(), importProvidersFrom(BrowserAnimationsModule), provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })],
};
