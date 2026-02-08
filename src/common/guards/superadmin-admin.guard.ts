import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const superadminAdminGuard: CanActivateFn = () => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  if (!authSvc.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (!authSvc.isSuperUser() && !authSvc.isAdmin()) {
    return router.createUrlTree(['/forbidden']);
  }

  return true;
};
