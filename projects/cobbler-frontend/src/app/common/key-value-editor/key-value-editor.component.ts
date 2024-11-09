import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, Inject, Input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  DialogKeyValueInputComponent,
  DialogKeyValueInputReturnData,
} from '../dialog-key-value-input/dialog-key-value-input.component';

@Component({
  selector: 'cobbler-key-value-editor',
  standalone: true,
  imports: [
    MatCardModule,
    CdkDropList,
    CdkDrag,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: KeyValueEditorComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: KeyValueEditorComponent,
    },
  ],
  templateUrl: './key-value-editor.component.html',
  styleUrl: './key-value-editor.component.scss',
})
export class KeyValueEditorComponent
  implements ControlValueAccessor, Validator
{
  @Input() label = '';
  keyValueOptions: Map<string, any> = new Map<string, any>();
  onChange: any;
  onTouched: any;
  keyOrder: string[] = Array.from(this.keyValueOptions.keys());
  keyOrderFormGroup = new FormGroup({});
  isDisabled = true;

  constructor(@Inject(MatDialog) readonly dialog: MatDialog) {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnValidatorChange(fn: () => void): void {}

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.setFormGroupDisabledState(isDisabled);
  }

  setFormGroupDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.keyOrderFormGroup.disable();
    } else {
      this.keyOrderFormGroup.enable();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return undefined;
  }

  writeValue(obj: Map<string, any>): void {
    if (!(obj instanceof Map)) {
      throw new Error("obj wasn't of type Map!");
    }
    this.keyValueOptions = obj;
    this.keyOrder = Array.from(this.keyValueOptions.keys());
    this.buildFormGroup();
  }

  buildFormGroup(): void {
    for (let key of this.keyOrder) {
      const formGroupControls = {
        key: new FormControl({ value: key, disabled: true }),
        value: new FormControl({
          value: this.keyValueOptions.get(key),
          disabled: true,
        }),
      };
      this.keyOrderFormGroup.addControl(
        key + 'FormGroup',
        new FormGroup(formGroupControls),
      );
    }
    this.setFormGroupDisabledState(this.isDisabled);
  }

  deleteKey(key: string): void {
    let newOptions = new Map<string, any>(this.keyValueOptions);
    newOptions.delete(key);
    this.onChange(newOptions);
    this.onTouched();
    this.writeValue(newOptions);
  }

  addOption(): void {
    const dialogRef = this.dialog.open(DialogKeyValueInputComponent);

    dialogRef
      .afterClosed()
      .subscribe((dialogResult: DialogKeyValueInputReturnData) => {
        if (dialogResult === undefined) {
          // undefined means abort adding the key
          return;
        }
        let newOptions = new Map<string, any>(this.keyValueOptions);
        newOptions.set(dialogResult.key, dialogResult.value);
        this.onChange(newOptions);
        this.onTouched();
        this.writeValue(newOptions);
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.keyOrder, event.previousIndex, event.currentIndex);
  }

  protected readonly Object = Object;
}
