import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-app-events',
  templateUrl: './app-events.component.html',
  styleUrls: ['./app-events.component.css'],
  standalone: true,
  imports: [RouterOutlet, MatListModule],
})
export class AppEventsComponent {
  constructor() {}
}
