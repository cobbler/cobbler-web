import {Component} from '@angular/core';
import {AppSystemsService} from '../../services/app-systems.service';

@Component({
  selector: 'app-systems',
  templateUrl: './systems.component.html',
  styleUrls: ['./systems.component.css']
})
export class SystemsComponent {
  data = [];

  constructor(service: AppSystemsService) {
    this.data = service.getAll();
  }

}
