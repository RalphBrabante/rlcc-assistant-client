import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const appDashboardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authSvc = inject(AuthService);

  if (authSvc.isLoggedIn()) {
    return true;
  }

  authSvc
    .verifyToken()
    .pipe(
      take(1),
      map((resp) => resp.data.token.token)
    )
    .subscribe({
      next: (token) => {
        localStorage.setItem('RLCCAT', token);
      },
      error: (err) => {
        localStorage.removeItem('RLCCAT');
        router.navigate(['/']);
      },
    });

  return true;
};
