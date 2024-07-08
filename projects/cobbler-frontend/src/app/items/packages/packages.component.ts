import {Component} from '@angular/core';
import {PackagesService} from '../../services/packages.service';
import { RouterOutlet } from '@angular/router';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'cobbler-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css'],
  standalone: true,
  imports: [RouterOutlet, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class PackagesComponent {
  data = [];

  constructor(service: PackagesService) {
    this.data = service.getAll();
  }
}
