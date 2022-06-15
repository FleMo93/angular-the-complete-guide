import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { DataStorageService } from './shared/data-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly dataStorage: DataStorageService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.autoLogin())
      this.dataStorage.fetchRecipes();

    this.authService.onLogout.subscribe(() => this.router.navigate(['/auth']));
    this.authService.onLogin.subscribe(() => this.dataStorage.fetchRecipes());
  }
}
