import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StoreState } from '../store/shopping-list.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients!: Observable<StoreState>;

  constructor(
    private readonly store: Store<AppState>) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList')
  }

  selectIngredient(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
