import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const COBBLER_USER_KEY_NAME = 'REMEMBERED_USERNAME';
const COBBLER_URL_KEY_NAME = 'COBBLER_URL';
const COBBLER_TOKEN_KEY_NAME = 'token';
const COBBLER_DARKMODE_KEY_NAME = 'DARK_MODE';

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

  set localUsername(name: string) {
    localStorage.setItem(COBBLER_USER_KEY_NAME, name);
  }

  get localUsername(): string | null {
    const name = localStorage.getItem(COBBLER_USER_KEY_NAME);
    if (name === null) {
      return null;
    }
    return name;
  }

  set darkMode(value: boolean) {
    localStorage.setItem(COBBLER_DARKMODE_KEY_NAME, value.toString());
  }

  get darkMode(): string | null {
    const darkMode = localStorage.getItem(COBBLER_DARKMODE_KEY_NAME);
    if (darkMode === null) {
      return null;
    }
    return darkMode;
  }

  changeAuthorizedState(authorized: boolean) {
    this.authorized.next(authorized);
  }

  clearLocalUsername(): void {
    localStorage.removeItem(COBBLER_USER_KEY_NAME);
  }
}
