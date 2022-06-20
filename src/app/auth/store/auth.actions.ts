import { Action } from "@ngrx/store";
import { User } from "../user.model";

export enum Actions {
  Login = '[Auth] Login',
  Logout = '[Auth] Logout'
}

export class LoginAction implements Action {
  public readonly type = Actions.Login;
  public readonly user: User;

  constructor(user: User);
  constructor(mail: string, id: string, _token: string, tokenExpirationDate: Date);
  constructor(mailOrUser: User | string, id?: string, token?: string, tokenExpirationDate?: Date) {
    if (typeof mailOrUser === 'object')
      this.user = new User(mailOrUser.email, mailOrUser.id, mailOrUser.token ?? '', mailOrUser.tokenExpirationDate);
    else if (id && token && tokenExpirationDate)
      this.user = new User(mailOrUser, id, token, tokenExpirationDate);
    else
      throw Error('Invalid constructor call');
  }

}

export class LogoutAction implements Action {
  public readonly type = Actions.Logout;
}

export type AuthActions = LoginAction | LogoutAction;