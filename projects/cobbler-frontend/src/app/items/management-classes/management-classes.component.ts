import {Component} from '@angular/core';
import {MngclassesService} from '../../services/mngclasses.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-management-classes',
  templateUrl: './management-classes.component.html',
  styleUrls: ['./management-classes.component.css'],
  standalone: true,
  imports: [RouterOutlet],
})
export class ManagementClassesComponent {
  data = [];

  constructor(service: MngclassesService) {
    this.data = service.getAll();
  }

}
