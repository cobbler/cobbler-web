import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-manage-shell',
  template: '<router-outlet></router-outlet>',
  imports: [RouterOutlet],
})
export class AppManageShellComponent {}
