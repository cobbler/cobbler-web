import { Component } from '@angular/core';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';

@Component({
  selector: 'cobbler-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    ManageMenuComponent,
    RouterModule,
    BreadcrumbComponent,
    BreadcrumbItemDirective,
  ],
})
export class AppComponent {
  constructor() {}
}
