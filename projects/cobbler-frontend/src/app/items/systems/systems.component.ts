import {Component} from '@angular/core';
import {AppSystemsService} from '../../services/app-systems.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-systems',
  templateUrl: './systems.component.html',
  styleUrls: ['./systems.component.css'],
  standalone: true,
  imports: [RouterOutlet],
})
export class SystemsComponent {
  data = [];

  constructor(service: AppSystemsService) {
    this.data = service.getAll();
  }

}
