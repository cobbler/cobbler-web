import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';
import { CobblerApiService } from 'cobbler-api';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import Utils from '../../utils';

@Component({
  selector: 'cobbler-check-sys',
  templateUrl: './check-sys.component.html',
  styleUrls: ['./check-sys.component.scss'],
  imports: [
    RouterOutlet,
    MatListModule,
    CommonModule,
    MatIconButton,
    MatIcon,
    MatProgressSpinner,
  ],
})
export class CheckSysComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Data
  public data: Observable<Array<string>> = of([]);
  public isLoading = true;

  ngOnInit(): void {
    this.updateChecks();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updateChecks(): void {
    this.isLoading = true;
    this.cobblerApiService
      .check(this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data) => {
          this.data = of(data);
          this.isLoading = false;
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
          this.isLoading = false;
        },
      );
  }
}
