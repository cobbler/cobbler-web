import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, NetworkInterface, System } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogConfirmCancelData } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemRenameComponent } from '../../../common/dialog-item-rename/dialog-item-rename.component';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';
import { TemplateCreateComponent } from '../../template/create/template-create.component';
import { NetworkInterfaceCreateComponent } from '../create/network-interface-create.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

export interface NetworkInterfacePair {
  interfaceName: string;
  networkInterface: NetworkInterface;
}

@Component({
  selector: 'cobbler-network-interface-overview',
  imports: [
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTooltip,
    MatPaginatorModule,
  ],
  templateUrl: './network-interface-overview.component.html',
  styleUrl: './network-interface-overview.component.scss',
})
export class NetworkInterfaceOverviewComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject<MatDialog>(MatDialog);

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Table
  displayedColumns: string[] = [
    'name',
    'mac_address',
    'ipv4_address',
    'ipv6_address',
    'actions',
  ];
  dataSource = new MatTableDataSource<NetworkInterfacePair>([]);
  systemName: string;
  /**
   * UID of the system the listed interfaces belong to. Resolved by retrieveInterfaces() and handed
   * to the create dialog, because new_network_interface() attaches the new interface by system UID.
   */
  systemUid: string;

  @ViewChild(MatTable) table: MatTable<System>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.systemName = this.route.snapshot.paramMap.get('name');
  }

  ngOnInit(): void {
    this.retrieveInterfaces();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private retrieveInterfaces(): void {
    this.cobblerApiService
      .get_system(this.systemName, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((cobblerSystem) => {
        this.systemUid = cobblerSystem.uid;
        this.cobblerApiService
          .find_network_interface(
            { system_uid: cobblerSystem.uid },
            true,
            false,
            this.userService.token,
          )
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((networkInterfaces) => {
            this.dataSource.data = networkInterfaces.map(
              (networkInterface) => ({
                interfaceName: networkInterface.name,
                networkInterface: networkInterface,
              }),
            );
          });
      });
  }

  addNetworkInterface(): void {
    if (!this.systemUid) {
      // retrieveInterfaces() hasn't resolved the system's uid yet. Bail out instead of opening
      // the dialog with an undefined systemUid, which new_network_interface() would otherwise
      // silently misinterpret as a missing `token` argument.
      return;
    }
    const dialogRef = this.dialog.open(NetworkInterfaceCreateComponent, {
      width: '40%',
      data: { systemUid: this.systemUid },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'string') {
        this.router.navigate([
          '/items',
          'system',
          this.systemName,
          'interface',
          result,
        ]);
      }
    });
  }

  showInterface(name: string): void {
    this.router.navigate([
      '/items',
      'system',
      this.systemName,
      'interface',
      name,
    ]);
  }

  renameInterface(networkInterfacePair: NetworkInterfacePair): void {
    // An XML-RPC item handle is simply the item's UID. Resolving one from a plain interface name
    // via get_network_interface_handle() is not possible here, because interface names are only
    // unique per system (two systems both owning an "eth0" is the normal case) and the backend then
    // aborts with "ambiguous match for given collection and name". retrieveInterfaces() already
    // resolved every row unambiguously via system_uid, so its UID is used directly.
    const networkInterfaceUid = networkInterfacePair.networkInterface.uid;
    const dialogRef = this.dialog.open(DialogItemRenameComponent, {
      data: {
        itemType: 'NetworkInterface',
        itemName: networkInterfacePair.interfaceName,
        itemUid: networkInterfaceUid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the interface
        return;
      }
      // Since Cobbler 4.0.0 a network interface is a top-level item with its own collection, so it
      // is renamed through rename_network_interface(). The previous implementation called
      // modify_system(handle, ['rename_interface'], ...); that RPC operation does not exist, so the
      // backend just set a throwaway attribute on the System object and reported success while the
      // interface kept its old name.
      this.cobblerApiService
        .rename_network_interface(
          networkInterfaceUid,
          newItemName,
          this.userService.token,
        )
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.retrieveInterfaces();
          },
          error: (error) => {
            // HTML encode the error message since it originates from XML
            this._snackBar.open(
              Utils.toHTML(error.message),
              $localize`:@@snackbar.action.close:Close`,
            );
          },
        });
    });
  }

  deleteInterface(networkInterfacePair: NetworkInterfacePair): void {
    // Since Cobbler 4.0.0 a network interface is a top-level item with its own collection, so it is
    // deleted through remove_network_interface(). The previous implementation called
    // modify_system(handle, ['delete_interface'], ...); that RPC operation does not exist, so the
    // backend just set a throwaway attribute on the System object and reported success while the
    // interface stayed in place. The interface UID is passed instead of its name for the same
    // ambiguity reason as in renameInterface().
    this.cobblerApiService
      .remove_network_interface(
        networkInterfacePair.networkInterface.uid,
        this.userService.token,
        false,
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this.retrieveInterfaces();
          } else {
            this._snackBar.open(
              $localize`:@@error.delete-failed:Delete failed! Check server logs for more information.`,
              $localize`:@@snackbar.action.close:Close`,
            );
          }
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
