import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  if (!authSvc.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const userRoles = authSvc.getRoles();
  const hasAccess =
    userRoles.includes('SUPERUSER') ||
    userRoles.includes('ADMINISTRATOR') ||
    userRoles.includes('ACCOUNTANT');

  if (!hasAccess) {
    return router.createUrlTree(['/forbidden']);
  }

  return true;
};
