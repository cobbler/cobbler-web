import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CobblerApiService } from 'cobbler-api';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, map } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';

@Component({
  selector: 'cobbler-distro-create',
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './distro-create.component.html',
  styleUrl: './distro-create.component.scss',
})
export class DistroCreateComponent implements OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Dialog
  readonly dialogRef = inject(MatDialogRef<DistroCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  distroCreateFormGroup = this._formBuilder.group({
    name: [''],
    kernel: [''],
    initrd: [''],
  });

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createDistro(): void {
    const name = this.distroCreateFormGroup.get('name')?.value;
    const kernel = this.distroCreateFormGroup.get('kernel')?.value;
    const initrd = this.distroCreateFormGroup.get('initrd')?.value;

    this.cobblerApiService
      .new_distro(this.userService.token)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((distroHandle) =>
          this.cobblerApiService
            .modify_distro(distroHandle, ['name'], name, this.userService.token)
            .pipe(
              switchMap(() =>
                this.cobblerApiService.modify_distro(
                  distroHandle,
                  ['kernel'],
                  kernel,
                  this.userService.token,
                ),
              ),
              switchMap(() =>
                this.cobblerApiService.modify_distro(
                  distroHandle,
                  ['initrd'],
                  initrd,
                  this.userService.token,
                ),
              ),
              switchMap(() =>
                this.cobblerApiService.save_distro(
                  distroHandle,
                  false,
                  false,
                  '',
                  this.userService.token,
                ),
              ),
              map(() => ({ distroHandle, name })),
            ),
        ),
      )
      .subscribe({
        next: ({ name }) => {
          this._snackBar.dismiss();
          this.dialogRef.close(name);
        },
        error: (err) => {
          this._snackBar.open(
            Utils.toHTML(err.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
  }
}
