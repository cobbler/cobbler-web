import { Component, inject } from '@angular/core';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { JsonPipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'cobbler-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [ManageMenuComponent, RouterModule, MatIconModule, MatButtonModule],
})
export class AppComponent {
  constructor() {
    // Registered here (the root component) rather than in NavbarComponent: ManageMenuComponent's
    // own template uses this same icon earlier in the render tree than <cobbler-navbar>, so
    // registering it in NavbarComponent's constructor left that earlier usage unresolved —
    // "Unable to find icon with the name ':cobbler-logo'" — even though NavbarComponent's own
    // icon usage (registered by the time it renders) worked fine.
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIcon(
      'cobbler-logo',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/cobbler-logo.svg',
      ),
    );
  }
}
