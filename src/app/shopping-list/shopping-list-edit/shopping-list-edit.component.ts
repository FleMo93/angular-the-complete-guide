import { Component, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AmountType, Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

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

  constructor(private readonly shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredientSelectedSubscription = this.shoppingListService.ingredientSelected
      .subscribe((ingredient) => {
        this.shoppingListForm.setValue({
          name: ingredient.name,
          amount: ingredient.amount,
          amountType: ingredient.amountType
        });

        this.mode = 'edit';
        this.currentIngredient = ingredient;
      });
  }

  ngOnDestroy(): void {
    this.ingredientSelectedSubscription?.unsubscribe();
  }

  onSubmit(): void {
    if (this.mode === 'edit') {
      if (!this.currentIngredient) throw Error('Current ingredient is undefined');
      this.currentIngredient.name = this.shoppingListForm.value.name;
      this.currentIngredient.amount = this.shoppingListForm.value.amount;
      this.currentIngredient.amountType = this.shoppingListForm.value.amountType;
    }
    else {
      this.shoppingListService.addIngredient({
        name: this.shoppingListForm.value.name,
        amount: this.shoppingListForm.value.amount,
        amountType: this.shoppingListForm.value.amountType as AmountType
      });
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
  }

  onDelete() {
    if(this.mode !== 'edit' || !this.currentIngredient)
      throw Error('Not in edit mode');
    this.shoppingListService.deleteIngredient(this.currentIngredient);
    this.onReset();
  }
}
