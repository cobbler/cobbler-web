import {Component, OnInit, ViewChild} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {Router} from '@angular/router';
import {CobblerApiService, File} from 'cobbler-api';
import {UserService} from '../../../services/user.service';

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
    MatHeaderCellDef
  ],
  templateUrl: './file-overview.component.html',
  styleUrl: './file-overview.component.scss'
})
export class FileOverviewComponent implements OnInit{
  displayedColumns: string[] = ['name', "action", "path", "actions"];
  dataSource: Array<File> = [];

  @ViewChild(MatTable) table: MatTable<File>;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.retrieveFiles()
  }

  private retrieveFiles(): void {
    this.cobblerApiService.get_files().subscribe(value => {
      this.dataSource = value
    }, error => {
      // HTML encode the error message since it originates from XML
      this._snackBar.open(this.toHTML(error.message), 'Close');
    })
  }

  showDistro(uid: string, name: string): void {
    this.router.navigate(["/items", "file", name])
  }

  editFile(uid: string, name: string): void {
    // TODO
  }

  deleteFile(uid: string, name: string): void {
    this.cobblerApiService.remove_file(name, this.userService.token, false).subscribe(value => {
      this.retrieveFiles()
    }, error => {
      // HTML encode the error message since it originates from XML
      this._snackBar.open(this.toHTML(error.message), 'Close');
    })
  }

  toHTML(input: string): any {
    // FIXME: Deduplicate method
    return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent;
  }
}
