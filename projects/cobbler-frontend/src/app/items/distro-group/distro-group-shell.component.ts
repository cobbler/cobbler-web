import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-distro-group-shell',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class DistroGroupShellComponent {}
