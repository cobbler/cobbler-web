import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CobblerApiService } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';

@Component({
  selector: 'cobbler-snippet-create',
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './snippet-create.component.html',
  styleUrl: './snippet-create.component.scss',
})
export class SnippetCreateComponent implements OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Dialog
  readonly dialogRef = inject(MatDialogRef<SnippetCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  snippetCreateFormGroup = this._formBuilder.group({
    name: [''],
    template_type: ['cheetah'],
    content: [''],
  });

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private handleError = (err: { message: string }): void => {
    // HTML encode the error message since it originates from XML
    this._snackBar.open(
      Utils.toHTML(err.message),
      $localize`:@@snackbar.action.close:Close`,
    );
  };

  createSnippet(): void {
    const name = this.snippetCreateFormGroup.get('name').value;
    const templateType = this.snippetCreateFormGroup.get('template_type').value;
    const content = this.snippetCreateFormGroup.get('content').value;
    const token = this.userService.token;

    this.cobblerApiService
      .new_template(token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (handle) => {
          this.cobblerApiService
            .modify_template(handle, ['name'], name, token)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
              next: () => {
                this.cobblerApiService
                  .modify_template(
                    handle,
                    ['template_type'],
                    templateType,
                    token,
                  )
                  .pipe(takeUntil(this.ngUnsubscribe))
                  .subscribe({
                    next: () => {
                      this.cobblerApiService
                        .modify_template(
                          handle,
                          ['uri', 'schema'],
                          'file',
                          token,
                        )
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe({
                          next: () => {
                            this.cobblerApiService
                              .modify_template(
                                handle,
                                ['uri', 'path'],
                                name,
                                token,
                              )
                              .pipe(takeUntil(this.ngUnsubscribe))
                              .subscribe({
                                next: () => {
                                  this.cobblerApiService
                                    .modify_template(
                                      handle,
                                      ['content'],
                                      content,
                                      token,
                                    )
                                    .pipe(takeUntil(this.ngUnsubscribe))
                                    .subscribe({
                                      next: () => {
                                        this.cobblerApiService
                                          .save_template(
                                            handle,
                                            true,
                                            true,
                                            'new',
                                            token,
                                          )
                                          .pipe(takeUntil(this.ngUnsubscribe))
                                          .subscribe({
                                            next: () => {
                                              this.dialogRef.close(name);
                                            },
                                            error: this.handleError,
                                          });
                                      },
                                      error: this.handleError,
                                    });
                                },
                                error: this.handleError,
                              });
                          },
                          error: this.handleError,
                        });
                    },
                    error: this.handleError,
                  });
              },
              error: this.handleError,
            });
        },
        error: this.handleError,
      });
  }
}
