import {Component} from '@angular/core';
import {PackagesService} from '../../services/packages.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css'],
  standalone: true,
  imports: [RouterOutlet],
})
export class PackagesComponent {
  data = [];

  constructor(service: PackagesService) {
    this.data = service.getAll();
  }
}
