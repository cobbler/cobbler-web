import { FormGroup } from '@angular/forms';

export enum CobblerInputChoices {
  TEXT = 'text',
  NUMBER = 'number',
  CHECKBOX = 'checkbox',
  MULTI_SELECT = 'multi-select',
  KEY_VALUE = 'key-value',
}

export interface CobblerInputData {
  formControlName: string;
  inputType: CobblerInputChoices;
  label: string;
  disabled: boolean;
  readonly: boolean;
  defaultValue: any;
  inherited: boolean;
}

export default class Utils {
  static toHTML(input: string): any {
    return new DOMParser().parseFromString(input, 'text/html').documentElement
      .textContent;
  }

  static getDirtyValues(form: any): any {
    // https://stackoverflow.com/a/53613855
    let dirtyValues = {};

    Object.keys(form.controls).forEach((key) => {
      let currentControl = form.controls[key];

      if (currentControl.dirty) {
        if (currentControl.controls)
          dirtyValues[key] = this.getDirtyValues(currentControl);
        else dirtyValues[key] = currentControl.value;
      }
    });

    return dirtyValues;
  }

  static deduplicateDirtyValues(
    formGroup: FormGroup,
    values: any,
  ): Map<string, any> {
    let result = new Map<string, any>();
    for (const [key, value] of Object.entries(values)) {
      if (key.endsWith('_inherited')) {
        const nonInheritKey = key.slice(0, key.length - 10);
        if (value) {
          result.set(nonInheritKey, '<<inherit>>');
        } else {
          // Key might or might not be in the dirty map
          result.set(nonInheritKey, formGroup.get(nonInheritKey).value);
        }
      } else {
        result.set(key, value);
      }
    }
    return result;
  }

  static floatToDate(value: number): Date {
    return new Date(value * 1000);
  }

  // Method to patch a FormGroup for an inherited attribute. This is used on the item details pages.
  static patchFormGroupInherited<Type>(
    formGroup: FormGroup,
    attribute: Type | string,
    attributeName: string,
    defaultValue: Type,
  ): void {
    if (typeof attribute === 'string') {
      formGroup.patchValue({
        [`${attributeName}`]: defaultValue,
        [`${attributeName}_inherited`]: true,
      });
    } else {
      formGroup.patchValue({
        [`${attributeName}`]: attribute,
        [`${attributeName}_inherited`]: false,
      });
    }
  }
}
