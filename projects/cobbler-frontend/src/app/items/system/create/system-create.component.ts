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
  selector: 'cobbler-system-create',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './system-create.component.html',
  styleUrl: './system-create.component.scss',
})
export class SystemCreateComponent implements OnDestroy {
  // Dialog
  readonly dialogRef = inject(MatDialogRef<SystemCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  systemCreateFormGroup = this._formBuilder.group({
    name: [''],
    profile: [''],
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

  createSystem(): void {
    this.cobblerApiService
      .new_system(this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((systemHandle) => {
        this.cobblerApiService
          .modify_system(
            systemHandle,
            'name',
            this.systemCreateFormGroup.get('name').value,
            this.userService.token,
          )
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.cobblerApiService
              .modify_system(
                systemHandle,
                'profile',
                this.systemCreateFormGroup.get('profile').value,
                this.userService.token,
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.cobblerApiService
                    .save_system(systemHandle, this.userService.token, 'new')
                    .pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe({
                      next: () => {
                        this._snackBar.dismiss();
                        this.dialogRef.close(
                          this.systemCreateFormGroup.get('name').value,
                        );
                      },
                      error: (err) => {
                        // HTML encode the error message since it originates from XML
                        this._snackBar.open(Utils.toHTML(err.message), 'Close');
                      },
                    });
                },
              });
          });
      });
  }
}
