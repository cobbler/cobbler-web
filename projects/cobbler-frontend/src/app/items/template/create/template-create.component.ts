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
  selector: 'cobbler-template-create',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './template-create.component.html',
  styleUrl: './template-create.component.scss',
})
export class TemplateCreateComponent implements OnDestroy {
  // Dialog
  readonly dialogRef = inject(MatDialogRef<TemplateCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  templateCreateFormGroup = this._formBuilder.group({
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

  createTemplate(): void {
    this.cobblerApiService
      .write_autoinstall_template(
        this.templateCreateFormGroup.get('name').value,
        this.templateCreateFormGroup.get('content').value,
        this.userService.token,
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.dialogRef.close(this.templateCreateFormGroup.get('name').value);
        },
        error: (err) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(err.message), 'Close');
        },
      });
  }
}
