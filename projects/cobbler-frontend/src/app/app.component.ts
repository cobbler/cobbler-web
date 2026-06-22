import { Component } from '@angular/core';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';
import { MatIconModule } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'cobbler-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [ManageMenuComponent, RouterModule, MatIconModule, MatButtonModule],
})
export class AppComponent {
  constructor() {}
}
