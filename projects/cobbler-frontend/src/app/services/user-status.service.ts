import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserStatusService {
  user = {
    username: 'user',
    active: false,
    roles: [],
  };

  constructor() {
  }

  set username(name) {
    this.user.username = name;
  }

  set active(bool: boolean) {
    this.user.active = bool;
  }

  get roles(): any[] {
    return this.user.roles;
  }
}
