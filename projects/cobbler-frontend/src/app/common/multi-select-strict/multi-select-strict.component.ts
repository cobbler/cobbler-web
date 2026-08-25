import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import {
  MatChipGrid,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { HelpButtonComponent } from '../help-button/help-button.component';

/**
 * A single option of the strict multi select.
 *
 * A plain string means that the stored value and the displayed label are identical. The object form allows to store
 * something that is not meant to be shown to the user (e.g. an item uid) while displaying something human readable
 * (e.g. the item name).
 */
export type MultiSelectStrictOption = string | { value: string; label: string };

/**
 * Chip-grid + autocomplete multi-select of existing options only (no free-text entry — hence
 * "strict"): selected values render as removable chips, each linked to its item's edit page when
 * `itemRoute` is set (e.g. group members). Typing filters an autocomplete panel of the remaining,
 * not-yet-selected options; picking one adds it as a chip.
 */
@Component({
  selector: 'cobbler-multi-select-strict',
  imports: [
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    RouterLink,
    HelpButtonComponent,
  ],
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
export class MultiSelectStrictComponent
  implements ControlValueAccessor, OnChanges
{
  @Input() label = '';
  @Input() options: Array<MultiSelectStrictOption> = [];
  // e.g. ['/items', 'distro'] — when set, each selected chip links to that item's edit page.
  @Input() itemRoute?: Array<string>;
  @Input() hint?: string;

  @ViewChild(MatChipGrid) chipGrid: MatChipGrid;

  value: string[] = [];
  isDisabled = false;
  inputControl = new FormControl('');
  filteredOptions: Array<MultiSelectStrictOption> = [];

  onChange: (value: string[]) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.inputControl.valueChanges.subscribe((searchValue) => {
      this.updateFilteredOptions(searchValue);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // `options` typically arrives asynchronously (fetched after the item itself), so re-filter
    // once it does, rather than only on the next keystroke.
    if (changes['options']) {
      this.updateFilteredOptions(this.inputControl.value);
    }
  }

  writeValue(obj: string[]): void {
    this.value = obj || [];
    this.updateFilteredOptions(this.inputControl.value);
  }
  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.inputControl.disable({ emitEvent: false });
    } else {
      this.inputControl.enable({ emitEvent: false });
    }
  }

  /** Adds the option picked from the autocomplete panel and clears the search input. */
  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    if (!this.value.includes(value)) {
      this.value = [...this.value, value];
      this.onChange(this.value);
      this.onTouched();
    }
    this.inputControl.setValue('');
  }

  /** Strict: typing free text and pressing enter never adds anything — only autocomplete picks do. */
  inputTokenEnd(event: MatChipInputEvent): void {
    event.chipInput.clear();
    this.inputControl.setValue('');
  }

  remove(value: string): void {
    this.value = this.value.filter((existing) => existing !== value);
    this.onChange(this.value);
    this.onTouched();
    this.updateFilteredOptions(this.inputControl.value);
  }

  private updateFilteredOptions(searchValue: string | null): void {
    const filterValue = (searchValue ?? '').toLowerCase();
    this.filteredOptions = this.options.filter((option) => {
      const value = this.optionValue(option);
      if (this.value.includes(value)) {
        // Already selected — no point in also offering it as a suggestion.
        return false;
      }
      return (
        this.optionLabel(option).toLowerCase().includes(filterValue) ||
        value.toLowerCase().includes(filterValue)
      );
    });
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
