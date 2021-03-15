import {Component, OnInit} from '@angular/core';
import {ReposService} from '../services/repos.service';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.css']
})
export class ReposComponent implements OnInit {
  data = [];

  constructor(service: ReposService) {
    this.data = service.getAll();
  }

  ngOnInit(): void {
  }
}
