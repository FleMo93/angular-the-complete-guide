import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AmountType, Ingredient } from 'src/app/shared/ingredient.model';
import { RecipeBookService } from '../recipe-book.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number | undefined = undefined;
  editMode = false;
  recipeForm!: FormGroup;
  amountTypes = Object.entries(AmountType);

  get ingredientsControls(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly recipeService: RecipeBookService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'] ? +params['id'] : undefined;
      this.editMode = params['id'] != undefined;
      let recipe: Recipe;
      if (this.id !== undefined)
        recipe = this.recipeService.getRecipeById(this.id);
      else
        recipe = new Recipe(-1, '', '', 'assets/penguins.jpg', []);

      this.initForm(recipe);
    });
  }

  private getIngredientFormGroup(ingredient?: Ingredient): FormGroup {
    return new FormGroup({
      'name': new FormControl(ingredient?.name, Validators.required),
      'amount': new FormControl(ingredient?.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      'amountType': new FormControl(ingredient?.amountType ?? AmountType.Gram, Validators.required),
    });
  }

  private initForm(recipe: Recipe) {
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
      if (this.id === undefined) throw Error('id is undefined');
      this.recipeService.updateRecipe(this.id, recipe)
      this.router.navigate(['..'], { relativeTo: this.route });
    }
    else {
      const newRecipe = this.recipeService.addRecipe(recipe);
      this.router.navigate(['..', newRecipe.id], { relativeTo: this.route });
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
