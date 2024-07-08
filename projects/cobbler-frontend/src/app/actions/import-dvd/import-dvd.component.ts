import {Component} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-import-dvd',
  templateUrl: './import-dvd.component.html',
  styleUrls: ['./import-dvd.component.css'], standalone: true,
  imports: [RouterOutlet, MatListModule],
})
export class ImportDVDComponent {

  constructor() {
  }

}
