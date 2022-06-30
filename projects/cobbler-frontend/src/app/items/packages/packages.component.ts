import {Component} from '@angular/core';
import {PackagesService} from '../../services/packages.service';

@Component({
  selector: 'cobbler-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent {
  data = [];

  constructor(service: PackagesService) {
    this.data = service.getAll();
  }
}
