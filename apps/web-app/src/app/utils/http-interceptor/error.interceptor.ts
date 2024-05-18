import {inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {NotificationService} from '../../services/notification.service';
import {catchError} from 'rxjs';
import {Router} from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  notification: NotificationService = inject(NotificationService);
  router: Router = inject(Router);

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notification.error(error.statusText);
        if (error.status === 404) {
          this.router.navigate(['/404']);
        }
        throw error; // Rethrow the error after logging it
      }),
    );
  }
}
