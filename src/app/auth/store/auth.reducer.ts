import { Action, ActionReducer } from "@ngrx/store";
import { User } from "../user.model";
import { Actions, AuthActions, LoginAction, AuthenticateFail } from "./auth.actions";

export type StoreState = {
  user: User | null;
  authError?: string;
  loading: boolean;
}

const initialState: StoreState = {
  user: null,
  loading: false,
}

export const authReducer: ActionReducer<StoreState, Action | AuthActions> = (
  state = initialState,
  action
): StoreState => {
  switch (action.type) {
    case Actions.Login:
      return {
        ...state,
        user: (action as LoginAction).user,
        authError: undefined,
        loading: false
      };
    case Actions.Logout:
      return {
        ...state,
        user: null,
        authError: undefined,
        loading: false
      };
    case Actions.AuthenticateStart:
    case Actions.SignupStart:
      return {
        ...state,
        authError: undefined,
        loading: true
      };
    case Actions.AuthenticateFail:
      return {
        ...state,
        user: null,
        authError: (action as AuthenticateFail).payload,
        loading: false
      }
    case Actions.HandleError:
      return {
        ...state,
        authError: undefined
      };
    default:
      return state;
  }
}