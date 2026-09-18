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
  // CobblerApiService converts nested XML-RPC structs to/from plain objects at its own
  // boundary (Cobbler 4.0.0), so the ControlValueAccessor contract is plain-object based.
  keyValueOptions: Record<string, any> = {};
  onChange: any;
  onTouched: any;
  keyOrder: string[] = Object.keys(this.keyValueOptions);
  keyOrderFormGroup = new FormGroup({});
  isDisabled = true;
  mode: 'simple' | 'json' = 'simple';
  jsonText = '{}';
  jsonError: string | null = null;
  private onValidatorChange: (() => void) | undefined;

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

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
    return this.mode === 'json' && this.jsonError
      ? { invalidJson: this.jsonError }
      : null;
  }

  hasNestedValue(): boolean {
    return Object.values(this.keyValueOptions).some(
      (v) => v !== null && typeof v === 'object',
    );
  }

  // XML-RPC has no null/nil type either (the serializer has no case for it at all), so a value
  // like {"a": null} fails at save time with nothing but a console error unless we catch it here
  // and surface it as a regular validation error, same as malformed or non-object JSON.
  private static containsNull(value: unknown): boolean {
    if (value === null) {
      return true;
    }
    if (Array.isArray(value)) {
      return value.some((val) => KeyValueEditorComponent.containsNull(val));
    }
    if (typeof value === 'object') {
      return Object.values(value as Record<string, unknown>).some((val) =>
        KeyValueEditorComponent.containsNull(val),
      );
    }
    return false;
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
    this.jsonText = JSON.stringify(obj, null, 2);
    this.jsonError = null;
    this.mode = this.hasNestedValue() ? 'json' : 'simple';
  }

  switchToJson(): void {
    this.jsonText = JSON.stringify(this.keyValueOptions, null, 2);
    this.jsonError = null;
    this.mode = 'json';
  }

  switchToSimple(): void {
    if (this.jsonError || this.hasNestedValue()) {
      return;
    }
    this.mode = 'simple';
  }

  applyJsonText(text: string): void {
    this.jsonText = text;
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      const message = (e as Error).message;
      this.jsonError = $localize`:@@common.key-value-editor.json.error.invalid:Invalid JSON: ${message}`;
      this.onValidatorChange?.();
      return;
    }
    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      this.jsonError = $localize`:@@common.key-value-editor.json.error.not-object:Value must be a JSON object`;
      this.onValidatorChange?.();
      return;
    }
    if (KeyValueEditorComponent.containsNull(parsed)) {
      this.jsonError = $localize`:@@common.key-value-editor.json.error.null-not-supported:JSON values cannot be null - XML-RPC has no null type. Remove the key or use an empty string instead.`;
      this.onValidatorChange?.();
      return;
    }
    this.jsonError = null;
    const newOptions = parsed as Record<string, any>;
    this.keyValueOptions = newOptions;
    this.keyOrder = Object.keys(newOptions);
    this.buildFormGroup();
    this.onChange(newOptions);
    this.onTouched();
    this.onValidatorChange?.();
  }

  onJsonInput(event: Event): void {
    this.applyJsonText((event.target as HTMLTextAreaElement).value);
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
