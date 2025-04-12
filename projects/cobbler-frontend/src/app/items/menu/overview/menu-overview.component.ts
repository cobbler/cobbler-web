import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CobblerApiService, Menu } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogItemRenameComponent } from '../../../common/dialog-item-rename/dialog-item-rename.component';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';
import { MenuCreateComponent } from '../create/menu-create.component';

@Component({
  selector: 'cobbler-menu-overview',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './menu-overview.component.html',
  styleUrl: './menu-overview.component.scss',
})
export class MenuOverviewComponent implements OnInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Table
  displayedColumns: string[] = ['name', 'display_name', 'actions'];
  dataSource: Array<Menu> = [];

  @ViewChild(MatTable) table: MatTable<Menu>;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
    @Inject(MatDialog) readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.retrieveMenus();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private retrieveMenus(): void {
    this.cobblerApiService
      .get_menus()
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

  addMenu(): void {
    const dialogRef = this.dialog.open(MenuCreateComponent, { width: '40%' });
    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'string') {
        this.router.navigate(['/items', 'menu', result]);
      }
    });
  }

  showMenu(uid: string, name: string): void {
    this.router.navigate(['/items', 'menu', name]);
  }

  renameMenu(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemRenameComponent, {
      data: {
        itemType: 'Menu',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the menu
        return;
      }
      this.cobblerApiService
        .get_menu_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (menuHandle) => {
            this.cobblerApiService
              .rename_menu(menuHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.retrieveMenus();
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

  deleteMenu(uid: string, name: string): void {
    this.cobblerApiService
      .remove_menu(name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.retrieveMenus();
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }
}
