import { CobblerInputChoices, CobblerInputData } from '../utils';

export const cobblerItemReadonlyData: Array<CobblerInputData> = [
  {
    formControlName: 'name',
    inputType: CobblerInputChoices.TEXT,
    label: 'Name',
    disabled: false,
    readonly: true,
    defaultValue: '',
    inherited: false,
  },
  {
    formControlName: 'uid',
    inputType: CobblerInputChoices.TEXT,
    label: 'UID',
    disabled: false,
    readonly: true,
    defaultValue: '',
    inherited: false,
  },
  {
    formControlName: 'mtime',
    inputType: CobblerInputChoices.TEXT,
    label: 'Last modified time',
    disabled: false,
    readonly: true,
    defaultValue: '',
    inherited: false,
  },
  {
    formControlName: 'ctime',
    inputType: CobblerInputChoices.TEXT,
    label: 'Creation time',
    disabled: false,
    readonly: true,
    defaultValue: '',
    inherited: false,
  },
  {
    formControlName: 'depth',
    inputType: CobblerInputChoices.NUMBER,
    label: 'Depth',
    disabled: false,
    readonly: true,
    defaultValue: 0,
    inherited: false,
  },
  {
    formControlName: 'is_subobject',
    inputType: CobblerInputChoices.CHECKBOX,
    label: 'Is Subobject?',
    disabled: false,
    readonly: true,
    defaultValue: false,
    inherited: false,
  },
];

export const cobblerItemEditableData: Array<CobblerInputData> = [
  {
    formControlName: 'comment',
    inputType: CobblerInputChoices.TEXT,
    label: 'Comment',
    disabled: true,
    readonly: false,
    defaultValue: '',
    inherited: false,
  },
];
