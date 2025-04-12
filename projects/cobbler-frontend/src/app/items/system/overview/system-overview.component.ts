import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CobblerApiService, System } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogItemRenameComponent } from '../../../common/dialog-item-rename/dialog-item-rename.component';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';
import { SystemCreateComponent } from '../create/system-create.component';

@Component({
  selector: 'cobbler-system-overview',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTableModule,
    MatTooltip,
  ],
  templateUrl: './system-overview.component.html',
  styleUrl: './system-overview.component.scss',
})
export class SystemOverviewComponent implements OnInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Table
  displayedColumns: string[] = ['name', 'profile', 'image', 'actions'];
  dataSource: Array<System> = [];
  @ViewChild(MatTable) table: MatTable<System>;

  // Show disable netboot
  showDisableNetboot: boolean = true;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
    @Inject(MatDialog) readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.retrieveSystems();
    this.checkSettingsPxeJustOne();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private retrieveSystems(): void {
    this.cobblerApiService
      .get_systems()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.dataSource = value;
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }

  private checkSettingsPxeJustOne() {
    this.cobblerApiService
      .get_settings(this.userService.token)
      .subscribe((value) => {
        this.showDisableNetboot = value.pxe_just_once;
      });
  }

  addSystem(): void {
    const dialogRef = this.dialog.open(SystemCreateComponent, { width: '40%' });
    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'string') {
        this.router.navigate(['/items', 'system', result]);
      }
    });
  }

  showSystem(uid: string, name: string): void {
    this.router.navigate(['/items', 'system', name]);
  }

  renameSystem(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemRenameComponent, {
      data: {
        itemType: 'System',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the system
        return;
      }
      this.cobblerApiService
        .get_system_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (systemHandle) => {
            this.cobblerApiService
              .rename_system(systemHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.retrieveSystems();
                },
                error: (error) => {
                  // HTML encode the error message since it originates from XML
                  this._snackBar.open(Utils.toHTML(error.message), 'Close');
                },
              });
          },
          error: (error) => {
            // HTML encode the error message since it originates from XML
            this._snackBar.open(Utils.toHTML(error.message), 'Close');
          },
        });
    });
  }

  disableNetboot(uid: string, name: string): void {
    this.cobblerApiService
      .disable_netboot(name, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this._snackBar.open(
              'Network boot successfully disabled for system ' + name + '.',
              'Close',
            );
          } else {
            this._snackBar.open(
              'Disabling network boot for system' + name + ' was unsuccessful.',
              'Close',
            );
          }
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }

  deleteSystem(uid: string, name: string): void {
    this.cobblerApiService
      .remove_system(name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.retrieveSystems();
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }
}
