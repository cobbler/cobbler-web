import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { DialogTextInputComponent } from '../dialog-text-input/dialog-text-input.component';

@Component({
  selector: 'cobbler-multi-select',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatListModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
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
      useExisting: MultiSelectComponent,
    },
  ],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
})
export class MultiSelectComponent
  implements ControlValueAccessor, Validator, OnChanges
{
  multiSelectOptions: Array<string> = [];
  @Input() label = '';
  @Input() availableOptions: string[] | null = null;
  @Input() allowAdd = true;
  matSelectOptionsFormGroup: FormGroup<{}> = new FormGroup({});
  private currentValue: string[] = [];
  onChange: any;
  onTouched: any;
  readonly dialog = inject(MatDialog);
  isDisabled = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['availableOptions'] &&
      !changes['availableOptions'].firstChange
    ) {
      this.writeValue(this.currentValue);
    }
  }

  buildFormGroup(options: string[], checked = false): void {
    options.forEach((value) => {
      this.matSelectOptionsFormGroup.addControl(
        value,
        new FormControl({ value: checked, disabled: this.isDisabled }),
      );
    });
  }

  updateFormGroup(options: string[], checked = false): void {
    options.forEach((value) => {
      this.matSelectOptionsFormGroup.get(value).setValue(checked);
    });
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
    this.currentValue = obj || [];
    this.multiSelectOptions = this.availableOptions ?? this.currentValue;
    this.buildFormGroup(this.multiSelectOptions);
    this.multiSelectOptions.forEach((opt) => {
      this.matSelectOptionsFormGroup
        .get(opt)
        ?.setValue(this.currentValue.includes(opt));
    });
  }

  registerOnValidatorChange(fn: () => void): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    return undefined;
  }

  changeValues(e: MatCheckboxChange) {
    let options: string[] = [];
    Object.keys(this.matSelectOptionsFormGroup.controls).forEach((key) => {
      const control = this.matSelectOptionsFormGroup.get(key);
      if (control instanceof FormControl) {
        if (control.value) {
          options.push(key);
        }
      }
    });

    this.onTouched(options);
    this.onChange(options);
  }

  addOption(): void {
    const dialogRef = this.dialog.open(DialogTextInputComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) {
        return;
      }
      const newOptions = Array.from(this.multiSelectOptions);
      newOptions.push(result);
      this.onChange(newOptions);
      this.onTouched();
      this.writeValue(newOptions);
    });
  }
}
