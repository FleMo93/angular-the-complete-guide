import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe> {

  constructor(
    private readonly store: Store<AppState>,
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Recipe | Observable<Recipe> | Promise<Recipe> {
    const id = +route.params['id'];

    return this.store.select('recipe').pipe(
      take(1),
      map((state) => {
        return state.recipes.find((rec) => rec.id === id) as Recipe;
      }));
  }
}
