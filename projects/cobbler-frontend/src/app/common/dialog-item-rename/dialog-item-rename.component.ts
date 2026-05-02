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

export interface DialogItemRenameData {
  itemType: string;
  itemName: string;
  itemUid: string;
}

@Component({
  selector: 'cobbler-dialog-item-rename',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './dialog-item-rename.component.html',
  styleUrl: './dialog-item-rename.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogItemRenameComponent {
  data = inject<DialogItemRenameData>(MAT_DIALOG_DATA);

  readonly dialogRef = inject(MatDialogRef<DialogItemRenameComponent>);
  readonly dialogCloseSignal = model('');

  onNoClick(): void {
    this.dialogRef.close();
  }
}
