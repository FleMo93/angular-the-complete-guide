import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  private recipeChangedSubscription?: Subscription;

  constructor(
    private readonly store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.recipeChangedSubscription = this.store.select('recipe').subscribe((state) => {
      this.recipes = state.recipes;
    });
  }

  ngOnDestroy(): void {
    this.recipeChangedSubscription?.unsubscribe();
  }
}
