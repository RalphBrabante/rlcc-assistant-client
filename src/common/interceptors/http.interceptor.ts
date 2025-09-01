import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('RLCCAT');
  const router = inject(Router);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // return next(req);

  return next(req).pipe(
    catchError((err) => {
      if (err.error.status === 401) {
        // Token invalid or expired
        localStorage.removeItem('RLCCAT');

        // Optionally redirect to login
        router.navigate(['/']);
      }

      return throwError(() => err);
    })
  );
};
