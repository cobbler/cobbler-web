import {Component, Injectable, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {CobblerApiService} from 'cobbler-api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    CobblerApiService,
    {provide: 'COBBLER_URL', useValue: new URL('http://localhost/cobbler_api')}
  ]
})
@Injectable()
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
