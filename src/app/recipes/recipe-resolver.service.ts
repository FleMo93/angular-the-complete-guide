import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, find, reduce, map } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeBookService } from './recipe-book.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe> {

  constructor(
    private readonly recipeService: RecipeBookService,
    private readonly dataStorageService: DataStorageService
  ) { }

  private getRecipeFromArray(id: number, recipes: Recipe[]): Recipe {
    const recipe = recipes.find((recipe) => recipe.id === id)
    if (!recipe) throw Error(`Recipe with id ${id} not found`);
    return recipe;
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Recipe | Observable<Recipe> | Promise<Recipe> {
    const id = +route.params['id'];
    if (this.recipeService.recipes.length !== 0)
      return this.getRecipeFromArray(id, this.recipeService.recipes);

    return this.dataStorageService.fetchRecipes()
      .pipe(map((recipes) => this.getRecipeFromArray(id, recipes)));
  }
}
