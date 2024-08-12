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
import {CobblerApiService, Repo} from 'cobbler-api';
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
    MatHeaderCellDef,
    MatMenuTrigger
  ],
  templateUrl: './repository-overview.component.html',
  styleUrl: './repository-overview.component.scss'
})
export class RepositoryOverviewComponent implements OnInit {
  displayedColumns: string[] = ['name', "breed", "mirror_type", "actions"];
  dataSource: Array<Repo> = [];

  @ViewChild(MatTable) table: MatTable<Repo>;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.retrieveRepositories()
  }

  private retrieveRepositories(): void {
    this.cobblerApiService.get_repos().subscribe(value => {
      this.dataSource = value
    }, error => {
      // HTML encode the error message since it originates from XML
      this._snackBar.open(this.toHTML(error.message), 'Close');
    })
  }

  showRepository(uid: string, name: string): void {
    this.router.navigate(["/items", "repository", name])
  }

  editRepository(uid: string, name: string): void {
    // TODO
  }

  deleteRepository(uid: string, name: string): void {
    this.cobblerApiService.remove_repo(name, this.userService.token, false).subscribe(value => {
      this.retrieveRepositories()
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
