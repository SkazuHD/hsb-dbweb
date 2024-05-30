import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import { Observable } from 'rxjs';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const auth = inject(AuthService);
  if (!auth.user()) return next(req);
  return next(req.clone({
    setHeaders: {
      Authorization: `Bearer ${auth.idToken()}`,
    },
  }));
}
