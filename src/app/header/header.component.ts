import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

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
    private readonly authService: AuthService) { }

  ngOnInit(): void {
    this.subscription = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
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
    this.authService.logout();
  }
}
