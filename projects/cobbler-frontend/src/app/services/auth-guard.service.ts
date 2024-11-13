import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  loggedIN = false;
  subscription: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    const sessionLIVE = this.checkSession();
    if (sessionLIVE != null) {
      if (!sessionLIVE) {
        this.loggedIN = false;
        this.userService.changeAuthorizedState(false);
        this.router.navigate(['/unauthorized']);
        return false;
      }
      if (sessionLIVE) {
        this.loggedIN = true;
        this.userService.changeAuthorizedState(true);
        return true;
      }
    }
    if (!this.loggedIN) {
      this.userService.changeAuthorizedState(this.loggedIN);
      this.router.navigate(['/unauthorized']);
    }
    this.userService.changeAuthorizedState(this.loggedIN);
    return this.loggedIN;
  }

  checkSession(): boolean {
    try {
      const value = window.sessionStorage.getItem('loggedIn');
      return value === 'true';
    } catch {
      return false;
    }
  }

  setBool(login: boolean): void {
    this.loggedIN = login;
    window.sessionStorage.loggedIn = login;
  }

  getstatus(): boolean {
    const sessionLIVE = this.checkSession();
    if (sessionLIVE != null) {
      return sessionLIVE;
    }
    return this.loggedIN;
  }
}
