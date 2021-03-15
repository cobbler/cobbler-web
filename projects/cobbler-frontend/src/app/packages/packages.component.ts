import {Component, OnInit} from '@angular/core';
import {PackagesService} from '../services/packages.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {
  data = [];

  constructor(service: PackagesService) {
    this.data = service.getAll();
  }

  ngOnInit(): void {
  }
}
