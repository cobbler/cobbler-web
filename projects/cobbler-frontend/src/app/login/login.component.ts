import {Component, Injectable} from '@angular/core';
import {FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';
import {CobblerApiService} from 'cobbler-api';
import {AuthGuardService} from '../services/auth-guard.service';
import {AuthenticationComponent} from '../authentication/authentication.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class LogInFormComponent {
  message = null;
  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(2)]),
    password: new FormControl('', Validators.required)
  });

  constructor(
    public authO: AuthenticationComponent,
    private router: Router,
    private guard: AuthGuardService,
    private cobblerApiService: CobblerApiService
  ) {
  }

  get username(): AbstractControl {
    return this.form.get('username');

  }

  get password(): AbstractControl {
    return this.form.get('password');
  }

  Authorize(): void {
    // Real data call goes to service which talks to server for that json data
    const formData = this.form.value;
    const user = formData.username;
    const pass = formData.password;

    this.cobblerApiService.login(user, pass).subscribe((data) => {
        // authO, subscribable service, return observable, not working yet.
        this.authO.set_authorized(true);
        // sets username in session storage
        this.authO.set_userName(user);
        this.authO.set_token(data);

        // AuthGuardService provides the boolean that allows users to activate links/components
        this.guard.setBool(true);
        this.router.navigate(['/manage']);
      },
      error => this.message = 'Username and Password did not Validate. Please try again.');
  }
}
