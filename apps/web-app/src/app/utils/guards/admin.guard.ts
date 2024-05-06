import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../../services/auth.service";
import {map, take, timeout} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  //TOOD: IMPLENMENT ROLE BASED LOGIC
  return authService.user$.pipe(
    takeUntilDestroyed(),
    timeout(5000),
    take(1), map(user => {
      return user ? !!user : router.createUrlTree(['/403']);
    }))

}


