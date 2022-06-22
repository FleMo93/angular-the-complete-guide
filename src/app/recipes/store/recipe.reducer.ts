import { Action, ActionReducer } from "@ngrx/store"
import { Recipe } from "../recipe.model";
import * as RecipeActions from "./recipe.actions";

export type StoreState = {
  recipes: Recipe[];
}

const initialState: StoreState = {
  recipes: []
}

export const recipeReducer: ActionReducer<StoreState, Action | RecipeActions.RecipeActions> = (state = initialState, action) => {
  switch (action.type) {
    case RecipeActions.Actions.AddRecipe: {
      const nextId = state.recipes.length === 0 ? 0 : state.recipes.sort((a, b) => a.id > b.id ? -1 : 1)[0].id + 1;
      const newRecipe = (action as RecipeActions.AddRecipeAction).payload;
      newRecipe.id = nextId;
      return {
        ...state,
        recipes: [...state.recipes, newRecipe]
      };
    }
    case RecipeActions.Actions.DeleteRecipe:
      return {
        ...state,
        recipes: state.recipes.filter((rec) => rec.id === (action as RecipeActions.DeleteRecipeAction).id)
      }
    case RecipeActions.Actions.UpdateRecipe: {
      const updateAction = (action as RecipeActions.UpdateRecipeAction);
      return {
        ...state,
        recipes: state.recipes.map((rec) => {
          if (rec.id === updateAction.recipe.id)
            return updateAction.recipe;
          else
            return rec;
        })
      }
    }
    case RecipeActions.Actions.SetRecipes:
      return {
        ...state,
        recipes: [...(action as RecipeActions.SetRecipesAction).payload]
      }
    default:
      return state;
  }
}