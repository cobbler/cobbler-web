import {Component} from '@angular/core';
import {FilesService} from '../../services/files.service';


@Component({
  selector: 'app-app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent {
  data = [];

  constructor(service: FilesService) {
    this.data = service.getAll();
  }

}
