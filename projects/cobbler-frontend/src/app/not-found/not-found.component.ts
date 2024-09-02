import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cobbler-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],

  standalone: true,
  imports: [RouterLink],
})
export class NotFoundComponent {
  constructor() {}
}
