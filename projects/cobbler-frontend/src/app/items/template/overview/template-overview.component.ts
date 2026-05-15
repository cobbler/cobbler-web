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
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CobblerApiService } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogItemRenameComponent } from '../../../common/dialog-item-rename/dialog-item-rename.component';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';
import { TemplateCreateComponent } from '../create/template-create.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'cobbler-template-overview',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltip,
    MatPaginatorModule,
  ],
  templateUrl: './template-overview.component.html',
  styleUrl: './template-overview.component.scss',
})
export class TemplateOverviewComponent
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
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<string>([]);

  @ViewChild(MatTable) table: MatTable<string>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.retrieveTemplates();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private retrieveTemplates(): void {
    this.cobblerApiService
      .get_autoinstall_templates(this.userService.token)
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

  addTemplate(): void {
    const dialogRef = this.dialog.open(TemplateCreateComponent, {
      width: '40%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'string') {
        this.router.navigate(['/items', 'template', result]);
      }
    });
  }

  showTemplate(name: string): void {
    this.router.navigate(['/items', 'template', name]);
  }

  renameTemplate(name: string): void {
    const dialogRef = this.dialog.open(DialogItemRenameComponent, {
      data: {
        itemType: 'Template',
        itemName: name,
        itemUid: '',
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the file
        return;
      }
      this.cobblerApiService
        .read_autoinstall_template(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (template: string) => {
            this.cobblerApiService
              .write_autoinstall_template(
                newItemName,
                template,
                this.userService.token,
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.cobblerApiService
                    .remove_autoinstall_template(name, this.userService.token)
                    .pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe({
                      next: () => {
                        this.retrieveTemplates();
                      },
                      error: (error) => {
                        // HTML encode the error message since it originates from XML
                        this._snackBar.open(
                          Utils.toHTML(error.message),
                          'Close',
                        );
                      },
                    });
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

  deleteTemplate(name: string): void {
    this.cobblerApiService
      .remove_autoinstall_template(name, this.userService.token)
      .subscribe({
        next: () => {
          this.retrieveTemplates();
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }
}
