import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'cobbler-text-autocomplete',
  imports: [
    MatInput,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatFormFieldModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TextAutocompleteComponent,
    },
  ],
  templateUrl: './text-autocomplete.component.html',
  styleUrl: './text-autocomplete.component.scss',
})
export class TextAutocompleteComponent
  implements ControlValueAccessor, OnInit, OnChanges
{
  @Input() label: string = '';
  @Input() options: string[] = [];
  @Input() readonly = false;

  innerControl = new FormControl('');
  filteredOptions: Observable<string[]>;

  isDisabled = false;
  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    this.filteredOptions = this.innerControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '')),
    );

    this.innerControl.valueChanges.subscribe((value) => {
      this.onChange(value);
      this.onTouched;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && !changes['options'].firstChange) {
      this.innerControl.updateValueAndValidity;
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue),
    );
  }

  writeValue(value: string): void {
    this.innerControl.setValue(value ?? '', { emitEvent: false });
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
