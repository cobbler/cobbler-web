import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { Router } from '@angular/router';
import { CobblerApiService, Repo } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogItemRenameComponent } from '../../../common/dialog-item-rename/dialog-item-rename.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'cobbler-overview',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatMenuTrigger,
  ],
  templateUrl: './repository-overview.component.html',
  styleUrl: './repository-overview.component.scss',
})
export class RepositoryOverviewComponent implements OnInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Table
  displayedColumns: string[] = ['name', 'breed', 'mirror_type', 'actions'];
  dataSource: Array<Repo> = [];

  @ViewChild(MatTable) table: MatTable<Repo>;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
    @Inject(MatDialog) readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.retrieveRepositories();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private retrieveRepositories(): void {
    this.cobblerApiService
      .get_repos()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          this.dataSource = value;
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(this.toHTML(error.message), 'Close');
        },
      );
  }

  showRepository(uid: string, name: string): void {
    this.router.navigate(['/items', 'repository', name]);
  }

  renameRepository(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemRenameComponent, {
      data: {
        itemType: 'Repository',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the repository
        return;
      }
      this.cobblerApiService
        .get_repo_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (repoHandle) => {
            this.cobblerApiService
              .rename_repo(repoHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                (value) => {
                  this.retrieveRepositories();
                },
                (error) => {
                  // HTML encode the error message since it originates from XML
                  this._snackBar.open(this.toHTML(error.message), 'Close');
                },
              );
          },
          (error) => {
            // HTML encode the error message since it originates from XML
            this._snackBar.open(this.toHTML(error.message), 'Close');
          },
        );
    });
  }

  deleteRepository(uid: string, name: string): void {
    this.cobblerApiService
      .remove_repo(name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          this.retrieveRepositories();
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(this.toHTML(error.message), 'Close');
        },
      );
  }

  toHTML(input: string): any {
    // FIXME: Deduplicate method
    return new DOMParser().parseFromString(input, 'text/html').documentElement
      .textContent;
  }
}
