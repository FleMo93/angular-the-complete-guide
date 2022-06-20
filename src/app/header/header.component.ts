import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LogoutAction } from '../auth/store/auth.actions';
import { DataStorageService } from '../shared/data-storage.service';
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
    private readonly dataStorage: DataStorageService,
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
    this.dataStorage.storeRecipes();
  }

  public fetchData() {
    this.dataStorage.fetchRecipes();
  }

  public onLogout() {
    this.store.dispatch(new LogoutAction());
  }
}
