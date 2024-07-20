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
import {CobblerApiService, Mgmgtclass} from 'cobbler-api';
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
  templateUrl: './management-class-overview.component.html',
  styleUrl: './management-class-overview.component.scss'
})
export class ManagementClassOverviewComponent implements OnInit {
  displayedColumns: string[] = ['name', "class_name", "is_definition", "actions"];
  dataSource: Array<Mgmgtclass> = [];

  @ViewChild(MatTable) table: MatTable<Mgmgtclass>;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.retrieveManagementClasses()
  }

  private retrieveManagementClasses(): void {
    this.cobblerApiService.get_mgmtclasses().subscribe(value => {
      this.dataSource = value
    }, error => {
      // HTML encode the error message since it originates from XML
      this._snackBar.open(this.toHTML(error.message), 'Close');
    })
  }

  showManagementClass(uid: string, name: string): void {
    this.router.navigate(["/items", "management-class", name])
  }

  editManagementClass(uid: string, name: string): void {
    // TODO
  }

  deleteManagementClass(uid: string, name: string): void {
    this.cobblerApiService.remove_mgmtclass(name, this.userService.token, false).subscribe(value => {
      this.retrieveManagementClasses()
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
