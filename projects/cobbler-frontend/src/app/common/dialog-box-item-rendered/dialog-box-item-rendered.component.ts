import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DialogBoxItemRenderedComponentData {
  itemType: string;
  uid: string;
  name: string;
  renderedData: Map<string, any>;
}

@Component({
  selector: 'cobbler-dialog-box-item-rendered',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './dialog-box-item-rendered.component.html',
  styleUrl: './dialog-box-item-rendered.component.scss',
})
export class DialogBoxItemRenderedComponent {
  jsonData: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogBoxItemRenderedComponentData,
  ) {
    const obj: { [key: string]: any } = {};
    data.renderedData.forEach((value, key) => {
      obj[key] = value;
    });
    this.jsonData = JSON.stringify(obj, null, 2);
  }
}
