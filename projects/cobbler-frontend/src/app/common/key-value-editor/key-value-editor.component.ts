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
  // The wire format for Dict-valued fields (autoinstall_meta, ...) deserializes to a Map
  // (see typescript-xmlrpc's deserializer), so the ControlValueAccessor contract stays
  // Map-based; only the JSON-mode textarea converts to/from a plain object at its boundary.
  keyValueOptions: Map<string, any> = new Map<string, any>();
  onChange: any;
  onTouched: any;
  keyOrder: string[] = Array.from(this.keyValueOptions.keys());
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
    return Array.from(this.keyValueOptions.values()).some(
      (v) => v !== null && typeof v === 'object',
    );
  }

  // The XML-RPC deserializer produces a Map for every struct, nested ones included - a value
  // with nested dict data has Maps all the way down, which JSON.stringify can't render on its
  // own (a Map has no own enumerable properties). Recursively unwrap to plain objects/arrays
  // first so the JSON-mode textarea shows the real nested data instead of "{}" placeholders.
  private static toPlainValue(value: unknown): unknown {
    if (value instanceof Map) {
      return Object.fromEntries(
        Array.from(value.entries()).map(([key, val]) => [
          key,
          KeyValueEditorComponent.toPlainValue(val),
        ]),
      );
    }
    if (Array.isArray(value)) {
      return value.map((val) => KeyValueEditorComponent.toPlainValue(val));
    }
    return value;
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

  // XML-RPC has no plain-object/dict wire type of its own - a struct is the only concept, and
  // this codebase represents one as a Map. JSON.parse() only ever produces plain objects, so
  // anything nested under a nested dict needs converting to a Map here, before it ever reaches
  // the serializer, rather than teaching the serializer a second, parallel struct representation.
  private static toDeepMap(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((val) => KeyValueEditorComponent.toDeepMap(val));
    }
    if (
      value !== null &&
      typeof value === 'object' &&
      !(value instanceof Map)
    ) {
      return new Map(
        Object.entries(value as Record<string, unknown>).map(([key, val]) => [
          key,
          KeyValueEditorComponent.toDeepMap(val),
        ]),
      );
    }
    return value;
  }

  writeValue(obj: Map<string, any>): void {
    if (!(obj instanceof Map)) {
      throw new Error("obj wasn't of type Map!");
    }
    this.keyValueOptions = obj;
    this.keyOrder = Array.from(this.keyValueOptions.keys());
    this.buildFormGroup();
    this.jsonText = JSON.stringify(
      KeyValueEditorComponent.toPlainValue(obj),
      null,
      2,
    );
    this.jsonError = null;
    this.mode = this.hasNestedValue() ? 'json' : 'simple';
  }

  switchToJson(): void {
    this.jsonText = JSON.stringify(
      KeyValueEditorComponent.toPlainValue(this.keyValueOptions),
      null,
      2,
    );
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
    const newOptions = KeyValueEditorComponent.toDeepMap(parsed) as Map<
      string,
      any
    >;
    this.keyValueOptions = newOptions;
    this.keyOrder = Array.from(newOptions.keys());
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
        if (dialogResult && dialogResult.key !== '') {
          let newOptions = new Map<string, any>(this.keyValueOptions);
          newOptions.set(dialogResult.key, dialogResult.value);
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
