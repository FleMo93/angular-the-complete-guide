import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { LoginAction, LogoutAction } from './store/auth.actions';

type BaseRequestBody = {
  email: string;
  password: string;
  returnSecureToken: boolean;
}

export type BaseResponseBody = {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export type LoginResponseBody = BaseResponseBody & {
  registered: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly signUpUri = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.fireabase.apiKey}`;
  private readonly loginUri = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.fireabase.apiKey}`;

  private autoLogoutTimer?: number;

  constructor(
    private readonly http: HttpClient,
    private readonly store: Store<AppState>
  ) { }

  public signup = (email: string, password: string) => {
    const body: BaseRequestBody = {
      email,
      password,
      returnSecureToken: true
    };
    return this.http.post<BaseResponseBody>(this.signUpUri, body)
      .pipe(catchError(this.handleError),
        tap(this.handleAuthentication));
  }

  public login = (email: string, password: string) => {
    const body: BaseRequestBody = {
      email,
      password,
      returnSecureToken: true
    };
    return this.http.post<LoginResponseBody>(this.loginUri, body)
      .pipe(catchError(this.handleError),
        tap(this.handleAuthentication));
  }

  public logout = () => {
    this.store.dispatch(new LogoutAction());
    localStorage.removeItem('user-data');

    if (this.autoLogoutTimer != undefined)
      clearTimeout(this.autoLogoutTimer);
  }

  private handleAuthentication = (resp: BaseResponseBody) => {
    const expirationDate = new Date(new Date().getTime() + +resp.expiresIn * 1000);
    const user = new User(resp.email, resp.localId, resp.idToken, expirationDate);

    this.autoLogout(+resp.expiresIn * 1000);
    localStorage.setItem('user-data', JSON.stringify(user));

    this.store.dispatch(new LoginAction(user));
  }

  private handleError(err: any) {
    return throwError(() => {
      let errorMessage = 'An unknown error occured';
      if (err.error?.error?.message !== undefined)
        switch (err.error.error.message) {
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'E-Mail not found';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'Invalid password';
            break;
          case 'USER_DISABLED':
            errorMessage = 'User is disabled';
            break;
          case 'EMAIL_EXISTS':
            errorMessage = 'E-Mail already exists';
            break;
        }

      return errorMessage;
    });
  }

  public autoLogin(): boolean {
    const userDataString = localStorage.getItem('user-data');
    if (!userDataString) return false;
    const userData = JSON.parse(userDataString);
    const expirationDate = new Date(userData.tokenExpirationDate);
    const user = new User(userData.email, userData.id, userData._token, expirationDate);
    if (!user.token) return false;
    this.store.dispatch(new LoginAction(user));
    this.autoLogout(expirationDate.getTime() - Date.now());
    return true;
  }

  private autoLogout(expirationDuration: number) {
    this.autoLogoutTimer = setTimeout(() => this.logout(), expirationDuration) as any;
  }
}
