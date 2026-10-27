import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, Input, inject } from '@angular/core';
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
import { HelpButtonComponent } from '../help-button/help-button.component';

@Component({
  selector: 'cobbler-key-value-editor',
  imports: [
    MatCardModule,
    CdkDropList,
    CdkDrag,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    HelpButtonComponent,
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
  readonly dialog = inject<MatDialog>(MatDialog);

  @Input() label = '';
  @Input() hint?: string;
  keyValueOptions: Record<string, any> = {};
  onChange: any;
  onTouched: any;
  keyOrder: string[] = Object.keys(this.keyValueOptions);
  keyOrderFormGroup = new FormGroup({});
  isDisabled = true;

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

  writeValue(obj: Record<string, any>): void {
    if (
      typeof obj !== 'object' ||
      obj === null ||
      obj instanceof Map ||
      Array.isArray(obj)
    ) {
      throw new Error("obj wasn't of type Record<string, any>!");
    }
    this.keyValueOptions = obj;
    this.keyOrder = Object.keys(this.keyValueOptions);
    this.buildFormGroup();
  }

  buildFormGroup(): void {
    for (let key of this.keyOrder) {
      const formGroupControls = {
        key: new FormControl({ value: key, disabled: true }),
        value: new FormControl({
          value: this.keyValueOptions[key],
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
    let newOptions = { ...this.keyValueOptions };
    delete newOptions[key];
    this.onChange(newOptions);
    this.onTouched();
    this.writeValue(newOptions);
  }

  addOption(): void {
    const dialogRef = this.dialog.open(DialogKeyValueInputComponent);

    dialogRef
      .afterClosed()
      .subscribe((dialogResult: DialogKeyValueInputReturnData) => {
        if (dialogResult && dialogResult.key !== '') {
          let newOptions = {
            ...this.keyValueOptions,
            [dialogResult.key]: dialogResult.value,
          };
          this.onChange(newOptions);
          this.onTouched();
          this.writeValue(newOptions);
        } else {
          return;
        }
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.keyOrder, event.previousIndex, event.currentIndex);
  }

  protected readonly Object = Object;
}
