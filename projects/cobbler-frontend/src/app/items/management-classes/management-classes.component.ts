import {Component} from '@angular/core';
import {MngclassesService} from '../../services/mngclasses.service';
import { RouterOutlet } from '@angular/router';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'cobbler-management-classes',
  templateUrl: './management-classes.component.html',
  styleUrls: ['./management-classes.component.css'],
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatFormFieldModule, MatInputModule],
})
export class ManagementClassesComponent {
  data = [];

  constructor(service: MngclassesService) {
    this.data = service.getAll();
  }

}
