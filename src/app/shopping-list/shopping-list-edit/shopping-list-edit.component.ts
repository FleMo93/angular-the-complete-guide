import { Component, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AmountType, Ingredient } from 'src/app/shared/ingredient.model';
import { AddIngredientAction, RemoveIngredientAction, UpdateIngredientAction, StopEdit } from '../store/shopping-list.actions';
import { AppState } from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild('shoppingListForm') private shoppingListForm!: NgForm;
  public readonly amountTypes = Object.entries(AmountType);
  private ingredientSelectedSubscription?: Subscription;

  public mode: 'edit' | 'new' = 'new';
  private currentIngredient?: Ingredient;

  constructor(
    private readonly store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.ingredientSelectedSubscription = this.store.select('shoppingList').subscribe((state) => {
      if (state.editedIngredientIndex === -1 || !state.editedIngredient)
        return;

      this.shoppingListForm.setValue({
        name: state.editedIngredient.name,
        amount: state.editedIngredient.amount,
        amountType: state.editedIngredient.amountType
      });

      this.mode = 'edit';
      this.currentIngredient = state.editedIngredient;
    });
  }

  ngOnDestroy(): void {
    this.ingredientSelectedSubscription?.unsubscribe();
    this.store.dispatch(new StopEdit());
  }

  onSubmit(): void {
    if (this.mode === 'edit') {
      if (!this.currentIngredient) throw Error('Current ingredient is undefined');
      this.store.dispatch(new UpdateIngredientAction({
        ingredient: new Ingredient(
          this.shoppingListForm.value.name,
          this.shoppingListForm.value.amount,
          this.shoppingListForm.value.amountType,
        )
      }));
    }
    else {
      this.store.dispatch(new AddIngredientAction({
        name: this.shoppingListForm.value.name,
        amount: this.shoppingListForm.value.amount,
        amountType: this.shoppingListForm.value.amountType as AmountType
      }));
    }

    this.onReset();
  }

  onReset(): void {
    this.shoppingListForm.setValue({
      name: '',
      amount: '',
      amountType: AmountType.Gram,
    });

    this.mode = 'new';
    this.currentIngredient = undefined;
    this.store.dispatch(new StopEdit());
  }

  onDelete() {
    if (this.mode !== 'edit')
      throw Error('Not in edit mode');
    this.store.dispatch(new RemoveIngredientAction());
    this.onReset();
  }
}
