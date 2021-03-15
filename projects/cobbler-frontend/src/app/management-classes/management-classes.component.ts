import {Component, OnInit} from '@angular/core';
import { MngclassesService } from '../services/mngclasses.service';

@Component({
  selector: 'app-management-classes',
  templateUrl: './management-classes.component.html',
  styleUrls: ['./management-classes.component.css']
})
export class ManagementClassesComponent implements OnInit {
  data = [];

  constructor(service: MngclassesService) {
    this.data = service.getAll();
  }

  ngOnInit(): void {
  }
}
