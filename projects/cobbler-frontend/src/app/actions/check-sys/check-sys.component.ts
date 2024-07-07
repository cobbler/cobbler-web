import {Component} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-check-sys',
  templateUrl: './check-sys.component.html',
  styleUrls: ['./check-sys.component.css'],
  standalone: true,
  imports: [RouterOutlet, MatListModule],
})
export class CheckSysComponent {

  constructor() {
  }

}
