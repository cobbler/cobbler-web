import {Component} from '@angular/core';
import {ProfileService} from '../../services/profile.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css'],
  standalone: true,
  imports: [RouterOutlet],
})
export class ProfilesComponent {
  data = [];

  constructor(service: ProfileService) {
    this.data = service.getAll();
  }

}
