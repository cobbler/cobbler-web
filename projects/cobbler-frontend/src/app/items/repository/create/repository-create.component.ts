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
    const name = this.repositoryCreateFormGroup.get('name')?.value;

    this.cobblerApiService
      .new_repo(this.userService.token)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((repoHandle) =>
          this.cobblerApiService
            .modify_repo(repoHandle, ['name'], name, this.userService.token)
            .pipe(
              switchMap(() =>
                this.cobblerApiService.save_repo(
                  repoHandle,
                  false,
                  false,
                  'new',
                  this.userService.token,
                ),
              ),
              map(() => ({ repoHandle, name })),
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
