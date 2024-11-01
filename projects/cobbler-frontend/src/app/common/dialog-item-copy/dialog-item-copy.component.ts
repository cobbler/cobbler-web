import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  model,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogItemCopyData {
  itemType: string;
  itemName: string;
  itemUid: string;
}

@Component({
  selector: 'cobbler-dialog-item-copy',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './dialog-item-copy.component.html',
  styleUrl: './dialog-item-copy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogItemCopyComponent {
  readonly dialogRef = inject(MatDialogRef<DialogItemCopyComponent>);
  readonly dialogCloseSignal = model('');

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogItemCopyData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
