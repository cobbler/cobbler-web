import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cobbler-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
  standalone: true,
  imports: [RouterLink],
})
export class UnauthorizedComponent {
  constructor() {}
}
