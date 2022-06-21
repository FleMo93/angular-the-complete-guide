import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { AutoLogin } from './auth/store/auth.actions';
import { DataStorageService } from './shared/data-storage.service';
import { AppState } from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly store: Store<AppState>,
    private readonly dataStorage: DataStorageService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new AutoLogin());
    this.subscription = this.store.select('auth').subscribe((state) => {
      if (!state.user)
        this.router.navigate(['/auth']);
      else
        this.dataStorage.fetchRecipes();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
