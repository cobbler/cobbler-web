import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormControl, FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ReactiveFormsModule,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {MatIconButton} from '@angular/material/button';
import {MatCard, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'cobbler-key-value-editor',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    CdkDropList,
    CdkDrag,
    MatFormField,
    MatInput,
    MatIconButton,
    MatIcon,
    ReactiveFormsModule,
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
      useExisting: KeyValueEditorComponent
    },
  ],
  templateUrl: './key-value-editor.component.html',
  styleUrl: './key-value-editor.component.scss'
})
export class KeyValueEditorComponent implements ControlValueAccessor, Validator{
  @Input() label = "";
  @Input() keyValueOptions = {}
  onChange = (options: string[]) => {};
  onTouched = (options: string[]) => {};
  keyOrder = Object.keys(this.keyValueOptions);
  keyOrderFormGroup = new FormGroup({})
  isDisabled = true;

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnValidatorChange(fn: () => void): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.setFormGroupDisabledState(isDisabled)
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

  writeValue(obj: any): void {
    this.keyValueOptions = obj
    this.keyOrder = Object.keys(this.keyValueOptions);
    this.buildFormGroup()
  }

  buildFormGroup(): void {
    for (let key of this.keyOrder) {
      const formGroupControls = {
        key: new FormControl({value: key, disabled: true}),
        value: new FormControl({value: this.keyValueOptions[key], disabled: true}),
      }
      this.keyOrderFormGroup.addControl(key + "FormGroup", new FormGroup(formGroupControls))
    }
    this.setFormGroupDisabledState(this.isDisabled)
  }

  deleteKey(key: string): void {
    // TODO: Delete key
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.keyOrder, event.previousIndex, event.currentIndex);
  }

  protected readonly Object = Object;
}
