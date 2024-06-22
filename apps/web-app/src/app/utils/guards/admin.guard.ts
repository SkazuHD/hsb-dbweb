import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../../services/auth.service";
import {filter, map, take, timeout} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UserRole} from "@hsb-dbweb/shared";


export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.accessToken$.pipe(
    takeUntilDestroyed(),
    timeout(10000),
    filter(token => token !== null && token !== undefined),
    take(1), map(token => {
      return authService.getRoleClaims(token) === UserRole.ADMIN ? true : router.createUrlTree(['/403']);
    }))

}


