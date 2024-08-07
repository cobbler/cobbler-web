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
import {CobblerApiService} from 'cobbler-api';
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
  templateUrl: './snippet-overview.component.html',
  styleUrl: './snippet-overview.component.scss'
})
export class SnippetOverviewComponent implements OnInit{
  displayedColumns: string[] = ['name', "actions"];
  dataSource: Array<string> = [];

  @ViewChild(MatTable) table: MatTable<string>;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.retrieveSnippets()
  }

  private retrieveSnippets(): void {
    this.cobblerApiService.get_autoinstall_snippets(this.userService.token).subscribe(value => {
      this.dataSource = value
    }, error => {
      // HTML encode the error message since it originates from XML
      this._snackBar.open(this.toHTML(error.message), 'Close');
    })
  }

  showSnippet(name: string): void {
    this.router.navigate(["/items", "snippet", name])
  }

  editSnippet(name: string): void {
    // TODO
  }

  deleteSnippet(name: string): void {
    this.cobblerApiService.remove_autoinstall_snippet(name, this.userService.token).subscribe(value => {
      this.retrieveSnippets()
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
