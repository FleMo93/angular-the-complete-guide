import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AutoLogin } from './auth/store/auth.actions';
import { FetchRecipesAction } from './recipes/store/recipe.actions';
import { AppState } from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;

  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new AutoLogin());
    this.subscription = this.store.select('auth').subscribe((state) => {
      if (!state.user && !state.loading)
        this.router.navigate(['/auth']);
      else if (state.user)
        this.store.dispatch(new FetchRecipesAction());
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
