import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private readonly authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      map<User | null, Observable<HttpEvent<any>>>((user) => {
        if (user && user.token) {
          req = req.clone({
            params: req.params.set('auth', user.token)
          });
        };
        return next.handle(req);
      }),
      switchMap((req) => req)
    );
  }
}
