import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  OnDestroy,
  signal,
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

@Component({
  selector: 'cobbler-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInFormComponent implements OnDestroy {
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
  });

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

  constructor(
    public authO: UserService,
    private router: Router,
    private guard: AuthGuardService,
    @Inject(COBBLER_URL) url: URL,
    private cobblerApiService: CobblerApiService,
    private configService: AppConfigService,
  ) {
    this.configService.loadConfig();
    this.config = configService.AppConfig$;
    // The injection token has a default value and as such is always set.
    this.server_prefilled = url.toString();
    this.login_form.controls.server.setValue(this.server_prefilled);

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
    // Real data call goes to service which talks to server for that json data
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

          // AuthGuardService provides the boolean that allows users to activate links/components
          this.guard.setBool(true);
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
