import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { COBBLER_URL, CobblerApiService } from 'cobbler-api';
import { AppConfigService, AppConfig } from '../services/app-config.service';

import { AsyncPipe, CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthGuardService } from '../services/auth-guard.service';
import { UserService } from '../services/user.service';
import { merge, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'cobbler-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatCheckboxModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInFormComponent implements OnDestroy, AfterViewInit {
  authO = inject(UserService);
  private router = inject(Router);
  private guard = inject(AuthGuardService);
  private cobblerApiService = inject(CobblerApiService);
  private configService = inject(AppConfigService);

  subs = new Subscription();
  errMsgServer = signal('');
  errMsgUser = signal('');
  errMsgPassword = signal('');

  private readonly _formBuilder = inject(FormBuilder);
  server_prefilled: string;
  message = null;
  config: Observable<AppConfig>;
  login_form = this._formBuilder.group({
    server: ['', [Validators.required, LogInFormComponent.urlValidator]],
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', Validators.required],
    rememberUsername: [false],
  });

  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  private static urlValidator({
    value,
  }: AbstractControl): null | ValidationErrors {
    try {
      new URL(value);
      return null;
    } catch {
      return { pattern: true };
    }
  }

  constructor() {
    const url = inject<URL>(COBBLER_URL);
    const configService = this.configService;

    if (this.authO.localUsername) {
      this.login_form.controls.username.setValue(this.authO.localUsername);
      this.login_form.controls.rememberUsername.setValue(true);
    }

    this.configService.loadConfig();
    this.config = configService.AppConfig$;

    // The injection token has a default value and as such is always set.
    this.server_prefilled = url.toString();
    this.login_form.controls.server.setValue(this.server_prefilled);

    this.subs.add(
      this.configService.AppConfig$.subscribe((config) => {
        if (config.cobblerUrls.length === 0) return; // emit EMPTY_CONFIG
        const lastUsedServer = this.authO.server; // reads from local storage
        // use last server if config contains it, otherwise use last from the array
        if (config.cobblerUrls.includes(lastUsedServer)) {
          this.login_form.controls.server.setValue(lastUsedServer);
        } else {
          this.login_form.controls.server.setValue(
            config.cobblerUrls[config.cobblerUrls.length - 1],
          );
        }
      }),
    );
    this.subs.add(
      merge(
        this.login_form.controls.server.statusChanges,
        this.login_form.controls.server.valueChanges,
      )
        .pipe(distinctUntilChanged())
        .subscribe(() => this.updateErrServer()),
    );
    this.subs.add(
      merge(
        this.login_form.controls.username.statusChanges,
        this.login_form.controls.username.valueChanges,
      )
        .pipe(distinctUntilChanged())
        .subscribe(() => {
          this.updateErrUser();
        }),
    );
    this.subs.add(
      merge(
        this.login_form.controls.password.statusChanges,
        this.login_form.controls.password.valueChanges,
      )
        .pipe(distinctUntilChanged())
        .subscribe(() => this.updateErrPassword()),
    );
  }

  ngAfterViewInit(): void {
    if (this.authO.localUsername) {
      this.passwordInput.nativeElement.focus();
    } else {
      this.usernameInput.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get server(): AbstractControl {
    return this.login_form.get('server');
  }

  get username(): AbstractControl {
    return this.login_form.get('username');
  }

  get password(): AbstractControl {
    return this.login_form.get('password');
  }

  Authorize(): void {
    if (this.login_form.controls.rememberUsername.value) {
      if (this.login_form.value.username) {
        this.authO.localUsername = this.login_form.value.username;
      }
    } else {
      this.authO.clearLocalUsername();
    }

    const formData = this.login_form.value;
    const user = formData.username;
    const pass = formData.password;
    this.authO.server = formData.server;
    this.cobblerApiService.reconfigureService(new URL(formData.server));

    this.subs.add(
      this.cobblerApiService.login(user, pass).subscribe({
        next: (data) => {
          this.authO.changeAuthorizedState(true);
          // sets username in session storage
          this.authO.username = user;
          this.authO.token = data;

          this.router.navigate(['/manage']);
        },
        error: () =>
          (this.message =
            'Server, Username or Password did not Validate. Please try again.'),
      }),
    );
  }

  updateErrServer() {
    if (this.login_form.controls['server'].hasError('required')) {
      this.errMsgServer.set('Server is required');
    } else if (this.login_form.controls['server'].hasError('pattern')) {
      this.errMsgServer.set('Server must be a valid URL.');
    } else {
      this.errMsgServer.set('');
    }
  }

  updateErrUser() {
    if (
      this.login_form.controls['username'].hasError('required') ||
      this.login_form.controls['username'].touched
    ) {
      this.errMsgUser.set('Username is required');
    } else if (this.login_form.controls['username'].hasError('minlength')) {
      this.errMsgUser.set(`Username must be minimum
        ${this.login_form.controls['username'].errors.minlength.requiredLength} characters.`);
    } else {
      this.errMsgUser.set('');
    }
  }

  updateErrPassword() {
    if (this.login_form.controls['password'].hasError('required')) {
      this.errMsgPassword.set('Password is required');
    } else {
      this.errMsgServer.set('');
    }
  }
}
