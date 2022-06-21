import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { LogoutAction } from './store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private autoLogoutTimer?: number;

  constructor(
    private readonly store: Store<AppState>
  ) { }

  public setLogoutTimer(expirationDuration: number) {
    this.autoLogoutTimer = setTimeout(() => this.store.dispatch(new LogoutAction()), expirationDuration) as any;
  }

  public clearLogoutTimer() {
    clearTimeout(this.autoLogoutTimer);
    this.autoLogoutTimer = undefined;
  }
}
