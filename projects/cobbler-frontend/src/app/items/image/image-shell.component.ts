import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-image-shell',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class ImageShellComponent {}
