import { inject, Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { catchError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  notification: NotificationService = inject(NotificationService);

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notification.error(error.statusText);
        throw error; // Rethrow the error after logging it
      }),
    );
  }
}
