import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogKeyValueInputReturnData {
  key: string;
  value: string;
}

@Component({
  selector: 'cobbler-dialog-key-value-input',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './dialog-key-value-input.component.html',
  styleUrl: './dialog-key-value-input.component.scss',
})
export class DialogKeyValueInputComponent {
  data: DialogKeyValueInputReturnData = { key: '', value: '' };
  readonly dialogRef = inject(MatDialogRef<DialogKeyValueInputComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): DialogKeyValueInputReturnData {
    return this.data;
  }
}
