import { Component, OnInit } from '@angular/core';
import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'app-systems',
  templateUrl: './systems.component.html',
  styleUrls: ['./systems.component.css']
})
export class SystemsComponent implements OnInit {

  systems?: any[];

  constructor(private systemService: SystemService) { }

  ngOnInit(): void {
    this.getSystems();
  }

  getSystems() {
    this.systemService.getSystems().subscribe(systems => this.systems = systems);
  }

}
