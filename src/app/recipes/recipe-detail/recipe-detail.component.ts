import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { RecipeBookService } from '../recipe-book.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipe!: Recipe;

  constructor(
    private readonly shoppingListService: ShoppingListService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly recipeService: RecipeBookService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.recipe = data['recipe'];
    })
  }

  addToShoppingList(): void {
    this.shoppingListService.addIngredient(...this.recipe.ingredients);
  }

  deleteRecipe(): void {
    this.recipeService.deleteRecipe(this.recipe.id);
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
