import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

export interface DialogTextInputData {
  text: string;
}

@Component({
  selector: 'cobbler-dialog-text-input',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatInput,
    MatLabel,
    FormsModule,
  ],
  templateUrl: './dialog-text-input.component.html',
  styleUrl: './dialog-text-input.component.scss',
})
export class DialogTextInputComponent {
  readonly dialogRef = inject(MatDialogRef<DialogTextInputComponent>);
  readonly data = inject<DialogTextInputData>(MAT_DIALOG_DATA);
  readonly dialogCloseSignal = model(this.data.text);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
