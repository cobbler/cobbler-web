import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-build-iso',
  templateUrl: './build-iso.component.html',
  styleUrls: ['./build-iso.component.css'],
  standalone: true,
  imports: [RouterOutlet, MatListModule],
})
export class BuildISOComponent {
  constructor() {}
}
