import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

  profiles?: any[];

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.getProfiles();
  }

  getProfiles() {
    this.profileService.getProfiles().subscribe(profiles => this.profiles = profiles);
  }
}