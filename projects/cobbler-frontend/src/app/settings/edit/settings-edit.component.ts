import { Component, OnInit } from '@angular/core';
import { EditableTreeComponent } from '../../common/editable-tree/editable-tree.component';
import { MatRadioModule } from '@angular/material/radio';
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'cobbler-settings-edit',
  templateUrl: './settings-edit.component.html',
  styleUrls: ['./settings-edit.component.scss'],
  standalone: true,
  imports: [EditableTreeComponent, MatRadioModule, MatInputModule]
})
export class SettingsEditComponent {

  constructor() { }

}
