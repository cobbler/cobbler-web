import {Component, OnInit} from '@angular/core';

import {CobblerApiService} from 'cobbler-api';
import {UserService} from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    CobblerApiService,
    {provide: 'COBBLER_URL', useFactory: () => {
      const value = localStorage.getItem("COBBLER_URL")
      if (value) {
        return new URL(value);
      }
      return new URL("http://localhost/cobbler_api")
      }},
    UserService
  ]
})
export class AppComponent implements OnInit {
  userStatus = {
    loggedin: false,
  };

  constructor() {
  }

  ngOnInit(): void {
    const is_user_logged_in  = window.sessionStorage.getItem('loggedIn');
    if (is_user_logged_in) {
      this.userStatus.loggedin = (is_user_logged_in === 'true');
      window.localStorage.userStatus = this.userStatus;
    }
  }
}
