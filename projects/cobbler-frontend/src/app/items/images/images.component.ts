import {Component} from '@angular/core';
import {ImagesService} from '../../services/images.service';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'cobbler-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
  standalone: true,
  imports: [RouterOutlet, MatInputModule, MatButtonModule],
})
export class ImagesComponent {
  data = [];

  constructor(service: ImagesService) {
    this.data = service.getAll();
  }

}
