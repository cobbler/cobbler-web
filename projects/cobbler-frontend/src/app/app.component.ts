import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';
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

  constructor(public router: Router) {
  }

  ngOnInit(): void {
    const storage = window.sessionStorage.getItem('loggedIn');
    if (storage) {
      this.userStatus.loggedin = (storage === 'true');
      window.localStorage.userStatus = this.userStatus;
    }
  }
}
