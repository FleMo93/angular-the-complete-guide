import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, switchMap, take, tap } from 'rxjs';
import { User } from '../auth/user.model';
import { RecipeBookService } from '../recipes/recipe-book.service';
import { Recipe } from '../recipes/recipe.model';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private readonly url = `${environment.fireabase.api}/recipes.json`;
  private readonly onRecipesSaved = new Subject<void>();
  private readonly onRecipesFetched = new Subject<void>();

  constructor(
    private readonly http: HttpClient,
    private readonly recipesService: RecipeBookService,
    private readonly store: Store<AppState>
  ) { }

  public storeRecipes() {
    this.http.put(this.url, this.recipesService.recipes)
      .pipe(tap((res) => { this.onRecipesSaved.next(); }))
      .subscribe((resp) => {
        console.log(resp);
      });
  }

  public fetchRecipes(): Observable<Recipe[]> {
    const observable = this.store.select('auth').pipe(
      take(1),
      map((v) => v.user),
      map<User | null, Observable<Recipe[]>>((user) => {
        if (!user || !user.token) return new Observable((sub) => {
          sub.next([]);
          sub.complete();
        });

        const observable = this.http.get<Recipe[]>(this.url)
          .pipe(map((resp) => resp.map((recipe) => {
            if (!recipe.ingredients)
              recipe.ingredients = [];
            return recipe;
          })))
          .pipe(tap(() => this.onRecipesFetched.next()));
        return observable;
      }),
      switchMap((rec) => rec)
    );

    observable
      .subscribe((resp) => {
        this.recipesService.setRecipes(resp);
      });
    return observable;
  }
}
