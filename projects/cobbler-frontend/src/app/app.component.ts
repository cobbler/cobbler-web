import {Component, Injectable, OnInit} from '@angular/core';
import * as xmlrpc from 'typescript-xmlrpc';

import { Router, NavigationEnd } from '@angular/router';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent implements OnInit {
  userStatus = {
    loggedin: false,
  };

  constructor(private router: Router, private http: HttpClient) {
    const service = new xmlrpc.AngularXmlrpcService(http);
    service.configureService(new URL('http://localhost/cobbler_api'));
    service.methodCall('version').subscribe((data) => {
      // TODO: Handle HTTP Errors
      console.log(data);
    });
  }

  ngOnInit(): void {
    const storage = window.sessionStorage.getItem('loggedIn');
    if (storage) {
      const boolvalue = (storage === 'true');
      this.userStatus.loggedin = boolvalue;
      window.localStorage.userStatus = this.userStatus;
    }
    /* 
     * Do we want it to scroll to top on every component change?
     * component change/select from menu: scroll to top?
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
    */
  }
}
