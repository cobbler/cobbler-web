import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService } from 'cobbler-api';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'cobbler-network-interface-overview',
  standalone: true,
  imports: [],
  templateUrl: './network-interface-overview.component.html',
  styleUrl: './network-interface-overview.component.scss',
})
export class NetworkInterfaceOverviewComponent {
  systemName: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cobblerApiService: CobblerApiService,
    private router: Router,
  ) {
    this.systemName = this.route.snapshot.paramMap.get('name');
  }
}
