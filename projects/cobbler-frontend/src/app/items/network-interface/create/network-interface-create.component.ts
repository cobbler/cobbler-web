import { Component, inject, OnDestroy } from '@angular/core';
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
import { combineLatest, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';

export interface NetworkInterfaceDialogData {
  /**
   * UID of the system the new interface is attached to. Since Cobbler 4.0.0 a network interface is
   * a top-level item that references its system by UID, and `new_network_interface()` takes that
   * UID (not the system name) as its first argument.
   */
  systemUid: string;
}

@Component({
  selector: 'cobbler-network-interface-create',
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
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);
  data = inject<NetworkInterfaceDialogData>(MAT_DIALOG_DATA);

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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Maps the flat form control names onto the real `NetworkInterface` attribute paths. Cobbler
   * 4.0.0 moved the addresses into the nested `ipv4`/`ipv6` sub-objects, so they must be written
   * through their nested path and not through a flat `ip_address`/`ipv6_address` attribute.
   */
  private static readonly ATTRIBUTE_PATHS: Record<string, string[]> = {
    mac_address: ['mac_address'],
    ipv4_address: ['ipv4', 'address'],
    ipv6_address: ['ipv6', 'address'],
  };

  createNetworkInterface(): void {
    // Since Cobbler 4.0.0 a network interface is a top-level item with its own collection, so it
    // is created through new_network_interface()/modify_network_interface()/save_network_interface().
    // The previous implementation called modify_system(handle, ['modify_interface'], ...); that RPC
    // operation does not exist, so the backend just set a throwaway attribute on the System object
    // and reported success while no interface was ever created.
    const interfaceName =
      this.networkInterfaceCreateFormGroup.get('name')?.value;
    this.cobblerApiService
      .new_network_interface(this.data.systemUid, this.userService.token)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((networkInterfaceHandle) => {
          // The name is always sent, even when empty: save_network_interface() then aborts with
          // "Name is required" instead of silently persisting a nameless interface.
          const modifyObservables: Observable<boolean>[] = [
            this.cobblerApiService.modify_network_interface(
              networkInterfaceHandle,
              ['name'],
              interfaceName,
              this.userService.token,
            ),
          ];
          for (const [formControlName, attributePath] of Object.entries(
            NetworkInterfaceCreateComponent.ATTRIBUTE_PATHS,
          )) {
            const value =
              this.networkInterfaceCreateFormGroup.get(formControlName)?.value;
            if (!value) {
              // Leave optional fields at their backend default instead of writing an empty string.
              continue;
            }
            modifyObservables.push(
              this.cobblerApiService.modify_network_interface(
                networkInterfaceHandle,
                attributePath,
                value,
                this.userService.token,
              ),
            );
          }
          return combineLatest(modifyObservables).pipe(
            switchMap(() =>
              this.cobblerApiService.save_network_interface(
                networkInterfaceHandle,
                false,
                false,
                'new',
                this.userService.token,
              ),
            ),
          );
        }),
      )
      .subscribe({
        next: () => {
          this._snackBar.dismiss();
          this.dialogRef.close(interfaceName);
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
