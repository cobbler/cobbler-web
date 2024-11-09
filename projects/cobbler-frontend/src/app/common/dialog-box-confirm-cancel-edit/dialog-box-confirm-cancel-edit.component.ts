import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface DialogConfirmCancelData {
  name: string;
}

@Component({
  selector: 'cobbler-dialog-box-confirm-cancel-edit',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './dialog-box-confirm-cancel-edit.component.html',
  styleUrl: './dialog-box-confirm-cancel-edit.component.scss',
})
export class DialogBoxConfirmCancelEditComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogConfirmCancelData) {}
}
