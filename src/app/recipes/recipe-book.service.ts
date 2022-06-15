import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeBookService {
  public recipesChanged = new Subject<Recipe[]>();
  private _recipes: Recipe[] = [];

  public get recipes(): Recipe[] { return this._recipes.slice(); }

  constructor() { }

  public setRecipes(recipes: Recipe[]): void {
    this._recipes.splice(0, this._recipes.length, ...recipes);
    this.recipesChanged.next(this.recipes);
  }

  public getRecipeById(id: number): Recipe {
    const recipe = this.recipes.find((recipe) => recipe.id === id);
    if (!recipe) throw Error('Recipe does not exist');
    return recipe;
  }

  public addRecipe(recipe: Recipe): Recipe {
    const nextId = this._recipes.length === 0 ? 0 : this._recipes.sort((a, b) => a.id > b.id ? -1 : 1)[0].id + 1;
    recipe.id = nextId;
    this._recipes.push(recipe);
    this.recipesChanged.next(this.recipes);
    return recipe;
  }

  public updateRecipe(id: number, recipe: Recipe): Recipe {
    const target = this._recipes.find((recipe) => recipe.id === id);
    if (!target) throw Error(`Recipe with id ${id} does not exist`);
    target.description = recipe.description;
    target.imagePath = recipe.imagePath;
    target.name = recipe.name;
    target.ingredients.splice(0, target.ingredients.length, ...recipe.ingredients);
    this.recipesChanged.next(this.recipes);
    return target;
  }

  public deleteRecipe(id: number): void {
    const target = this._recipes.findIndex((recipe) => recipe.id === id);
    if (target === -1) throw Error(`Recipe with id ${id} does not exist`);
    this._recipes.splice(target, 1);
    this.recipesChanged.next(this.recipes);
  }
}
