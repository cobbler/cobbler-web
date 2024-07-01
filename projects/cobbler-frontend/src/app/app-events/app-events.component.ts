import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {AuthGuardService} from "../services/auth-guard.service";
import {COBBLER_URL, CobblerApiService} from "cobbler-api";

@Component({
  selector: 'cobbler-app-events',
  templateUrl: './app-events.component.html',
  styleUrls: ['./app-events.component.css']
})
export class AppEventsComponent {

  constructor(
    public authO: UserService,
    private router: Router,
    private guard: AuthGuardService,
    @Inject(COBBLER_URL) url: URL,
    private cobblerApiService: CobblerApiService,
  ) {
    cobblerApiService.get_events("")
    cobblerApiService.get_event_log("")
    // TODO: Use "get_events" to show a table of all events
    // TODO: Have three dots at the end of row with menu entry "show logs"
    // TODO: Have page with fixed top for event details and scrollable text field for the log
  }

}
