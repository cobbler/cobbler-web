import { Component, OnInit } from '@angular/core';
import { EditableTreeComponent } from '../../common/editable-tree/editable-tree.component';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'cobbler-settings-edit',
  templateUrl: './settings-edit.component.html',
  styleUrls: ['./settings-edit.component.scss'],
  standalone:true,
  imports:[EditableTreeComponent, MatRadioModule]
})
export class SettingsEditComponent {

  constructor() { }

}
