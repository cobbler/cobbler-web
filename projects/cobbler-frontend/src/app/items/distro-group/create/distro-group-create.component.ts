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
  selector: 'cobbler-distro-group-create',
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './distro-group-create.component.html',
  styleUrl: './distro-group-create.component.scss',
})
export class DistroGroupCreateComponent implements OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Fields: Name
  // Dialog
  readonly dialogRef = inject(MatDialogRef<DistroGroupCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  distroGroupCreateFormGroup = this._formBuilder.group({
    name: [''],
  });

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createDistroGroup(): void {
    const name = this.distroGroupCreateFormGroup.get('name')?.value;

    this.cobblerApiService
      .new_distro_group(this.userService.token)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((distroGroupHandle) =>
          this.cobblerApiService
            .modify_distro_group(
              distroGroupHandle,
              ['name'],
              name,
              this.userService.token,
            )
            .pipe(
              switchMap(() =>
                this.cobblerApiService.save_distro_group(
                  distroGroupHandle,
                  false,
                  false,
                  'new',
                  this.userService.token,
                ),
              ),
              map(() => ({ distroGroupHandle, name })),
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
