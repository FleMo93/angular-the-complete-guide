import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AddIngredientsAction } from 'src/app/shopping-list/store/shopping-list.actions';
import { AppState } from 'src/app/shopping-list/store/shopping-list.reducer';
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
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly recipeService: RecipeBookService,
    private readonly store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.recipe = data['recipe'];
    })
  }

  addToShoppingList(): void {
    this.store.dispatch(new AddIngredientsAction(this.recipe.ingredients))
  }

  deleteRecipe(): void {
    this.recipeService.deleteRecipe(this.recipe.id);
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
