import {Component} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-snippets',
  templateUrl: './snippets.component.html',
  styleUrls: ['./snippets.component.css'],
  standalone: true,
  imports: [RouterOutlet, MatListModule],
})
export class SnippetsComponent {

  constructor() {
  }
}
