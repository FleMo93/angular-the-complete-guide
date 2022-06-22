import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription, take } from 'rxjs';
import { AmountType, Ingredient } from 'src/app/shared/ingredient.model';
import { AppState } from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import { AddRecipeAction, UpdateRecipeAction } from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  editMode = false;
  recipeForm!: FormGroup;
  amountTypes = Object.entries(AmountType);

  private id?: number;
  private subscriptionRecipe?: Subscription;

  get ingredientsControls(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'] ? +params['id'] : undefined;
      this.editMode = params['id'] != undefined;

      if (this.id !== undefined) {
        this.store.select('recipe')
          .pipe(
            take(1),
            map((state) => state.recipes.find((rec) => rec.id === this.id) as Recipe))
          .subscribe(this.initForm);

        this.subscriptionRecipe = this.store.select('recipe').subscribe((state) => {
          const recipe = state.recipes.find((rec) => rec.id === this.id);
          if (!recipe)
            this.router.navigate(['..'], { relativeTo: this.route });
          else
            this.initForm(recipe);
        });
      }
      else
        this.initForm(new Recipe(-1, '', '', 'assets/penguins.jpg', []));
    });
  }

  ngOnDestroy(): void {
    this.subscriptionRecipe?.unsubscribe();
  }

  private getIngredientFormGroup(ingredient?: Ingredient): FormGroup {
    return new FormGroup({
      'name': new FormControl(ingredient?.name, Validators.required),
      'amount': new FormControl(ingredient?.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      'amountType': new FormControl(ingredient?.amountType ?? AmountType.Gram, Validators.required),
    });
  }

  private initForm = (recipe: Recipe) => {
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipe.name, Validators.required),
      'imagePath': new FormControl(recipe.imagePath, Validators.required),
      'description': new FormControl(recipe.description, Validators.required),
      'ingredients': new FormArray(recipe.ingredients.map(this.getIngredientFormGroup))
    });
  }

  public onSubmit() {
    if (!this.recipeForm.valid) return;
    const recipe = new Recipe(
      this.id ?? -1,
      this.recipeForm.value.name,
      this.recipeForm.value.description,
      this.recipeForm.value.imagePath,
      this.recipeForm.value.ingredients.map((ing: any) => new Ingredient(ing.name, ing.amount, ing.amountType))
    );

    if (this.editMode) {
      this.store.dispatch(new UpdateRecipeAction(recipe));
      this.router.navigate(['..'], { relativeTo: this.route });
    }
    else {
      this.store.dispatch(new AddRecipeAction(recipe));
      throw Error('Not implemented');
      // this.router.navigate(['..', newRecipe.id], { relativeTo: this.route });
    }
  }

  public onCancel() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  public onAddIngredient() {
    this.ingredientsControls.push(this.getIngredientFormGroup());
  }

  public removeIngredient(formGroup: AbstractControl) {
    const index = this.ingredientsControls.controls.indexOf(formGroup);
    if (index === -1) throw Error('Ingredient not found');
    this.ingredientsControls.removeAt(index);
  }
}
