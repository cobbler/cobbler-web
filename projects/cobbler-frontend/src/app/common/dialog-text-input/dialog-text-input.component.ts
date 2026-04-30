import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogTextInputData {
  text: string;
}

@Component({
    selector: 'cobbler-dialog-text-input',
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        FormsModule,
    ],
    templateUrl: './dialog-text-input.component.html',
    styleUrl: './dialog-text-input.component.scss'
})
export class DialogTextInputComponent {
  readonly dialogRef = inject(MatDialogRef<DialogTextInputComponent>);
  public data: string;

  constructor() {
    this.data = '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): string {
    return this.data;
  }
}
