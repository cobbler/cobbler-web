import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Settings} from '../../../../../cobbler-api/src/lib/custom-types/settings';
import {ItemSettingsService} from '../../services/item-settings.service';

interface SettingsTableRowData {
  name: string
  value: any
  type: any
}

@Component({
  selector: 'cobbler-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css']
})
export class SettingsViewComponent implements AfterViewInit {
  data = new MatTableDataSource<SettingsTableRowData>([]);
  displayedColumns: string[] = ['name', 'value', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(service: ItemSettingsService) {
    service.getAll().subscribe((data: Settings) => {
      const settings_data: SettingsTableRowData[] = []
      for (const key in data) {
        settings_data.push({name: key, value: data[key], type: typeof data[key]})
      }
      console.log(settings_data)
      this.data.data = settings_data
    });
  }

  ngAfterViewInit() {
    this.data.paginator = this.paginator;
    this.data.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();

    if (this.data.paginator) {
      this.data.paginator.firstPage();
    }
  }

  isArray(input: any): boolean {
    return Array.isArray(input)
  }
}
