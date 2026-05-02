import { Injectable, inject } from '@angular/core';
import { CobblerApiService } from 'cobbler-api';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  private userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);

  canActivate(): Observable<boolean> {
    return this.cobblerApiService.token_check(this.userService.token);
  }
}
