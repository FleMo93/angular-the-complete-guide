import { Action } from "@ngrx/store"
import { Recipe } from "../recipe.model";

export enum Actions {
  AddRecipe = '[Recipes] Add Recipe',
  DeleteRecipe = '[Recipes] Delete Recipe',
  UpdateRecipe = '[Recipes] Update Recipe',
  SetRecipes = '[Recipes] Set Recipes',
  FetchRecipes = '[Recipes] Fetch Recipes',
  StoreRecipes = '[Recipes] Store Recipes'
}

export class AddRecipeAction implements Action {
  public readonly type = Actions.AddRecipe;
  constructor(
    public payload: Recipe
  ) { }
}

export class DeleteRecipeAction implements Action {
  public readonly type = Actions.DeleteRecipe;
  constructor(
    public id: number
  ) { }
}

export class UpdateRecipeAction implements Action {
  public readonly type = Actions.UpdateRecipe;
  constructor(
    public recipe: Recipe
  ) { }
}

export class SetRecipesAction implements Action {
  public readonly type = Actions.SetRecipes;
  constructor(
    public payload: Recipe[]
  ) { }
}

export class FetchRecipesAction implements Action {
  public readonly type = Actions.FetchRecipes;
}

export class StoreRecipesAction implements Action {
  public readonly type = Actions.StoreRecipes;
}

export type RecipeActions =
  SetRecipesAction
  | DeleteRecipeAction
  | UpdateRecipeAction
  | SetRecipesAction
  | FetchRecipesAction
  | StoreRecipesAction;