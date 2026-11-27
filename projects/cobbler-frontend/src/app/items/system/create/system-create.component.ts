import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule,
  ],
  templateUrl: './system-create.component.html',
  styleUrl: './system-create.component.scss',
})
export class SystemCreateComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Dialog
  readonly dialogRef = inject(MatDialogRef<SystemCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  systemCreateFormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    profile: ['', Validators.required],
  });

  // uid as value, name as label: Cobbler resolves the reference by uid only
  profileOptions: Array<{ value: string; label: string }> = [];

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.cobblerApiService
      .get_profiles()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (items) => {
          this.profileOptions = items.map((item) => ({
            value: item.uid,
            label: item.name,
          }));
        },
        error: (err) => {
          this._snackBar.open(
            Utils.toHTML(err.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
  }

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
                  true,
                  true,
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
