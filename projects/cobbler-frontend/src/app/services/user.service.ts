import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const COBBLER_URL_KEY_NAME = 'COBBLER_URL';
const COBBLER_TOKEN_KEY_NAME = 'token';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _username: string;
  authorized: BehaviorSubject<boolean>;

  constructor() {
    // Apply https://stackoverflow.com/a/50067730/4730773 to this service
    this._username = 'unknown user';
    this.authorized = new BehaviorSubject<boolean>(false);
  }

  get server(): string {
    const server_value = localStorage.getItem(COBBLER_URL_KEY_NAME);
    if (server_value) {
      return server_value;
    }
    return 'http://localhost/cobbler_api';
  }

  set server(url: string) {
    window.localStorage.setItem(COBBLER_URL_KEY_NAME, url);
  }

  get username(): string {
    return this._username;
  }

  get token(): string {
    const token = localStorage.getItem(COBBLER_TOKEN_KEY_NAME);
    if (token === null) {
      return '';
    }
    return token;
  }

  set token(token: string) {
    localStorage.setItem(COBBLER_TOKEN_KEY_NAME, token);
  }

  set username(name: string) {
    this._username = name;
    this.token = '';
  }

  changeAuthorizedState(authorized: boolean) {
    this.authorized.next(authorized);
  }
}
