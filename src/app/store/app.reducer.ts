import * as ShoppingListStore from '../shopping-list/store/shopping-list.reducer';
import * as AuthStore from '../auth/store/auth.reducer';
import * as RecipeStore from '../recipes/store/recipe.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  shoppingList: ShoppingListStore.StoreState;
  auth: AuthStore.StoreState,
  recipe: RecipeStore.StoreState
}

export const actionReducer: ActionReducerMap<AppState> = {
  shoppingList: ShoppingListStore.shoppingListReducer,
  auth: AuthStore.authReducer,
  recipe: RecipeStore.recipeReducer
};