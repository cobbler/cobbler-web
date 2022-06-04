import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthGuardService} from '../services/auth-guard.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  islogged: boolean;
  subscription: Subscription;

  constructor(public authO: UserService, private router: Router, private guard: AuthGuardService) {
    this.subscription = this.authO.authorized.subscribe((value) => {
      if (value) {
        this.islogged = value;
      } else {
        this.islogged = false;
      }
    });
  }

  logout(): void {
    this.authO.changeAuthorizedState(false);
    this.authO.username = 'username';
    this.guard.setBool(false);
  }
}
