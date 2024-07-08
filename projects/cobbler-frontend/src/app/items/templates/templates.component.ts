import {Component} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css'],
   standalone: true,
  imports: [RouterOutlet, MatListModule],
})
export class TemplatesComponent {

  constructor() {
  }

}
