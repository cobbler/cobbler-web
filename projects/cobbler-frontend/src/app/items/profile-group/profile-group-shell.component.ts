import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-profile-group-shell',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class ProfileGroupShellComponent {}
