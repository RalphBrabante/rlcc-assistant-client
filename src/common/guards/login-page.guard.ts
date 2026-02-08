import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginPageGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authSvc = inject(AuthService);

  if (authSvc.isLoggedIn()) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
