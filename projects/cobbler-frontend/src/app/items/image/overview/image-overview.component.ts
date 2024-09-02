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
import { CobblerApiService, Image } from 'cobbler-api';
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
  templateUrl: './image-overview.component.html',
  styleUrl: './image-overview.component.scss',
})
export class ImageOverviewComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'arch',
    'breed',
    'os_version',
    'actions',
  ];
  dataSource: Array<Image> = [];

  @ViewChild(MatTable) table: MatTable<Image>;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.retrieveImages();
  }

  private retrieveImages(): void {
    this.cobblerApiService.get_images().subscribe(
      (value) => {
        this.dataSource = value;
      },
      (error) => {
        // HTML encode the error message since it originates from XML
        this._snackBar.open(this.toHTML(error.message), 'Close');
      },
    );
  }

  showImage(uid: string, name: string): void {
    this.router.navigate(['/items', 'image', name]);
  }

  editImage(uid: string, name: string): void {
    // TODO
  }

  deleteImage(uid: string, name: string): void {
    this.cobblerApiService
      .remove_distro(name, this.userService.token, false)
      .subscribe(
        (value) => {
          this.retrieveImages();
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
