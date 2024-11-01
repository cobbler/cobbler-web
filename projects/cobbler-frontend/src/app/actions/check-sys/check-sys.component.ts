import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterOutlet } from '@angular/router';
import { CobblerApiService } from 'cobbler-api';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'cobbler-check-sys',
  templateUrl: './check-sys.component.html',
  styleUrls: ['./check-sys.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    MatListModule,
    CommonModule,
    MatButton,
    MatIconButton,
    MatIcon,
    MatTooltip,
    MatProgressSpinner,
  ],
})
export class CheckSysComponent implements OnInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Data
  public data: Observable<Array<string>> = of([]);
  public isLoading = true;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
  ) {}

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
          this._snackBar.open(this.toHTML(error.message), 'Close');
          this.isLoading = false;
        },
      );
  }

  toHTML(input: string): any {
    // FIXME: Deduplicate method
    return new DOMParser().parseFromString(input, 'text/html').documentElement
      .textContent;
  }
}
