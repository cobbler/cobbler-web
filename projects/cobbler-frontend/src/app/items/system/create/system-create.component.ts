import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CobblerApiService } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil, switchMap, map } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';

@Component({
  selector: 'cobbler-system-create',
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './system-create.component.html',
  styleUrl: './system-create.component.scss',
})
export class SystemCreateComponent implements OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Dialog
  readonly dialogRef = inject(MatDialogRef<SystemCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  systemCreateFormGroup = this._formBuilder.group({
    name: [''],
    profile: [''],
  });

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createSystem(): void {
    const name = this.systemCreateFormGroup.get('name')?.value;
    const profile = this.systemCreateFormGroup.get('profile')?.value;

    this.cobblerApiService
      .new_system(this.userService.token)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((systemHandle) =>
          this.cobblerApiService
            .modify_system(systemHandle, ['name'], name, this.userService.token)
            .pipe(
              switchMap(() =>
                this.cobblerApiService.modify_system(
                  systemHandle,
                  ['profile'],
                  profile,
                  this.userService.token,
                ),
              ),
              switchMap(() =>
                this.cobblerApiService.save_system(
                  systemHandle,
                  false,
                  false,
                  'new',
                  this.userService.token,
                ),
              ),
              map(() => ({ systemHandle, name })),
            ),
        ),
      )
      .subscribe({
        next: ({ name }) => {
          this._snackBar.dismiss();
          this.dialogRef.close(name);
        },
        error: (err) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(err.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
  }
}
