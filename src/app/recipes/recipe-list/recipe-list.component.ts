import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RecipeBookService } from '../recipe-book.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes!: Recipe[];
  private recipeChangedSubscription?: Subscription;

  constructor(private readonly recipeService: RecipeBookService) { }

  ngOnInit(): void {
    this.recipes = this.recipeService.recipes;
    this.recipeChangedSubscription = this.recipeService.recipesChanged.subscribe((rec) => this.recipes = rec);
  }

  ngOnDestroy(): void {
    this.recipeChangedSubscription?.unsubscribe();
  }
}
