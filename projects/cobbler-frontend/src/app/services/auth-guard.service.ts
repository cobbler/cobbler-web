import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthenticationComponent} from '../authentication/authentication.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  loggedIN = false;
  subscription: Subscription;

  constructor(private router: Router, public AuthO: AuthenticationComponent) {
  }

  canActivate(): boolean {
    const sessionLIVE = this.checkSession();
    if (sessionLIVE != null) {
      if (!sessionLIVE) {
        this.router.navigate(['/Unauthorized']);
        return false;
      }
      if (sessionLIVE) {
        return true;
      }
    }
    if (!this.loggedIN) {
      this.router.navigate(['/Unauthorized']);
    }
    return this.loggedIN;
  }

  checkSession(): boolean {
    try {
      const value = window.sessionStorage.getItem('loggedIn');
      return (value === 'true');
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

  ngOninit(): void {
    const status = this.checkSession();
    if (status != null) {
      this.loggedIN = status;
    }
  }

}
