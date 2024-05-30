import {inject} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest
} from '@angular/common/http';
import {NotificationService} from '../../services/notification.service';
import { catchError, Observable } from 'rxjs';
import {Router} from "@angular/router";


export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const notification = inject(NotificationService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      notification.error(error.statusText);
      if (error.status === 404) {
        router.navigate(['/404']);
      }
      throw error; // Rethrow the error after logging it
    }),
  );
}
