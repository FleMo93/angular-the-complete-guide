import { Action, ActionReducerMap } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";

export enum Actions {
  AddIngredient = 'ADD_INGREDIENT',
  AddIngredients = 'ADD_INGREDIENTS',
  RemoveIngredient = 'REMOVE_INGREDIENT',
  UpdateIngredient = 'UPDATE_INGREDIENT',
  StartEdit = 'START_EDIT',
  StopEdit = 'STOP_EDIT'
}

export class AddIngredientAction implements Action {
  public readonly type = Actions.AddIngredient;
  constructor(
    public payload: Ingredient
  ) { }
}

export class AddIngredientsAction implements Action {
  public readonly type = Actions.AddIngredients;
  constructor(
    public payload: Ingredient[]
  ) { }
}

export class RemoveIngredientAction implements Action {
  public readonly type = Actions.RemoveIngredient;
}

export class UpdateIngredientAction implements Action {
  public readonly type = Actions.UpdateIngredient;
  constructor(
    public payload: { ingredient: Ingredient }
  ) { }
}

export class StartEdit implements Action {
  public readonly type = Actions.StartEdit;
  constructor(
    public payload: number
  ) { }
}

export class StopEdit implements Action {
  public readonly type = Actions.StopEdit;
}

export type ShoppingListActions =
  AddIngredientAction
  | AddIngredientsAction
  | RemoveIngredientAction
  | UpdateIngredientAction
  | StartEdit
  | StopEdit;