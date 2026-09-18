import { Component, inject } from '@angular/core';
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
  renderedData: Record<string, any>;
}

@Component({
  selector: 'cobbler-dialog-box-item-rendered',
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
  data = inject<DialogBoxItemRenderedComponentData>(MAT_DIALOG_DATA);

  jsonData: string;
  constructor() {
    this.jsonData = JSON.stringify(this.data.renderedData, null, 2);
  }
}
