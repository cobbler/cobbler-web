import { Component, inject, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CobblerApiService } from 'cobbler-api';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'cobbler-mkloaders',
  standalone: true,
  imports: [MatButton],
  templateUrl: './mkloaders.component.html',
  styleUrl: './mkloaders.component.scss',
})
export class MkloadersComponent implements OnDestroy {
  private userSvc = inject(UserService);
  private cobblerApiSvc = inject(CobblerApiService);

  private subs: Subscription = new Subscription();

  constructor(private _snackBar: MatSnackBar) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  runMkloaders(): void {
    this.subs.add(
      this.cobblerApiSvc.background_hardlink(this.userSvc.token).subscribe({
        next: (value) => {
          // TODO
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(this.toHTML(error.message), 'Close');
        },
      }),
    );
  }

  toHTML(input: string): any {
    // FIXME: Deduplicate method
    return new DOMParser().parseFromString(input, 'text/html').documentElement
      .textContent;
  }
}
