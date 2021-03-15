import {Component} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Observable} from 'rxjs';


// to change the isAuthorized in another component:
// import AuthenticationComponent,
// import { AuthenticationComponent } from '../authentication/authentication.component';
// set it in the constructor
// constructor(authO: AuthenticationComponent){}
// change the status:  this.authO.set_authorize(<your boolean>)

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {
  authorized = false;
  userData = {
    user: 'User',
    item: 'No Item Selected.'
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

  set_userItem(ITEM: string): void {
    // item string is to be used to identify the XML data retrieved by each service for that item
    this.userData.item = ITEM;
    // should this be checked for authorization? Is it necessary?
    if (this.authorized) {
      window.sessionStorage.item = ITEM;
    }
  }
  ngOnInit(): void {
    const storage = window.sessionStorage.getItem('loggedIn');
    if (storage) {
      const boolValue = (storage === 'true');
      this.authorized = boolValue;

    } else { this.authorized = false; }
}
}
