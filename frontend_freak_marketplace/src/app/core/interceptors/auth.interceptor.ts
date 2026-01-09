import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Evitamos llamar a logout si la petición que falló ya era login o logout
      const isAuthPath = req.url.includes('/login') || req.url.includes('/logout');

      if (error.status === 401 && !isAuthPath) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};