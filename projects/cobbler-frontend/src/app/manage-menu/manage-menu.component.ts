import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatAnchor, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'cobbler-manage-menu',
  templateUrl: './manage-menu.component.html',
  styleUrls: ['./manage-menu.component.css'],
  imports: [
    RouterModule,
    RouterOutlet,
    MatSidenavModule,
    MatDividerModule,
    MatToolbarModule,
    MatNavList,
    NavbarComponent,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class ManageMenuComponent {
  router = inject(Router);
}
