import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css'],
  standalone: true,
  imports: [RouterOutlet, MatListModule],
})
export class SyncComponent {
  constructor() {}
}
