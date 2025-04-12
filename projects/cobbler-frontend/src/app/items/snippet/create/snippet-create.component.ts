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
  selector: 'cobbler-snippet-create',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './snippet-create.component.html',
  styleUrl: './snippet-create.component.scss',
})
export class SnippetCreateComponent implements OnDestroy {
  // Dialog
  readonly dialogRef = inject(MatDialogRef<SnippetCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  snippetCreateFormGroup = this._formBuilder.group({
    name: [''],
    content: [''],
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

  createSnippet(): void {
    this.cobblerApiService
      .write_autoinstall_snippet(
        this.snippetCreateFormGroup.get('name').value,
        this.snippetCreateFormGroup.get('content').value,
        this.userService.token,
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.dialogRef.close(this.snippetCreateFormGroup.get('name').value);
        },
        error: (err) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(err.message), 'Close');
        },
      });
  }
}
