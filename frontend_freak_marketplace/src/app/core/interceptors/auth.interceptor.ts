import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Clonamos la petición para añadir 'withCredentials'
    // Esto es lo que permite que el navegador envíe las Cookies al backend de Django
    const authReq = req.clone({
      withCredentials: true
    });

    return next.handle(authReq).pipe(
      catchError(error => {
        // Si el backend devuelve 401 (No autorizado), limpiamos el estado en Angular
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
