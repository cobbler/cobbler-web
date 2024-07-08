import {Component} from '@angular/core';
import {ReposService} from '../../services/repos.service';
import { RouterOutlet } from '@angular/router';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'cobbler-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.css'],
  standalone: true,
  imports: [RouterOutlet, MatFormFieldModule, MatButtonModule, MatInputModule],
})
export class ReposComponent {
  data = [];

  constructor(service: ReposService) {
    this.data = service.getAll();
  }
}
