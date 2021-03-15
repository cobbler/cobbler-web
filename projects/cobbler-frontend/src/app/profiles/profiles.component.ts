import {Component, OnInit} from '@angular/core';
import {ProfileService} from '../services/profile.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  data = [];

  constructor(service: ProfileService) {
    this.data = service.getAll();
  }

  ngOnInit(): void {
  }

}
