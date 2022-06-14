import {Component} from '@angular/core';
import {ItemSettingsService} from '../services/item-settings.service';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent {
  data = [];
  displayedColumns: string[] = ['name', 'value', 'type'];

  constructor(service: ItemSettingsService) {
    this.data = service.getAll();
  }

}
