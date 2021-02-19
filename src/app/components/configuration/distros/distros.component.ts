import { Component, OnInit } from '@angular/core';
import { DistroService } from '../../../services/distro.service';


@Component({
  selector: 'app-distros',
  templateUrl: './distros.component.html',
  styleUrls: ['./distros.component.css']
})
export class DistrosComponent implements OnInit {

  distros?: any[];

  constructor(private distroService: DistroService) { }

  ngOnInit(): void {
    this.getDistros();
  }

  getDistros() {
    this.distroService.getDistros()
      .subscribe(distros => this.distros = distros);
  }

}
