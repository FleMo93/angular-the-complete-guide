import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient, AmountType } from "../../shared/ingredient.model";
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients!: Ingredient[];
  ingredientsChangedSubscription?: Subscription;

  constructor(private readonly shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.ingredients;
    this.ingredientsChangedSubscription =
      this.shoppingListService.ingredientsChanged.subscribe((vl) => this.ingredients = vl);
  }

  ngOnDestroy(): void {
    this.ingredientsChangedSubscription?.unsubscribe();
  }

  selectIngredient(ingredient: Ingredient) {
    this.shoppingListService.ingredientSelected.next(ingredient);
  }
}
