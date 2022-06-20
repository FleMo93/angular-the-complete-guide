import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.store.select('auth').pipe(
      take(1),
      map((v) => v.user),
      map((user: User | null) => {
        if (user) return true;
        return this.router.createUrlTree(['/auth']);
      }));
  }
}
