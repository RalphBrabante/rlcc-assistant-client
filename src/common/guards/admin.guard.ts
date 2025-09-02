import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  const userRoles = authSvc.getRoles();

  if (
    !userRoles.includes('SUPERUSER') ||
    userRoles.includes('ADMINISTRATOR') ||
    userRoles.includes('ACCOUNTANT')
  ) {
    router.navigate(['forbidden']);
    return false;
  } else {
    return true;
  }
};
