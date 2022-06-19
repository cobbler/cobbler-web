import {Component, EventEmitter, Output} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
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
  @Output() toggleSidenav = new EventEmitter<void>();
  islogged: boolean = false;
  subscription: Subscription;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public authO: UserService,
    public router: Router,
    private guard: AuthGuardService
  ) {
    iconRegistry.addSvgIcon(
      'cobbler-logo',
      sanitizer.bypassSecurityTrustResourceUrl('https://cobbler.github.io/images/logo-cobbler-new.svg')
    );
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
    this.authO.token = '';
    this.guard.setBool(false);
  }
}
