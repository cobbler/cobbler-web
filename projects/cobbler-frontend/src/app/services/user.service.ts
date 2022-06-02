import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = {
    username: 'user',
    active: false,
    roles: [],
  };

  constructor() {
    // Apply https://stackoverflow.com/a/50067730/4730773 to this service
  }

  get username() {
    return this.user.username
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
