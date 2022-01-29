import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  authorized = false;
  token = '';
  userData = {
    user: 'User'
  };

  public isAuthorized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.authorized);
  isAuthorized$: Observable<boolean> = this.isAuthorized.asObservable();

  set_authorized(bool: boolean): void {
    this.authorized = bool;
    this.isAuthorized.next(bool);
    window.sessionStorage.loggedIn = bool;
  }

  set_userName(name: string): void {
    // Implemented on Log IN
    this.userData.user = name;
    window.sessionStorage.user = name;
  }

  set_token(token: string): void {
    // Implemented on Log IN
    this.token = token;
    window.sessionStorage.token = token;
  }

  ngOnInit(): void {
    const storage = window.sessionStorage.getItem('loggedIn');
    if (storage) {
      this.authorized = (storage === 'true');

    } else {
      this.authorized = false;
    }
  }
}
