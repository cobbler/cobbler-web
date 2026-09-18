import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { HelpButtonComponent } from '../help-button/help-button.component';

export interface ItemReferenceOption {
  value: string;
  label: string;
}

/**
 * Displays and edits a field whose real value is another item's uid (e.g. Profile.distro,
 * System.profile): the raw uid stays the value written back on save, but the resolved item's
 * name is shown as a link to that item's edit page whenever the uid matches a known option, and
 * the available options are offered as autocomplete suggestions (by name) while typing.
 */
@Component({
  selector: 'cobbler-item-reference',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatChipsModule,
    ReactiveFormsModule,
    RouterLink,
    HelpButtonComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ItemReferenceComponent,
    },
  ],
  templateUrl: './item-reference.component.html',
  styleUrl: './item-reference.component.scss',
})
export class ItemReferenceComponent implements ControlValueAccessor, OnChanges {
  @Input() label = '';
  @Input() options: Array<ItemReferenceOption> = [];
  // e.g. ['/items', 'distro'] — the resolved item's name is appended to build the routerLink.
  @Input() itemRoute: Array<string> = [];
  @Input() hint?: string;

  innerControl = new FormControl('');
  filteredOptions: Array<ItemReferenceOption> = [];

  isDisabled = false;
  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.innerControl.valueChanges.subscribe((value) => {
      this.updateFilteredOptions(value);
      this.onChange(value);
      this.onTouched();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // `options` typically arrives asynchronously (fetched after the item itself), so re-filter
    // against the current value once it does, rather than only on the next keystroke.
    if (changes['options']) {
      this.updateFilteredOptions(this.innerControl.value);
    }
  }

  get resolvedOption(): ItemReferenceOption | undefined {
    const value = this.innerControl.value;
    if (!value) {
      return undefined;
    }
    return this.options.find((option) => option.value === value);
  }

  private updateFilteredOptions(searchValue: string | null): void {
    const filterValue = (searchValue ?? '').toLowerCase();
    this.filteredOptions = this.options.filter(
      (option) =>
        option.label.toLowerCase().includes(filterValue) ||
        option.value.toLowerCase().includes(filterValue),
    );
  }

  writeValue(value: string): void {
    this.innerControl.setValue(value ?? '', { emitEvent: false });
    this.updateFilteredOptions(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.innerControl.disable({ emitEvent: false });
    } else {
      this.innerControl.enable({ emitEvent: false });
    }
  }
}
