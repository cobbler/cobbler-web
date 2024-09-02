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
import { CobblerApiService, Package } from 'cobbler-api';
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
  templateUrl: './package-overview.component.html',
  styleUrl: './package-overview.component.scss',
})
export class PackageOverviewComponent implements OnInit {
  displayedColumns: string[] = ['name', 'installer', 'version', 'actions'];
  dataSource: Array<Package> = [];

  @ViewChild(MatTable) table: MatTable<Package>;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.retrievePackages();
  }

  private retrievePackages(): void {
    this.cobblerApiService.get_packages().subscribe(
      (value) => {
        this.dataSource = value;
      },
      (error) => {
        // HTML encode the error message since it originates from XML
        this._snackBar.open(this.toHTML(error.message), 'Close');
      },
    );
  }

  showPackage(uid: string, name: string): void {
    this.router.navigate(['/items', 'package', name]);
  }

  editPackage(uid: string, name: string): void {
    // TODO
  }

  deletePackage(uid: string, name: string): void {
    this.cobblerApiService
      .remove_package(name, this.userService.token, false)
      .subscribe(
        (value) => {
          this.retrievePackages();
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
