import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription, take } from 'rxjs';
import { LogoutAction } from '../auth/store/auth.actions';
import { FetchRecipesAction, StoreRecipesAction } from '../recipes/store/recipe.actions';
import { AppState } from '../store/app.reducer';

export enum View {
  Recipes = "Recipes",
  ShoppingList = "ShoppingList"
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;

  private subscription?: Subscription;

  constructor(
    private readonly store: Store<AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('auth').subscribe((state) => {
      this.isAuthenticated = !!state.user
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public onSaveData() {
    this.store.dispatch(new StoreRecipesAction());
  }

  public fetchData() {
    this.store.dispatch(new FetchRecipesAction());
  }

  public onLogout() {
    this.store.dispatch(new LogoutAction());
  }
}
