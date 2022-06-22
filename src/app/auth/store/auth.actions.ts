import { Action } from "@ngrx/store";
import { User } from "../user.model";

export enum Actions {
  AuthenticateStart = '[Auth] Authenticate Start',
  AuthenticateFail = '[Auth] Authenticate Fail',
  AuthenticationSuccess = '[Auth] AuthenticationSuccess',
  Logout = '[Auth] Logout',
  SignupStart = '[Auth] Signup Start',
  Signup = '[Auth] Signup',
  HandleError = '[Auth] Handle Error',
  AutoLogin = '[Auth] Auto Login'
}

export type LoginStartPayload = { email: string, password: string };
export class AuthenticateStart implements Action {
  public readonly type: Actions = Actions.AuthenticateStart;
  public payload!: { email: string, password: string };

  constructor(mail: string, password: string);
  constructor(payload: LoginStartPayload);
  constructor(mailOrPayload: string | LoginStartPayload, password?: string) {
    if (typeof mailOrPayload === 'string' && password) {
      this.payload = {
        email: mailOrPayload,
        password: password
      };
    } else if (typeof mailOrPayload === 'object') {
      this.payload = {
        email: mailOrPayload.email,
        password: mailOrPayload.password
      };
    } else {
      throw Error('Invalid constructor call');
    }
  }
}

export class AuthenticationSuccessAction implements Action {
  public readonly type = Actions.AuthenticationSuccess;
  public readonly user: User;
  public readonly redirect: boolean;

  constructor(user: User, redirect: boolean);
  constructor(mail: string, id: string, _token: string, tokenExpirationDate: Date, redirect?: boolean);
  constructor(mailOrUser: User | string, idOrRedirect?: string | boolean, token?: string, tokenExpirationDate?: Date, redirect?: boolean) {
    if (typeof mailOrUser === 'object') {
      this.user = new User(mailOrUser.email, mailOrUser.id, mailOrUser.token ?? '', mailOrUser.tokenExpirationDate);
      this.redirect = !!idOrRedirect;
    }
    else if (typeof mailOrUser === 'string' && typeof idOrRedirect === 'string' && token && tokenExpirationDate && redirect) {
      this.user = new User(mailOrUser, idOrRedirect, token, tokenExpirationDate);
      this.redirect = redirect;
    }
    else
      throw Error('Invalid constructor call');
  }

}

export class LogoutAction implements Action {
  public readonly type = Actions.Logout;
}

export class AuthenticateFail implements Action {
  public readonly type = Actions.AuthenticateFail;
  constructor(
    public readonly payload: string
  ) { }
}

export class SignupStart extends AuthenticateStart {
  public override type = Actions.SignupStart;
};

export class HandleError implements Action {
  public readonly type = Actions.HandleError;
}

export class AutoLogin implements Action {
  public readonly type = Actions.AutoLogin;
}

export type AuthActions =
  AuthenticationSuccessAction
  | LogoutAction
  | AuthenticateStart
  | AuthenticateFail
  | SignupStart
  | HandleError
  | AutoLogin;