import { Component, Inject, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CobblerApiService } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';

export interface NetworkInterfaceDialogData {
  systemName: string;
}

@Component({
  selector: 'cobbler-network-interface-create',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './network-interface-create.component.html',
  styleUrl: './network-interface-create.component.scss',
})
export class NetworkInterfaceCreateComponent implements OnDestroy {
  // Dialog
  readonly dialogRef = inject(MatDialogRef<NetworkInterfaceCreateComponent>);

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  networkInterfaceCreateFormGroup = this._formBuilder.group({
    name: [''],
    mac_address: [''],
    ipv4_address: [''],
    ipv6_address: [''],
  });

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: NetworkInterfaceDialogData,
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createNetworkInterface(): void {
    const interfaceName =
      this.networkInterfaceCreateFormGroup.get('name').value;
    const networkInterfaceMap = new Map<string, string>();
    networkInterfaceMap.set(
      'macaddress-' + interfaceName,
      this.networkInterfaceCreateFormGroup.get('mac_address').value,
    );
    networkInterfaceMap.set(
      'ip_address-' + interfaceName,
      this.networkInterfaceCreateFormGroup.get('ipv4_address').value,
    );
    networkInterfaceMap.set(
      'ipv6_address-' + interfaceName,
      this.networkInterfaceCreateFormGroup.get('ipv6_address').value,
    );
    this.cobblerApiService
      .get_system_handle(this.data.systemName, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (systemHandle) => {
          this.cobblerApiService
            .modify_system(
              systemHandle,
              'modify_interface',
              networkInterfaceMap,
              this.userService.token,
            )
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
              next: () => {
                this.cobblerApiService
                  .save_system(systemHandle, this.userService.token)
                  .pipe(takeUntil(this.ngUnsubscribe))
                  .subscribe(() => {
                    this.dialogRef.close(interfaceName);
                  });
              },
              error: (err) => {
                // HTML encode the error message since it originates from XML
                this._snackBar.open(Utils.toHTML(err.message), 'Close');
              },
            });
        },
        error: (err) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(err.message), 'Close');
        },
      });
  }
}
