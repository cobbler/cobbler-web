import {DatePipe} from '@angular/common';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {CobblerApiService, InstallationStatus} from 'cobbler-api';
import {UserService} from '../../services/user.service';


@Component({
  selector: 'cobbler-status',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSort,
    DatePipe,
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'ip',
    'objType',
    'name',
    'mostRecentStart',
    'mostRecentStop',
    'seenStart',
    'seenStop',
    'state'
  ];
  dataSource: MatTableDataSource<InstallationStatus> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
  ) {
  }

  ngOnInit(): void {
    this.cobblerApiService.get_status("normal", this.userService.token).subscribe((value) => {
      console.log(value)
      this.dataSource.data = value
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
