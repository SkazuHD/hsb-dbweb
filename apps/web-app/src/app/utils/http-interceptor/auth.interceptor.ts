import {Injectable} from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {AuthService} from '../../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.auth.user()) return next.handle(req);

    return next.handle(req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.idToken()}`,
      },
    }));

  }
}
