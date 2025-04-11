import { Injectable } from '@angular/core';
import { CobblerApiService } from 'cobbler-api';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    private userService: UserService,
    private cobblerApiService: CobblerApiService,
  ) {}

  canActivate(): Observable<boolean> {
    return this.cobblerApiService.token_check(this.userService.token);
  }
}
