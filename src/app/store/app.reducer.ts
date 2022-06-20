import * as ShoppingListStore from '../shopping-list/store/shopping-list.reducer';
import * as AuthStore from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  shoppingList: ShoppingListStore.StoreState;
  auth: AuthStore.StoreState
}

export const actionReducer: ActionReducerMap<AppState> = {
  shoppingList: ShoppingListStore.shoppingListReducer,
  auth: AuthStore.authReducer
};