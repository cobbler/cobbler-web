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
  selector: 'cobbler-distro-create',
  standalone: true,
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

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createDistro(): void {
    this.cobblerApiService
      .new_distro(this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((distroHandle) => {
        this.cobblerApiService
          .modify_distro(
            distroHandle,
            'name',
            this.distroCreateFormGroup.get('name').value,
            this.userService.token,
          )
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.cobblerApiService
              .modify_distro(
                distroHandle,
                'kernel',
                this.distroCreateFormGroup.get('kernel').value,
                this.userService.token,
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(() => {
                this.cobblerApiService
                  .modify_distro(
                    distroHandle,
                    'initrd',
                    this.distroCreateFormGroup.get('initrd').value,
                    this.userService.token,
                  )
                  .pipe(takeUntil(this.ngUnsubscribe))
                  .subscribe(() => {
                    this.cobblerApiService
                      .save_distro(distroHandle, this.userService.token, 'new')
                      .pipe(takeUntil(this.ngUnsubscribe))
                      .subscribe({
                        next: () => {
                          this._snackBar.dismiss();
                          this.dialogRef.close(
                            this.distroCreateFormGroup.get('name').value,
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
  }
}
