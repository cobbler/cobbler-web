import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
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
import { CobblerApiService, Profile } from 'cobbler-api';
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
    MatMenuTrigger,
    MatHeaderCellDef,
  ],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.scss',
})
export class ProfileOverviewComponent implements OnInit {
  displayedColumns: string[] = ['name', 'distro', 'server', 'actions'];
  dataSource: Array<Profile> = [];

  @ViewChild(MatTable) table: MatTable<Profile>;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.retrieveProfiles();
  }

  private retrieveProfiles(): void {
    this.cobblerApiService.get_profiles().subscribe(
      (value) => {
        this.dataSource = value;
      },
      (error) => {
        // HTML encode the error message since it originates from XML
        this._snackBar.open(this.toHTML(error.message), 'Close');
      },
    );
  }

  showProfile(uid: string, name: string): void {
    this.router.navigate(['/items', 'profile', name]);
  }

  editProfile(uid: string, name: string): void {
    // TODO
  }

  deleteProfile(uid: string, name: string): void {
    this.cobblerApiService
      .remove_profile(name, this.userService.token, false)
      .subscribe(
        (value) => {
          this.retrieveProfiles();
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
