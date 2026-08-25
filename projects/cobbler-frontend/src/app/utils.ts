import { FormControl, FormGroup } from '@angular/forms';

export enum CobblerInputChoices {
  TEXT = 'text',
  TEXT_AUTOCOMPLETE = 'text-autocomplete',
  NUMBER = 'number',
  CHECKBOX = 'checkbox',
  MULTI_SELECT = 'multi-select',
  MULTI_SELECT_STRICT_CARD = 'multi-select-strict-card',
  MULTI_SELECT_STRICT_DROPDOWN = 'multi-select-strict-dropdown',
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
  options?: string | Array<any>; // only for strict multi select
  hint?: string;
  // If set, this field is rendered inside a `cobbler-option-group` card with this text as its
  // heading, alongside every other field sharing the same group name, instead of inline in the
  // form. A display-only grouping of related flat fields (Power, Virt, DNS, TFTP, URI, ...) —
  // Cobbler 3.3.x has no backend "Option" sub-object backing them.
  group?: string;
}

export interface GroupedInputData {
  ungrouped: Array<CobblerInputData>;
  groups: Array<{ label: string; items: Array<CobblerInputData> }>;
}

export default class Utils {
  // Splits a flat list of CobblerInputData into the fields that render inline (`ungrouped`) and
  // the fields that belong to a `cobbler-option-group` card, bucketed by `group` label, in the
  // order each group first appears.
  static groupInputData(inputData: Array<CobblerInputData>): GroupedInputData {
    const ungrouped: Array<CobblerInputData> = [];
    const groupOrder: Array<string> = [];
    const groupItems = new Map<string, Array<CobblerInputData>>();

    for (const input of inputData) {
      if (!input.group) {
        ungrouped.push(input);
        continue;
      }
      if (!groupItems.has(input.group)) {
        groupOrder.push(input.group);
        groupItems.set(input.group, []);
      }
      groupItems.get(input.group)!.push(input);
    }

    return {
      ungrouped,
      groups: groupOrder.map((label) => ({
        label,
        items: groupItems.get(label)!,
      })),
    };
  }

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

  static fillupSingleFormGroup(
    formGroup: FormGroup,
    metadata: Array<CobblerInputData>,
  ): void {
    metadata.forEach((value) => {
      formGroup.addControl(
        value.formControlName,
        new FormControl({
          value: value.defaultValue,
          disabled: value.disabled,
        }),
      );
      if (value.inherited) {
        formGroup.addControl(
          value.formControlName + '_inherited',
          new FormControl({
            value: false,
            disabled: value.disabled,
          }),
        );
      }
    });
  }

  static fillupItemFormGroup(
    readonlyFormGroup: FormGroup,
    editableFormGroup: FormGroup,
    readonlyMetadata: Array<CobblerInputData>,
    editableMetadata: Array<CobblerInputData>,
  ): void {
    this.fillupSingleFormGroup(readonlyFormGroup, readonlyMetadata);
    this.fillupSingleFormGroup(editableFormGroup, editableMetadata);
  }
}
