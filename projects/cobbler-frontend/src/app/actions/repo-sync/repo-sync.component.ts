import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-repo-sync',
  templateUrl: './repo-sync.component.html',
  styleUrls: ['./repo-sync.component.css'],
  standalone: true,
  imports: [RouterOutlet, MatListModule],
})
export class RepoSyncComponent {
  constructor() {}
}
