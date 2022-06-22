import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs";
import { AppState } from "src/app/store/app.reducer";
import { environment } from "src/environments/environment";
import { Recipe } from "../recipe.model";
import * as RecipeActions from './recipe.actions';

@Injectable()
export class RecipeEffects {
  private readonly url = `${environment.fireabase.api}/recipes.json`;

  public fetchRecipes = createEffect(() => this.actions.pipe(
    ofType(RecipeActions.Actions.FetchRecipes),
    switchMap(() => this.http.get<Recipe[] | undefined>(this.url)
      .pipe(
        map((resp) => {
          if (!resp)
            return [];

          return resp.map((recipe) => {
            if (!recipe.ingredients)
              recipe.ingredients = [];
            return recipe;
          })
        }))),
    map((rec) => new RecipeActions.SetRecipesAction(rec))
  ));

  private storeRecipes = createEffect(() => this.actions.pipe(
    ofType(RecipeActions.Actions.StoreRecipes),
    withLatestFrom(this.store.select('recipe')),
    switchMap(([, state]) => this.http.put<Recipe[]>(this.url, state.recipes))
  ), { dispatch: false })

  constructor(
    private readonly actions: Actions,
    private readonly http: HttpClient,
    private readonly store: Store<AppState>,
  ) { }
}