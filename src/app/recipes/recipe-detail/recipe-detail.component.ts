import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import { AddIngredientsAction } from 'src/app/shopping-list/store/shopping-list.actions';
import { AppState } from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import { DeleteRecipeAction } from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  @Input() recipe!: Recipe;

  private subscriptionRecipe?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.route.data
      .pipe(take(1))
      .subscribe((data) => {
        this.recipe = data['recipe'];
        this.subscriptionRecipe = this.store.select('recipe').subscribe((state) => {
          const recipe = state.recipes.find((rec) => rec.id === this.recipe.id);
          if (!recipe)
            this.router.navigate(['..'], { relativeTo: this.route });
          else
            this.recipe = recipe;
        });
      })
  }

  ngOnDestroy(): void {
    this.subscriptionRecipe?.unsubscribe();
  }

  addToShoppingList(): void {
    this.store.dispatch(new AddIngredientsAction(this.recipe.ingredients))
  }

  deleteRecipe(): void {
    this.store.dispatch(new DeleteRecipeAction(this.recipe.id));
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
