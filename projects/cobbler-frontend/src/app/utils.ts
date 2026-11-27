import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { concat, defer, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, toArray } from 'rxjs/operators';

export enum CobblerInputChoices {
  TEXT = 'text',
  TEXT_AUTOCOMPLETE = 'text-autocomplete',
  NUMBER = 'number',
  CHECKBOX = 'checkbox',
  MULTI_SELECT = 'multi-select',
  MULTI_SELECT_STRICT_CARD = 'multi-select-strict-card',
  MULTI_SELECT_STRICT_DROPDOWN = 'multi-select-strict-dropdown',
  KEY_VALUE = 'key-value',
  ITEM_REFERENCE = 'item-reference',
}

export interface CobblerInputData {
  formControlName: string;
  inputType: CobblerInputChoices;
  label: string;
  disabled: boolean;
  readonly: boolean;
  defaultValue: any;
  inherited: boolean;
  // Only for strict multi select. Either a list of plain strings (value and label are identical) or a list of
  // `{ value, label }` objects (e.g. store an item uid but display the item name).
  options?: string | Array<any>;
  hint?: string;
  // If set, this field is rendered inside a `cobbler-option-group` card with this text as its
  // heading, alongside every other field sharing the same group name, instead of inline in the
  // form. Used for fields backed by a backend "ItemOption" (Power, Virt, DNS, TFTP, URI, ...).
  group?: string;
  // Only for ITEM_REFERENCE fields: the base route to the referenced item's edit page, e.g.
  // ['/items', 'distro'] — the resolved item's name is appended to build the routerLink.
  itemRoute?: Array<string>;
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

  /**
   * Runs one modify call per dirty value strictly one after another and emits once after the last one completed.
   *
   * The Cobbler XML-RPC server handles requests in parallel threads and several setters validate against other
   * attributes of the same item (e.g. a distro's `os_version` against its `breed`), so firing all modify calls at
   * once makes the outcome depend on the order in which they happen to arrive.
   *
   * @param dirtyValues The attribute names and values to modify, e.g. from {@link deduplicateDirtyValues}.
   * @param modify Creates the modify call for one attribute. It is only invoked after the previous call completed.
   * @param priority Attribute names that must be modified before all other ones, in this order. All remaining
   *                 attributes keep the order of `dirtyValues`.
   * @returns An observable that emits once - immediately if there is nothing to modify - after every modify call
   *          completed, or errors with the first failing modify call (the remaining ones are not sent).
   */
  static modifySequentially(
    dirtyValues: Map<string, any>,
    modify: (attribute: string, value: any) => Observable<unknown>,
    priority: ReadonlyArray<string> = [],
  ): Observable<void> {
    if (dirtyValues.size === 0) {
      return of(undefined);
    }
    const rank = (attribute: string): number => {
      const index = priority.indexOf(attribute);
      return index === -1 ? priority.length : index;
    };
    const orderedEntries = [...dirtyValues.entries()].sort(
      ([a], [b]) => rank(a) - rank(b),
    );
    return concat(
      ...orderedEntries.map(([attribute, value]) =>
        defer(() => modify(attribute, value)),
      ),
    ).pipe(
      toArray(),
      map(() => undefined),
    );
  }

  /**
   * Emits the given route parameter now and every time it changes.
   *
   * Angular reuses a routed component when only the parameters of its route change, e.g. when an edit page navigates
   * to the edit page of the copy it just created. Edit pages must therefore reload on every emission instead of
   * reading the route snapshot once.
   *
   * @param route The route of the component.
   * @param name The name of the route parameter.
   */
  static routeParamChanges(
    route: ActivatedRoute,
    name: string,
  ): Observable<string> {
    return route.paramMap.pipe(
      map((params) => params.get(name)),
      distinctUntilChanged(),
    );
  }

  static floatToDate(value: number): Date {
    return new Date(value * 1000);
  }

  /**
   * Whether a value returned by Cobbler marks an attribute as inherited. Scalar attributes come back as the
   * string "<<inherit>>", list attributes (e.g. boot_loaders) as the one-element list ["<<inherit>>"].
   */
  static isInherited(value: unknown): boolean {
    if (Array.isArray(value)) {
      return value.length === 1 && value[0] === '<<inherit>>';
    }
    return value === '<<inherit>>';
  }

  /**
   * Builds the reference options for an "autoinstall" field. Cobbler stores the name for built-in templates and the
   * uid for all other templates (see cobbler.validate.validate_template), so the option value follows that.
   */
  static templateReferenceOptions(
    templates: Array<{ uid: string; name: string }>,
  ): Array<{ value: string; label: string }> {
    return templates.map((template) => ({
      value: template.name.startsWith('built-in')
        ? template.name
        : template.uid,
      label: template.name,
    }));
  }

  // Method to patch a FormGroup for an inherited attribute. This is used on the item details pages.
  static patchFormGroupInherited<Type>(
    formGroup: FormGroup,
    attribute: Type | string,
    attributeName: string,
    defaultValue: Type,
  ): void {
    if (Utils.isInherited(attribute)) {
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
