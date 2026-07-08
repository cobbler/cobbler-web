import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

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
  @Input() options: string[] = [];

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
}
