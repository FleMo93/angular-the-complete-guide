import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

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

@Injectable()
export class AuthEffects {
  private readonly signUpUri = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.fireabase.apiKey}`;
  private readonly loginUri = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.fireabase.apiKey}`;

  private authSignup = createEffect(() => this.actions.pipe(
    ofType(AuthActions.Actions.SignupStart),
    switchMap((authData: AuthActions.SignupStart) => {
      const body: BaseRequestBody = {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      };
      return this.http.post<BaseResponseBody>(this.signUpUri, body)
        .pipe(
          map(this.handleAuthentication),
          catchError(this.handleError));
    })
  ));

  private authLogin = createEffect(() => this.actions.pipe(
    ofType(AuthActions.Actions.AuthenticateStart),
    switchMap((authData: AuthActions.AuthenticateStart) => {
      const body: BaseRequestBody = {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      };
      return this.http.post<LoginResponseBody>(this.loginUri, body)
        .pipe(
          map(this.handleAuthentication),
          catchError(this.handleError));
    })
  ));

  private authRedirect = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActions.Actions.Login),
      tap(() => this.router.navigate(['/recipes']))),
    { dispatch: false });

  private authLogout = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActions.Actions.Logout),
      tap(() => {
        this.router.navigate(['/auth'])
        this.logout();
      })
    ), { dispatch: false });

  private autoLogin = createEffect(() => this.actions.pipe(
    ofType(AuthActions.Actions.AutoLogin),
    map(() => {
      const userDataString = localStorage.getItem('user-data');
      if (!userDataString) {
        const action: Action = { type: '[Auth] None' };
        return action;
      }
      const userData = JSON.parse(userDataString);
      const expirationDate = new Date(userData.tokenExpirationDate);
      const user = new User(userData.email, userData.id, userData._token, expirationDate);
      this.authService.setLogoutTimer(expirationDate.getTime() - Date.now());
      return new AuthActions.LoginAction(user);
      // return true;
    })
  ));

  constructor(
    private actions: Actions,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  private handleAuthentication = (resp: BaseResponseBody): AuthActions.LoginAction => {
    const expirationDate = new Date(new Date().getTime() + +resp.expiresIn * 1000);
    const user = new User(resp.email, resp.localId, resp.idToken, expirationDate);

    this.authService.setLogoutTimer(+resp.expiresIn * 1000);
    localStorage.setItem('user-data', JSON.stringify(user));
    return new AuthActions.LoginAction(user);
  }

  private logout = () => {
    localStorage.removeItem('user-data');
    this.authService.clearLogoutTimer();
  }

  private handleError(err: any): Observable<AuthActions.AuthenticateFail> {
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

    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
}