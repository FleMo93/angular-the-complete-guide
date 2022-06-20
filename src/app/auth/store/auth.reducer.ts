import { Action, ActionReducer } from "@ngrx/store";
import { User } from "../user.model";
import { Actions, AuthActions, LoginAction } from "./auth.actions";

export type StoreState = {
  user: User | null;
}

const initialState: StoreState = {
  user: null
}

export const authReducer: ActionReducer<StoreState, Action | AuthActions> = (
  state = initialState,
  action
): StoreState => {
  switch (action.type) {
    case Actions.Login:
      return {
        ...state,
        user: (action as LoginAction).user
      };
    case Actions.Logout:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}