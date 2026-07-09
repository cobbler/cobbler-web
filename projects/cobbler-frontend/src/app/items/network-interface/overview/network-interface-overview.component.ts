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

interface NetworkInterfacePair {
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
        const result = new Array<NetworkInterfacePair>();
        cobblerSystem.interfaces.forEach(
          (networkInterfaceMap, networkInterfaceName) => {
            const networkInterfaceObject = Object.fromEntries(
              networkInterfaceMap,
            ) as NetworkInterface;
            result.push({
              interfaceName: networkInterfaceName,
              networkInterface: networkInterfaceObject,
            });
          },
        );
        this.dataSource.data = result;
      });
  }

  addNetworkInterface(): void {
    const dialogRef = this.dialog.open(NetworkInterfaceCreateComponent, {
      width: '40%',
      data: { systemName: this.systemName },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'string') {
        this.router.navigate([
          '/manage',
          'items',
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
      '/manage',
      'items',
      'system',
      this.systemName,
      'interface',
      name,
    ]);
  }

  renameInterface(name: string): void {
    const dialogRef = this.dialog.open(DialogItemRenameComponent, {
      data: {
        itemType: 'NetworkInterface',
        itemName: name,
        itemUid: '',
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the system
        return;
      }
      this.cobblerApiService
        .get_system_handle(this.systemName, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (systemHandle) => {
            const interfaceMap = new Map<string, string>();
            interfaceMap.set('interface', name);
            interfaceMap.set('rename_interface', newItemName);
            this.cobblerApiService
              .modify_system(
                systemHandle,
                'rename_interface',
                interfaceMap,
                this.userService.token,
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (value) => {
                  this.cobblerApiService
                    .save_system(systemHandle, this.userService.token)
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
                },
                error: (error) => {
                  // HTML encode the error message since it originates from XML
                  this._snackBar.open(
                    Utils.toHTML(error.message),
                    $localize`:@@snackbar.action.close:Close`,
                  );
                },
              });
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

  deleteInterface(interfaceName: string): void {
    this.cobblerApiService
      .get_system_handle(this.systemName, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (systemHandle) => {
          this.cobblerApiService
            .modify_system(
              systemHandle,
              'delete_interface',
              interfaceName,
              this.userService.token,
            )
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
              next: (value) => {
                if (value) {
                  this.cobblerApiService
                    .save_system(systemHandle, this.userService.token)
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
