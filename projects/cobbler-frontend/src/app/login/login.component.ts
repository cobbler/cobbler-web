import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthGuardService} from '../services/auth-guard.service';
import {AuthenticationComponent} from '../authentication/authentication.component';

/* import * as xmlrpc from 'xmlrpc';
 *MOVED xmlrpc test to src/assets/js/testXML.js

import { HttpClient } from '@angular/common/http';
import * as jsalive from 'src/assets/js/testXML.js'
declare const alertAlive: any;
*/

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LogInFormComponent {
  message = null;
  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(2)]),
    password: new FormControl('', Validators.required)
  });

  constructor(public authO: AuthenticationComponent, private router: Router, private guard: AuthGuardService) {
  }

  // TODO: Specify return type properly
  get username(): any {
    return this.form.get('username');

  }

  // TODO: Specify return type properly
  get password(): any {
    return this.form.get('password');
  }

  // TODO: Specify return type properly
  Authorize(): any {
    // data mock
    const dataobj = {
      user: 'cobbler',
      pass: 'cobbler',
    };
    // Real data call goes to service which talks to server for that json data
    const data = this.form.value;
    const user = data.username;
    const pass = data.password;

    if (user === dataobj.user && pass === dataobj.pass) {
      // authO, subscribeable service, return observable, not working yet.
      this.authO.set_authorized(true);
      // sets username in session storage
      this.authO.set_userName(user);

      // AuthGuardService provides the boolean that allows users to acitvate links/components
      this.guard.setBool(true);
      this.router.navigate(['/manage']);
    } else {
      this.message = 'Username and Password did not Validate. Please try again.';
    }
  }
}
