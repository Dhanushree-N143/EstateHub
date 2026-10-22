import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  if (!token || !req.url.startsWith('/api')) {
    return next(req);
  }

  const request = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(request).pipe(
    catchError(error => {
      if (error.status === 401) {
        auth.logout();
        if (router.url !== '/login') {
          router.navigateByUrl('/login');
        }
      }
      return throwError(() => error);
    })
  );
};
