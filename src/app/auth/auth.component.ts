import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
  public isLoggedIn = false;
  public isSignUpMode = false;
  public isInProgress = false;
  public error: string | null = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost!: PlaceholderDirective;

  private alertCloseSub?: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly componentFactoryResolve: ComponentFactoryResolver
  ) { }

  ngOnDestroy(): void {
    this.alertCloseSub?.unsubscribe();
  }

  public onSwitchMode() {
    this.isSignUpMode = !this.isSignUpMode;
  }

  public onSubmit(authForm: NgForm): void {
    if (!authForm.valid) return;
    this.isInProgress = true;
    this.error = null;
    const method = this.isSignUpMode ? this.authService.signup : this.authService.login;
    method(authForm.value.email, authForm.value.password)
      .subscribe(
        {
          next: (resp) => {
            authForm.reset();
            this.isInProgress = false;
            this.router.navigate(['/recipes']);
          },
          error: (err) => {
            console.error(err);
            this.error = err;
            this.showErrorAlert(err);
            this.isInProgress = false;
          },
        });
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolve.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const compRef = hostViewContainerRef.createComponent(alertCmpFactory);
    compRef.instance.message = message;
    this.alertCloseSub = compRef.instance.close.subscribe((a) => {
      this.alertCloseSub?.unsubscribe();
      compRef.destroy();
      return a;
    })
  }
}
