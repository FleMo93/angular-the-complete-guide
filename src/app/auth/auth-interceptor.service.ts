import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, switchMap, take } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private readonly store: Store<AppState>
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      map((v) => v.user),
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
