import { Component, Inject, OnDestroy, signal } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { COBBLER_URL, CobblerApiService } from 'cobbler-api';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthGuardService } from '../services/auth-guard.service';
import { UserService } from '../services/user.service';
import { merge, Subscription } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
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
    MatButtonModule
  ],

})
export class LogInFormComponent implements OnDestroy {
  subs = new Subscription();
  errMsgServer = signal('');
  errMsgUser = signal('');
  errMsgPassword = signal('');

  server_prefilled: string;
  message = null;
  login_form = new UntypedFormGroup({
    server: new UntypedFormControl('', [
      Validators.required,
      LogInFormComponent.urlValidator,
    ]),
    username: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    password: new UntypedFormControl('', Validators.required),
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
    private cobblerApiService: CobblerApiService
  ) {
    this.server_prefilled = url.toString();
    this.login_form.get('server').setValue(this.server_prefilled);

    this.subs.add(
      merge(this.login_form.controls['server'].statusChanges, this.login_form.controls['server'].valueChanges)
        .pipe(distinctUntilChanged())
        .subscribe(() => this.updateErrServer())
    );
    this.subs.add(
      merge(this.login_form.controls['username'].statusChanges, this.login_form.controls['username'].valueChanges)
        .pipe(distinctUntilChanged())
        .subscribe((user) => {this.updateErrUser()})
    );
    this.subs.add(
      merge(this.login_form.controls['password'].statusChanges, this.login_form.controls['password'].valueChanges)
        .pipe(distinctUntilChanged())
        .subscribe(() => this.updateErrPassword())
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
      this.cobblerApiService.login(user, pass).subscribe(
        (data) => {
          this.authO.changeAuthorizedState(true);
          // sets username in session storage
          this.authO.username = user;
          this.authO.token = data;

          // AuthGuardService provides the boolean that allows users to activate links/components
          this.guard.setBool(true);
          this.router.navigate(['/manage']);
        },
        (error) =>
          (this.message =
            'Server, Username or Password did not Validate. Please try again.')
      )
    );
  }

  updateErrServer() {
    if(this.login_form.controls['server'].hasError('required')){
      this.errMsgServer.set('Server is required')
    }else  if(this.login_form.controls['server'].hasError('pattern')){
      this.errMsgServer.set('Server must be a valid URL.')
    }else{
      this.errMsgServer.set('')
    }
  }

  updateErrUser() {
    if(this.login_form.controls['username'].hasError('required')||this.login_form.controls['username'].touched){
      this.errMsgUser.set('Username is required')
    }else  if(this.login_form.controls['username'].hasError('minlength')){
       this.errMsgUser.set(`Username must be minimum
        ${ this.login_form.controls['username'].errors.minlength.requiredLength } characters.`)
    }else{
      this.errMsgUser.set('')
    }
  }

  updateErrPassword() {
    if(this.login_form.controls['password'].hasError('required')){
      this.errMsgPassword.set('Password is required')
    }else{
      this.errMsgServer.set('')
    }

  }
}
