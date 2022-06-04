import {Component, Injectable} from '@angular/core';
import {FormGroup, FormControl, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';
import {CobblerApiService} from 'cobbler-api';
import {AuthGuardService} from '../services/auth-guard.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class LogInFormComponent {
  server_prefilled: string;
  message = null;
  login_form = new FormGroup({
    server: new FormControl('', [
      Validators.required,
      LogInFormComponent.urlValidator
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    password: new FormControl('', Validators.required)
  });

  private static urlValidator({value}: AbstractControl): null | ValidationErrors {
    try {
      new URL(value);
      return null;
    } catch {
      return {pattern: true};
    }
  }

  constructor(
    public authO: UserService,
    private router: Router,
    private guard: AuthGuardService,
    private cobblerApiService: CobblerApiService
  ) {
    if (localStorage.getItem("COBBLER_URL")) {
      this.server_prefilled = localStorage.getItem("COBBLER_URL")
    } else {
      this.server_prefilled = ""
    }
    this.login_form.get('server').setValue(this.server_prefilled)
    console.log("server_prefiled: " + this.server_prefilled)
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
    this.cobblerApiService.reconfigureService(new URL(formData.server))

    this.cobblerApiService.login(user, pass).subscribe((data) => {
        // authO, subscribable service, return observable, not working yet.
        this.authO.changeAuthorizedState(true);
        // sets username in session storage
        this.authO.username = user;
        this.authO.token = data;

        // AuthGuardService provides the boolean that allows users to activate links/components
        this.guard.setBool(true);
        this.router.navigate(['/manage']);
      },
      error => this.message = 'Server, Username or Password did not Validate. Please try again.');
  }
}
