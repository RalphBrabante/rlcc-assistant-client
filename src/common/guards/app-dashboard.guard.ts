import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, take } from 'rxjs';

export const appDashboardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authSvc = inject(AuthService);

  if (authSvc.isLoggedIn()) {
    return true;
  }

  return authSvc.verifyToken().pipe(
    take(1),
    map((resp) => {
      const token = resp.data.token.token;
      localStorage.setItem('RLCCAT', token);
      return true;
    }),
    catchError(() => {
      localStorage.removeItem('RLCCAT');
      return of(router.createUrlTree(['/login']));
    })
  );
};
