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
  selector: 'cobbler-profile-create',
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './profile-create.component.html',
  styleUrl: './profile-create.component.scss',
})
export class ProfileCreateComponent implements OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Dialog
  readonly dialogRef = inject(MatDialogRef<ProfileCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  profileCreateFormGroup = this._formBuilder.group({
    name: [''],
    distro: [''],
  });

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createProfile(): void {
    const name = this.profileCreateFormGroup.get('name')?.value;
    const distro = this.profileCreateFormGroup.get('distro')?.value;

    this.cobblerApiService
      .new_profile(this.userService.token)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((profileHandle) =>
          this.cobblerApiService
            .modify_profile(
              profileHandle,
              ['name'],
              name,
              this.userService.token,
            )
            .pipe(
              switchMap(() =>
                this.cobblerApiService.modify_profile(
                  profileHandle,
                  ['distro'],
                  distro,
                  this.userService.token,
                ),
              ),
              switchMap(() =>
                this.cobblerApiService.save_profile(
                  profileHandle,
                  false,
                  false,
                  'new',
                  this.userService.token,
                ),
              ),
              map(() => ({ profileHandle, name })),
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
