import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthGuardService} from '../services/auth-guard.service';
import {Subscription} from 'rxjs';
import {AuthenticationComponent} from '../authentication/authentication.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  message = 'Please login to continue.';
  islogged: boolean;
  subscription: Subscription;

  constructor(public authO: AuthenticationComponent, private router: Router, private guard: AuthGuardService) {
    this.subscription = this.authO.isAuthorized$.subscribe(status => {
      if (status) {
        this.islogged = status;
        this.message = 'Hello User!';
      } else {
        this.islogged = false;
        this.message = 'Please login to continue.';
      }
    });

    const storage = window.sessionStorage.getItem('loggedIn');
    if (storage) {
      const boolValue = (storage === 'true');
      this.islogged = boolValue;

    } else { this.islogged = false; }
  }

  logstatus(): void {
    const message = `user logged = ${this.islogged}.`;
    console.log(message);
  }

  logout(): void {
    this.authO.set_authorized(false);
    // sets username in session storage
    this.authO.set_userName('username');
    // AuthGuardService provides the boolean that allows users to acitvate links/components
    this.guard.setBool(false);
    // windowStorage.loggedIn is set with the above function calls inside:
    // Authentication and AuthGuardService
  }
}
