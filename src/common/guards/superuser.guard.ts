import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const superuserGuard: CanActivateFn = () => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  if (!authSvc.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (!authSvc.isSuperUser()) {
    return router.createUrlTree(['/forbidden']);
  }

  return true;
};
