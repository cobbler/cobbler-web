import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CobblerApiService, Mgmgtclass } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogItemRenameComponent } from '../../../common/dialog-item-rename/dialog-item-rename.component';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';
import { ManagementClassCreateComponent } from '../create/management-class-create.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'cobbler-management-class-overview',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSort,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './management-class-overview.component.html',
  styleUrl: './management-class-overview.component.scss',
})
export class ManagementClassOverviewComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  readonly dialog = inject<MatDialog>(MatDialog);

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Table
  displayedColumns: string[] = [
    'name',
    'class_name',
    'is_definition',
    'actions',
  ];
  dataSource = new MatTableDataSource<Mgmgtclass>([]);

  @ViewChild(MatTable) table: MatTable<Mgmgtclass>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.retrieveManagementClasses();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private retrieveManagementClasses(): void {
    this.cobblerApiService
      .get_mgmtclasses()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.dataSource.data = value;
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }

  addManagementClass(): void {
    const dialogRef = this.dialog.open(ManagementClassCreateComponent, {
      width: '40%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'string') {
        this.router.navigate(['/items', 'management-class', result]);
      }
    });
  }

  showManagementClass(uid: string, name: string): void {
    this.router.navigate(['/items', 'management-class', name]);
  }

  renameManagementClass(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemRenameComponent, {
      data: {
        itemType: 'Management Class',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the management class
        return;
      }
      this.cobblerApiService
        .get_mgmtclass_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (mgmtclassHandle) => {
            this.cobblerApiService
              .rename_mgmtclass(
                mgmtclassHandle,
                newItemName,
                this.userService.token,
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.retrieveManagementClasses();
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

  deleteManagementClass(uid: string, name: string): void {
    this.cobblerApiService
      .remove_mgmtclass(name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.retrieveManagementClasses();
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }
}
