import { Component } from "@angular/core";
import { ManageMenuComponent } from "./manage-menu/manage-menu.component";


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
