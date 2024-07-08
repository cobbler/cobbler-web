import {Component} from '@angular/core';
import {AppSystemsService} from '../../services/app-systems.service';
import { RouterOutlet } from '@angular/router';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'cobbler-systems',
  templateUrl: './systems.component.html',
  styleUrls: ['./systems.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
})
export class SystemsComponent {
  data = [];

  constructor(service: AppSystemsService) {
    this.data = service.getAll();
  }

}
