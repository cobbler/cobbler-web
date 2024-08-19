import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const COBBLER_URL_KEY_NAME = 'COBBLER_URL';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _username: string;
  private _token: string;
  private _active: boolean;
  private _roles: [];
  authorized: BehaviorSubject<boolean>;

  constructor() {
    // Apply https://stackoverflow.com/a/50067730/4730773 to this service
    this._username = 'unknown user';
    this._token = '';
    this._active = false;
    this.authorized = new BehaviorSubject<boolean>(false);
    this._roles = [];
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
    return this._token;
  }

  set token(token: string) {
    this._token = token;
  }

  set username(name: string) {
    this._username = name;
    this._token = '';
  }

  set active(bool: boolean) {
    this._active = bool;
  }

  get roles(): any[] {
    return this._roles;
  }

  changeAuthorizedState(authorized: boolean) {
    this.authorized.next(authorized);
  }
}
