import {ApplicationConfig, importProvidersFrom, isDevMode,} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {appRoutes} from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import {provideNativeDateAdapter} from '@angular/material/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthInterceptor} from './utils/http-interceptor/auth.interceptor';
import {ErrorInterceptor} from './utils/http-interceptor/error.interceptor';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {provideServiceWorker} from '@angular/service-worker';
import {AuthService} from "./services/auth.service";


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    {provide: AuthService},
    provideHttpClient(),
    provideNativeDateAdapter(),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyAQ2p-heYZkI-vhLOuEoZB3dtLnM-Xcd_Y",
        authDomain: "hsb-dbweb.firebaseapp.com",
        databaseURL: "https://hsb-dbweb-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "hsb-dbweb",
        storageBucket: "hsb-dbweb.appspot.com",
        messagingSenderId: "1077398966955",
        appId: "1:1077398966955:web:dca523d5dacb0218cd5dee",
        measurementId: "G-1TGBM1YNWY"
      }),
    ),
    provideAuth(() => getAuth()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    importProvidersFrom(BrowserAnimationsModule),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
};
