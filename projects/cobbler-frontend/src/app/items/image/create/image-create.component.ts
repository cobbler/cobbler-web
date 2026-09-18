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
  selector: 'cobbler-image-create',
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './image-create.component.html',
  styleUrl: './image-create.component.scss',
})
export class ImageCreateComponent implements OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Dialog
  readonly dialogRef = inject(MatDialogRef<ImageCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  imageCreateFormGroup = this._formBuilder.group({
    name: [''],
  });

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createImage(): void {
    const name = this.imageCreateFormGroup.get('name')?.value;

    this.cobblerApiService
      .new_image(this.userService.token)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((imageHandle) =>
          this.cobblerApiService
            .modify_image(imageHandle, ['name'], name, this.userService.token)
            .pipe(
              switchMap(() =>
                this.cobblerApiService.save_image(
                  imageHandle,
                  false,
                  false,
                  '',
                  this.userService.token,
                ),
              ),
              map(() => ({ imageHandle, name })),
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
