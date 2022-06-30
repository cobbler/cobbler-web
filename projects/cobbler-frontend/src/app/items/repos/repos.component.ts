import {Component} from '@angular/core';
import {ReposService} from '../../services/repos.service';

@Component({
  selector: 'cobbler-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.css']
})
export class ReposComponent {
  data = [];

  constructor(service: ReposService) {
    this.data = service.getAll();
  }
}
