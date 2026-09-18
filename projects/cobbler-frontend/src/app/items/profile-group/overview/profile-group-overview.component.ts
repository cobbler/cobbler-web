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
import { Router, RouterLink } from '@angular/router';
import { CobblerApiService, ProfileGroup } from 'cobbler-api';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogItemRenameComponent } from '../../../common/dialog-item-rename/dialog-item-rename.component';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';
import { ProfileGroupCreateComponent } from '../create/profile-group-create.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'cobbler-profile-group-overview',
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
    RouterLink,
  ],
  templateUrl: './profile-group-overview.component.html',
  styleUrl: './profile-group-overview.component.scss',
})
export class ProfileGroupOverviewComponent
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
  displayedColumns: string[] = ['name', 'members', 'actions'];
  dataSource = new MatTableDataSource<ProfileGroup>([]);
  // Resolves a member uid to the referenced profile's name, for display + routerLink.
  memberNameByUid = new Map<string, string>();

  @ViewChild(MatTable) table!: MatTable<ProfileGroup>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.retrieveProfileGroups();
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

  private retrieveProfileGroups(): void {
    forkJoin({
      profileGroups: this.cobblerApiService.get_profile_groups(),
      profiles: this.cobblerApiService.get_profiles(),
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: ({ profileGroups, profiles }) => {
          this.dataSource.data = profileGroups;
          this.memberNameByUid = new Map(
            profiles.map((profile) => [profile.uid, profile.name]),
          );
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
  }

  addProfileGroup(): void {
    const dialogRef = this.dialog.open(ProfileGroupCreateComponent, {
      width: '40%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'string') {
        this.router.navigate(['/items', 'profile-group', result]);
      }
    });
  }

  showProfileGroup(name: string): void {
    this.router.navigate(['/items', 'profile-group', name]);
  }

  renameProfileGroup(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemRenameComponent, {
      data: {
        itemType: 'ProfileGroup',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the profile group
        return;
      }
      this.cobblerApiService
        .get_profile_group_handle(name)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (profileGroupHandle) => {
            this.cobblerApiService
              .rename_profile_group(
                profileGroupHandle,
                newItemName,
                this.userService.token,
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.retrieveProfileGroups();
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

  deleteProfileGroup(uid: string, name: string): void {
    this.cobblerApiService
      .remove_profile_group(uid, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this.retrieveProfileGroups();
          } else {
            this._snackBar.open(
              $localize`:@@error.delete-failed:Delete failed! Check server logs for more information.`,
              $localize`:@@snackbar.action.close:Close`,
            );
          }
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
  }
}
