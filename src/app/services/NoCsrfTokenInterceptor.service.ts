import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoCsrfTokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Modifica la solicitud aquí si es necesario
    // Por ejemplo, para excluir ciertas rutas de la verificación CSRF
    if (req.url.startsWith('/ruta-exenta-de-csrf')) {
      req = req.clone({
        setHeaders: {
          'X-CSRF-Token': 'false'
        }
      });
    }

    return next.handle(req);
  }
}
