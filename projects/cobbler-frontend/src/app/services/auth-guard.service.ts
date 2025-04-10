import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CobblerApiService } from 'cobbler-api';
import { Observable, Subscription } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  subscription: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    private cobblerApiService: CobblerApiService,
  ) {}

  canActivate(): Observable<boolean> {
    return this.cobblerApiService.token_check(this.userService.token);
  }
}
