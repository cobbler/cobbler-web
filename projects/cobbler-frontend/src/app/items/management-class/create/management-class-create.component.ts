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
  selector: 'cobbler-management-class-create',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './management-class-create.component.html',
  styleUrl: './management-class-create.component.scss',
})
export class ManagementClassCreateComponent implements OnDestroy {
  // Fields: Name
  // Dialog
  readonly dialogRef = inject(MatDialogRef<ManagementClassCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  managementClassCreateFormGroup = this._formBuilder.group({
    name: [''],
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

  createManagementClass(): void {
    this.cobblerApiService
      .new_mgmtclass(this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((managementClassHandle) => {
        this.cobblerApiService
          .modify_mgmtclass(
            managementClassHandle,
            'name',
            this.managementClassCreateFormGroup.get('name').value,
            this.userService.token,
          )
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.cobblerApiService
              .save_mgmtclass(
                managementClassHandle,
                this.userService.token,
                'new',
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this._snackBar.dismiss();
                  this.dialogRef.close(
                    this.managementClassCreateFormGroup.get('name').value,
                  );
                },
                error: (err) => {
                  // HTML encode the error message since it originates from XML
                  this._snackBar.open(Utils.toHTML(err.message), 'Close');
                },
              });
          });
      });
  }
}
