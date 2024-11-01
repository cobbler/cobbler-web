import { Component, inject, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { CobblerApiService } from 'cobbler-api';
import { Subject, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import Utils from '../../utils';

@Component({
  selector: 'cobbler-mkloaders',
  standalone: true,
  imports: [MatButton],
  templateUrl: './mkloaders.component.html',
  styleUrl: './mkloaders.component.scss',
})
export class MkloadersComponent implements OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  runMkloaders(): void {
    this.cobblerApiService
      .background_hardlink(this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          // TODO
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }
}
