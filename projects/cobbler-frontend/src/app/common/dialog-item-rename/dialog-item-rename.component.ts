import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
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
  standalone: true,
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
  readonly dialogRef = inject(MatDialogRef<DialogItemRenameComponent>);
  readonly dialogCloseSignal = model('');

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogItemRenameData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
