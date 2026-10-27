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
  selector: 'cobbler-system-group-create',
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './system-group-create.component.html',
  styleUrl: './system-group-create.component.scss',
})
export class SystemGroupCreateComponent implements OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Fields: Name
  // Dialog
  readonly dialogRef = inject(MatDialogRef<SystemGroupCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  systemGroupCreateFormGroup = this._formBuilder.group({
    name: [''],
  });

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createSystemGroup(): void {
    const name = this.systemGroupCreateFormGroup.get('name')?.value;

    this.cobblerApiService
      .new_system_group(this.userService.token)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((systemGroupHandle) =>
          this.cobblerApiService
            .modify_system_group(
              systemGroupHandle,
              ['name'],
              name,
              this.userService.token,
            )
            .pipe(
              switchMap(() =>
                this.cobblerApiService.save_system_group(
                  systemGroupHandle,
                  false,
                  false,
                  'new',
                  this.userService.token,
                ),
              ),
              map(() => ({ systemGroupHandle, name })),
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
