import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AmountType, Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  ingredientSelected = new Subject<Ingredient>();

  private _ingredients: Ingredient[] = [
    new Ingredient('Apple', 5, AmountType.Piece),
    new Ingredient('Tomatoes', 8, AmountType.Piece)
  ];

  public get ingredients(): Ingredient[] { return this._ingredients.slice(); }

  constructor() { }

  public addIngredient(...ingredients: Ingredient[]): void {
    for(let ingredient of ingredients)
      this._ingredients.push(ingredient);
    this.ingredientsChanged.next(this._ingredients.slice());
  }

  public deleteIngredient(ingredient: Ingredient): void {
    const index = this._ingredients.indexOf(ingredient);
    if(index === -1) throw Error('Ingredient not found');
    this._ingredients.splice(index, 1);
    this.ingredientsChanged.next(this._ingredients.slice());
  }
}
