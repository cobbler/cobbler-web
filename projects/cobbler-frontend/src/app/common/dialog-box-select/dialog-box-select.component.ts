import { Component, Inject, inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'cobbler-dialog-box-select',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-box-select.component.html',
  styleUrl: './dialog-box-select.component.scss',
})
export class DialogBoxSelectComponent {
  readonly dialogRef = inject(MatDialogRef<DialogBoxSelectComponent>);
  public data = inject<{ options: string[] }>(MAT_DIALOG_DATA);

  selectedOption = new FormControl<string | null>(null);

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): string | null {
    return this.selectedOption.value;
  }
}
