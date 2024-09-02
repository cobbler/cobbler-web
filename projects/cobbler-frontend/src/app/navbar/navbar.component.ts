import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { CobblerApiService } from 'cobbler-api';
import { Subject, Subscription } from 'rxjs';
import { AuthGuardService } from '../services/auth-guard.service';
import { UserService } from '../services/user.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cobbler-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
  ],
})
export class NavbarComponent implements OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Navbar
  @Output() toggleSidenav = new EventEmitter<void>();
  cobbler_version: String = 'Unknown';
  islogged: boolean = false;
  subscription: Subscription;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public authO: UserService,
    public router: Router,
    private guard: AuthGuardService,
    private _snackBar: MatSnackBar,
    private cobblerApiService: CobblerApiService,
  ) {
    iconRegistry.addSvgIcon(
      'cobbler-logo',
      sanitizer.bypassSecurityTrustResourceUrl(
        'https://cobbler.github.io/images/logo-cobbler-new.svg',
      ),
    );

    this.subscription = this.authO.authorized
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        if (value) {
          this.islogged = value;
        } else {
          this.islogged = false;
        }
      });
    cobblerApiService
      .extended_version()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          this.cobbler_version = value.version;
        },
        (error) => {
          this.cobbler_version = 'Error';
          this._snackBar.open(error.message, 'Close');
        },
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  logout(): void {
    this.authO.changeAuthorizedState(false);
    this.authO.username = 'username';
    this.authO.token = '';
    this.guard.setBool(false);
  }
}
