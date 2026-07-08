import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { DialogTextInputComponent } from '../dialog-text-input/dialog-text-input.component';
import { DialogBoxSelectComponent } from '../dialog-box-select/dialog-box-select.component';
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';

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
  @Input() label = '';
  @Input() availableOptions: string[] | null = null; // options come from API response, user can't add any more (used for mgmt classes)
  @Input() section: string = '';

  multiSelectOptions: Array<string> = [];
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
    this.multiSelectOptions = this.currentValue;
    this.buildFormGroup(this.multiSelectOptions);
    this.multiSelectOptions.forEach((opt) => {
      this.matSelectOptionsFormGroup.get(opt)?.setValue(true);
    });
  }

  registerOnValidatorChange(fn: () => void): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    return undefined;
  }

  changeValues(event: MatCheckboxChange, option: string) {
    if (!event.checked) {
      // Remove the checkbox if it's clicked
      this.matSelectOptionsFormGroup.removeControl(option);
      this.multiSelectOptions = this.multiSelectOptions.filter(
        (o) => o !== option,
      );
      this.currentValue = this.currentValue.filter((o) => o !== option);
    }

    const options = Object.keys(this.matSelectOptionsFormGroup.controls).filter(
      (key) => {
        const control = this.matSelectOptionsFormGroup.get(key);
        return control instanceof FormControl && control.value;
      },
    );

    this.onTouched(options);
    this.onChange(options);
  }

  addOption(): void {
    let dialogRef: MatDialogRef<any, any>;
    // Dialog with select for management class
    if (this.section === 'mgmt_classes') {
      dialogRef = this.dialog.open(DialogBoxSelectComponent, {
        data: {
          // Filter the array to avoid duplication of options
          options: (this.availableOptions ?? []).filter(
            (o) => !this.currentValue.includes(o) && o !== undefined,
          ),
        },
      });
    } else {
      dialogRef = this.dialog.open(DialogTextInputComponent);
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newOptions = Array.from(this.currentValue);
        newOptions.push(result);
        this.onChange(newOptions);
        this.onTouched();
        this.writeValue(newOptions);
      }
    });
  }
}
