import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { baseUrl } from '../../appConfig';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('RLCCAT');
  const router = inject(Router);
  const isApiRequest = req.url.startsWith(baseUrl) || req.url.startsWith('/api/');
  const setHeaders: Record<string, string> = {};

  if (token) {
    setHeaders['Authorization'] = `Bearer ${token}`;
  }

  if (isApiRequest) {
    // Helps server-side CSRF protections distinguish AJAX requests.
    setHeaders['X-Requested-With'] = 'XMLHttpRequest';
  }

  req = req.clone({
    setHeaders,
    withCredentials: isApiRequest,
  });

  return next(req).pipe(
    catchError((err) => {
      if (err?.status === 401 || err?.status === 403) {
        localStorage.removeItem('RLCCAT');
        if (!router.url.startsWith('/login')) {
          router.navigate(['/login']);
        }
      }

      return throwError(() => err);
    })
  );
};
