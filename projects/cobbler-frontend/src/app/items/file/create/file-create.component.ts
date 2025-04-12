import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CobblerApiService } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';

@Component({
  selector: 'cobbler-file-create',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './file-create.component.html',
  styleUrl: './file-create.component.scss',
})
export class FileCreateComponent implements OnDestroy {
  // Dialog
  readonly dialogRef = inject(MatDialogRef<FileCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  fileCreateFormGroup = this._formBuilder.group({
    name: [''],
    path: [''],
    owner: [''],
    group: [''],
    mode: [''],
    template: [''],
  });

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createFile(): void {
    this.cobblerApiService
      .new_file(this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((fileHandle) => {
        this.cobblerApiService
          .modify_file(
            fileHandle,
            'name',
            this.fileCreateFormGroup.get('name').value,
            this.userService.token,
          )
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.cobblerApiService
              .modify_file(
                fileHandle,
                'path',
                this.fileCreateFormGroup.get('path').value,
                this.userService.token,
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(() => {
                this.cobblerApiService
                  .modify_file(
                    fileHandle,
                    'owner',
                    this.fileCreateFormGroup.get('owner').value,
                    this.userService.token,
                  )
                  .pipe(takeUntil(this.ngUnsubscribe))
                  .subscribe(() => {
                    this.cobblerApiService
                      .modify_file(
                        fileHandle,
                        'group',
                        this.fileCreateFormGroup.get('group').value,
                        this.userService.token,
                      )
                      .pipe(takeUntil(this.ngUnsubscribe))
                      .subscribe(() => {
                        this.cobblerApiService
                          .modify_file(
                            fileHandle,
                            'mode',
                            this.fileCreateFormGroup.get('mode').value,
                            this.userService.token,
                          )
                          .pipe(takeUntil(this.ngUnsubscribe))
                          .subscribe(() => {
                            this.cobblerApiService
                              .modify_file(
                                fileHandle,
                                'template',
                                this.fileCreateFormGroup.get('template').value,
                                this.userService.token,
                              )
                              .pipe(takeUntil(this.ngUnsubscribe))
                              .subscribe(() => {
                                this.cobblerApiService
                                  .save_file(
                                    fileHandle,
                                    this.userService.token,
                                    'new',
                                  )
                                  .pipe(takeUntil(this.ngUnsubscribe))
                                  .subscribe({
                                    next: () => {
                                      this._snackBar.dismiss();
                                      this.dialogRef.close(
                                        this.fileCreateFormGroup.get('name')
                                          .value,
                                      );
                                    },
                                    error: (err) => {
                                      // HTML encode the error message since it originates from XML
                                      this._snackBar.open(
                                        Utils.toHTML(err.message),
                                        'Close',
                                      );
                                    },
                                  });
                              });
                          });
                      });
                  });
              });
          });
      });
  }
}
