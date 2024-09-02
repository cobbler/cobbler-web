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
import { CobblerApiService, System } from 'cobbler-api';
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
  templateUrl: './system-overview.component.html',
  styleUrl: './system-overview.component.scss',
})
export class SystemOverviewComponent implements OnInit {
  displayedColumns: string[] = ['name', 'profile', 'image', 'actions'];
  dataSource: Array<System> = [];

  @ViewChild(MatTable) table: MatTable<System>;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.retrieveSystems();
  }

  private retrieveSystems(): void {
    this.cobblerApiService.get_systems().subscribe(
      (value) => {
        this.dataSource = value;
      },
      (error) => {
        // HTML encode the error message since it originates from XML
        this._snackBar.open(this.toHTML(error.message), 'Close');
      },
    );
  }

  showSystem(uid: string, name: string): void {
    this.router.navigate(['/items', 'system', name]);
  }

  editSystem(uid: string, name: string): void {
    // TODO
  }

  deleteSystem(uid: string, name: string): void {
    this.cobblerApiService
      .remove_system(name, this.userService.token, false)
      .subscribe(
        (value) => {
          this.retrieveSystems();
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
