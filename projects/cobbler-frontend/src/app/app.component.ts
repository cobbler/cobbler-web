import { Component } from "@angular/core";
import { ManageMenuComponent } from "./manage-menu/manage-menu.component";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";



@Component({
  selector: 'cobbler-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [ManageMenuComponent],
  standalone:true
})
export class AppComponent {
  constructor() {
  }
}
