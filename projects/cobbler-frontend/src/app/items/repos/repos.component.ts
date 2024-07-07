import {Component} from '@angular/core';
import {ReposService} from '../../services/repos.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cobbler-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.css'],
  standalone: true,
  imports: [RouterOutlet],
})
export class ReposComponent {
  data = [];

  constructor(service: ReposService) {
    this.data = service.getAll();
  }
}
