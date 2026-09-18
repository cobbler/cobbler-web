import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const COBBLER_USER_KEY_NAME = 'REMEMBERED_USERNAME';
const COBBLER_URL_KEY_NAME = 'COBBLER_URL';
const COBBLER_TOKEN_KEY_NAME = 'token';
const COBBLER_DARKMODE_KEY_NAME = 'DARK_MODE';
const SSO_SUPPRESSED_ONCE_KEY_NAME = 'SSO_SUPPRESSED_ONCE';

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

  /// Suppresses the automatic SSO login attempt for exactly the next page
  /// load. Used by an explicit logout so a still-valid browser Kerberos
  /// ticket doesn't immediately re-authenticate the user, which would
  /// otherwise make logout a no-op on an SSO-configured server. Uses
  /// sessionStorage (not localStorage) since this must not persist across
  /// browser restarts/new tabs - only across the single navigation to the
  /// login page that follows logout.
  suppressNextSso(): void {
    sessionStorage.setItem(SSO_SUPPRESSED_ONCE_KEY_NAME, '1');
  }

  /// Reads and clears the one-time SSO suppression flag, returning whether
  /// it was set. Consuming it here ensures the suppression applies to only
  /// one page load: a subsequent reload/navigation finds the flag already
  /// gone and resumes normal auto-SSO behavior.
  consumeSsoSuppression(): boolean {
    const suppressed = sessionStorage.getItem(SSO_SUPPRESSED_ONCE_KEY_NAME);
    if (suppressed !== null) {
      sessionStorage.removeItem(SSO_SUPPRESSED_ONCE_KEY_NAME);
    }
    return suppressed !== null;
  }
}
