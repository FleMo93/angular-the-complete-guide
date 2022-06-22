import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { AppState } from '../store/app.reducer';
import { AuthenticateStart, SignupStart, HandleError } from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  public isSignUpMode = false;
  public isInProgress = false;
  public error: string | null = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost!: PlaceholderDirective;

  private alertCloseSub?: Subscription;
  private storeSub?: Subscription;

  constructor(
    private readonly componentFactoryResolve: ComponentFactoryResolver,
    private readonly store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.isInProgress = authState.loading;
      this.error = authState.authError ?? null;
      if (this.error)
        this.showErrorAlert(this.error);
    });
  }

  ngOnDestroy(): void {
    this.alertCloseSub?.unsubscribe();
    this.storeSub?.unsubscribe();
  }

  public onSwitchMode() {
    this.isSignUpMode = !this.isSignUpMode;
  }

  public onSubmit(authForm: NgForm): void {
    if (!authForm.valid) return;
    this.isInProgress = true;
    this.error = null;
    if (this.isSignUpMode) {
      this.store.dispatch(new SignupStart(authForm.value.email, authForm.value.password));
    } else {
      this.store.dispatch(new AuthenticateStart(authForm.value.email, authForm.value.password));
    }
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
      this.store.dispatch(new HandleError());
      return a;
    })
  }
}
