import {Component} from '@angular/core';
import {ImagesService} from '../../services/images.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
  standalone: true,
  imports: [RouterOutlet],
})
export class ImagesComponent {
  data = [];

  constructor(service: ImagesService) {
    this.data = service.getAll();
  }

}
