import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
  data = inject<DialogItemCopyData>(MAT_DIALOG_DATA);

  readonly dialogRef = inject(MatDialogRef<DialogItemCopyComponent>);
  readonly dialogCloseSignal = model('');

  onNoClick(): void {
    this.dialogRef.close();
  }
}
