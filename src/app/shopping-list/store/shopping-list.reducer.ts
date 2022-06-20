import { Action, ActionReducer } from "@ngrx/store";
import { AmountType, Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface AppState {
  shoppingList: ShoppingListStoreState;
}

export type ShoppingListStoreState = {
  ingredients: Ingredient[],
  editedIngredient: Ingredient | null,
  editedIngredientIndex: number
}

const initialState: ShoppingListStoreState = {
  ingredients: [
    new Ingredient('Apple', 5, AmountType.Piece),
    new Ingredient('Tomatoes', 8, AmountType.Piece)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export const shoppingListReducer: ActionReducer<ShoppingListStoreState, Action | ShoppingListActions.ShoppingListActions> = (
  state = initialState,
  action
): ShoppingListStoreState => {

  switch (action.type) {
    case ShoppingListActions.Actions.AddIngredient:
      return {
        ...state,
        ingredients: [...state.ingredients, (action as ShoppingListActions.AddIngredientAction).payload]
      };
    case ShoppingListActions.Actions.AddIngredients:
      return {
        ...state,
        ingredients: [...state.ingredients, ...(action as ShoppingListActions.AddIngredientsAction).payload]
      }
    case ShoppingListActions.Actions.RemoveIngredient:
      return {
        ...state,
        ingredients: state.ingredients.filter((ing, i) => i !== state.editedIngredientIndex),
        editedIngredient: null,
        editedIngredientIndex: -1
      }
    case ShoppingListActions.Actions.UpdateIngredient:
      const updateAction = action as ShoppingListActions.UpdateIngredientAction;
      const updatedIngredient = new Ingredient(
        updateAction.payload.ingredient.name,
        updateAction.payload.ingredient.amount,
        updateAction.payload.ingredient.amountType,
      );
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIndex: -1
      }
    case ShoppingListActions.Actions.StartEdit:
      return {
        ...state,
        editedIngredient: state.ingredients.filter((ing, i) => i === (action as ShoppingListActions.StartEdit).payload)[0],
        editedIngredientIndex: (action as ShoppingListActions.StartEdit).payload
      }
    case ShoppingListActions.Actions.StopEdit:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      }
    default:
      return state;
  };
}