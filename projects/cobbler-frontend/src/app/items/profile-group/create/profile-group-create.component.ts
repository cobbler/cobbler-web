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
  selector: 'cobbler-profile-group-create',
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './profile-group-create.component.html',
  styleUrl: './profile-group-create.component.scss',
})
export class ProfileGroupCreateComponent implements OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Fields: Name
  // Dialog
  readonly dialogRef = inject(MatDialogRef<ProfileGroupCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  profileGroupCreateFormGroup = this._formBuilder.group({
    name: [''],
  });

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createProfileGroup(): void {
    const name = this.profileGroupCreateFormGroup.get('name')?.value;

    this.cobblerApiService
      .new_profile_group(this.userService.token)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((profileGroupHandle) =>
          this.cobblerApiService
            .modify_profile_group(
              profileGroupHandle,
              ['name'],
              name,
              this.userService.token,
            )
            .pipe(
              switchMap(() =>
                this.cobblerApiService.save_profile_group(
                  profileGroupHandle,
                  false,
                  false,
                  'new',
                  this.userService.token,
                ),
              ),
              map(() => ({ profileGroupHandle, name })),
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
