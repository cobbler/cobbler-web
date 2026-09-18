import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

/**
 * A single option of the strict multi select.
 *
 * A plain string means that the stored value and the displayed label are identical. The object form allows to store
 * something that is not meant to be shown to the user (e.g. an item uid) while displaying something human readable
 * (e.g. the item name).
 */
export type MultiSelectStrictOption = string | { value: string; label: string };

@Component({
  selector: 'cobbler-multi-select-strict',
  imports: [MatFormFieldModule, MatSelectModule, MatCardModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MultiSelectStrictComponent,
    },
  ],
  templateUrl: './multi-select-strict.component.html',
  styleUrl: './multi-select-strict.component.scss',
})
export class MultiSelectStrictComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() options: Array<MultiSelectStrictOption> = [];

  value: string[] = [];
  isDisabled = false;
  onChange: (value: string[]) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(obj: string[]): void {
    this.value = obj || [];
  }
  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  selectionChange(newValue: string[]): void {
    this.value = newValue;
    this.onChange(newValue);
    this.onTouched;
  }

  /**
   * The value that is stored in the form control for the given option.
   */
  optionValue(option: MultiSelectStrictOption): string {
    return typeof option === 'string' ? option : option?.value;
  }

  /**
   * The text that is displayed to the user for the given option.
   */
  optionLabel(option: MultiSelectStrictOption): string {
    return typeof option === 'string' ? option : option?.label;
  }

  /**
   * Look up the label that belongs to a stored value.
   *
   * Falls back to the raw value in case no matching option is known. This happens for example while the options are
   * still being fetched or when the backend holds a value that no longer exists.
   */
  labelForValue(value: string): string {
    const options = Array.isArray(this.options) ? this.options : [];
    const match = options.find((option) => this.optionValue(option) === value);
    return match === undefined ? value : this.optionLabel(match);
  }
}
