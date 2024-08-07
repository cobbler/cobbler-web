import {AsyncPipe, NgForOf} from '@angular/common';
import {ChangeDetectionStrategy, Component, forwardRef, inject, Input, OnInit, signal} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {MatDialog} from '@angular/material/dialog';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatListItem} from '@angular/material/list';
import {MatOption, MatSelectModule} from '@angular/material/select';
import {DialogTextInputComponent} from '../dialog-text-input/dialog-text-input.component';



@Component({
  selector: 'cobbler-multi-select',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatOption,
    MatLabel,
    ReactiveFormsModule,
    AsyncPipe,
    MatListItem,
    NgForOf,
    MatCheckbox,
    MatButton,
    MatIconButton,
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatFabButton,
    MatInput,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MultiSelectComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: MultiSelectComponent
    }
  ],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss'
})
export class MultiSelectComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() multiSelectOptions: Array<string> = [];
  @Input() label = "";
  matSelectOptionsFormGroup: FormGroup<{}> = new FormGroup({})
  onChange = (options: string[]) => {};
  onTouched = (options: string[]) => {};
  readonly dialog = inject(MatDialog);
  readonly optionSignal = signal('');
  isDisabled = true;

  ngOnInit(): void {
    this.buildFormGroup(this.multiSelectOptions)
  }

  buildFormGroup(options: string[], checked = false): void {
    options.forEach(value => {
      this.matSelectOptionsFormGroup.addControl(value, new FormControl({value: checked, disabled: this.isDisabled}))
    })
  }

  updateFormGroup(options: string[], checked = false): void {
    options.forEach(value => {
      this.matSelectOptionsFormGroup.get(value).setValue(checked)
    })
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.isDisabled) {
      this.matSelectOptionsFormGroup.disable();
    } else {
      this.matSelectOptionsFormGroup.enable();
    }
  }

  writeValue(obj: string[]): void {
    this.buildFormGroup(obj)
    this.updateFormGroup(obj, true)
  }

  registerOnValidatorChange(fn: () => void): void {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return undefined;
  }

  changeValues(e: MatCheckboxChange) {
    let options: string[] = []
    Object.keys(this.matSelectOptionsFormGroup.controls).forEach(key => {
      const control = this.matSelectOptionsFormGroup.get(key)
      if (control instanceof FormControl) {
        if (control.value) {
          options.push(key)
        }
      }
    })

    this.onTouched(options)
    this.onChange(options)
  }

  addOption(): void {
    const dialogRef = this.dialog.open(DialogTextInputComponent, {
      data: {data: this.optionSignal()},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.optionSignal.set(result);
        this.multiSelectOptions.push(result)
        this.buildFormGroup(this.multiSelectOptions)
      }
    });
  }

}
