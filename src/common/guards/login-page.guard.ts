import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginPageGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const AUTH_KEY = localStorage.getItem('RLCCAT');

  if (AUTH_KEY) {
    router.navigate(['/dashboard']);
  }

  return true;
};
