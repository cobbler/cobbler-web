import { FormGroup } from '@angular/forms';

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
}
