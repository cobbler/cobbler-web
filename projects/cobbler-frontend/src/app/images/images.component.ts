import {Component} from '@angular/core';
import {ImagesService} from '../services/images.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent {
  data = [];

  constructor(service: ImagesService) {
    this.data = service.getAll();
  }

}
