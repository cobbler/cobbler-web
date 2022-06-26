import {Component} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Settings} from '../../../../cobbler-api/src/lib/custom-types/settings';
import {ItemSettingsService} from '../services/item-settings.service';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent {
  data = new MatTableDataSource([]);
  displayedColumns: string[] = ['name', 'value'];

  constructor(service: ItemSettingsService) {
    service.getAll().subscribe((data: Settings) => {
      const settings_data = []
      for (const key in data) {
        settings_data.push({name: key, value: data[key]})
      }
      this.data.data = settings_data
    });
  }

}
