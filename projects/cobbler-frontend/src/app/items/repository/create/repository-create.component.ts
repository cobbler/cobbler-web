import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CobblerApiService } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';

@Component({
  selector: 'cobbler-repository-create',
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './repository-create.component.html',
  styleUrl: './repository-create.component.scss',
})
export class RepositoryCreateComponent implements OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Dialog
  readonly dialogRef = inject(MatDialogRef<RepositoryCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  repositoryCreateFormGroup = this._formBuilder.group({
    name: [''],
  });

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createRepository(): void {
    this.cobblerApiService
      .new_repo(this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((repositoryHandle) => {
        this.cobblerApiService
          .modify_repo(
            repositoryHandle,
            'name',
            this.repositoryCreateFormGroup.get('name').value,
            this.userService.token,
          )
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.cobblerApiService
              .save_repo(repositoryHandle, this.userService.token, 'new')
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this._snackBar.dismiss();
                  this.dialogRef.close(
                    this.repositoryCreateFormGroup.get('name').value,
                  );
                },
                error: (err) => {
                  // HTML encode the error message since it originates from XML
                  this._snackBar.open(
                    Utils.toHTML(err.message),
                    $localize`:@@snackbar.action.close:Close`,
                  );
                },
              });
          });
      });
  }
}
