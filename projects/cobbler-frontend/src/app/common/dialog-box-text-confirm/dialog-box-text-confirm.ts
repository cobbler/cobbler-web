import {Component, Inject} from "@angular/core";
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';

export interface DialogData {
  eventId: string,
  name: string,
  eventLog: string,
}

@Component({
  selector: 'cobbler-dialog-box-text-confirm',
  templateUrl: './dialog-box-text-confirm.html',
  styleUrls: ['./dialog-box-text-confirm.css'],
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent]
})
export class DialogBoxTextConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

}
