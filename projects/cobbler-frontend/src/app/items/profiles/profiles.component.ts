import {Component} from '@angular/core';
import {ProfileService} from '../../services/profile.service';
import { RouterOutlet } from '@angular/router';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'cobbler-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css'],
  standalone: true,
  imports: [RouterOutlet, MatFormFieldModule, MatButtonModule, MatInputModule],
})
export class ProfilesComponent {
  data = [];

  constructor(service: ProfileService) {
    this.data = service.getAll();
  }

}
