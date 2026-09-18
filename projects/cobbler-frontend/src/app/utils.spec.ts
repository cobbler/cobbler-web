import { FormBuilder } from '@angular/forms';
import Utils from './utils';

describe('Utils', () => {
  it('deduplicateDirtyValues should return the correct values', () => {
    const result = Utils.deduplicateDirtyValues(undefined, {
      redhat_management_key: '<<inherit>>',
      boot_loaders: ['grub', 'pxe', 'ipxe'],
      boot_loaders_inherited: true,
    });
    expect(result).toEqual(
      new Map<string, any>([
        ['redhat_management_key', '<<inherit>>'],
        ['boot_loaders', '<<inherit>>'],
      ]),
    );
  });

  it('isInherited recognizes the scalar and the list form of the sentinel', () => {
    expect(Utils.isInherited('<<inherit>>')).toBe(true);
    expect(Utils.isInherited(['<<inherit>>'])).toBe(true);
    expect(Utils.isInherited('grub')).toBe(false);
    expect(Utils.isInherited(['<<inherit>>', 'grub'])).toBe(false);
    expect(Utils.isInherited(['grub'])).toBe(false);
    expect(Utils.isInherited([])).toBe(false);
    expect(Utils.isInherited({})).toBe(false);
    expect(Utils.isInherited(0)).toBe(false);
    expect(Utils.isInherited(undefined)).toBe(false);
  });

  it('patchFormGroupInherited ticks the checkbox for the one-element list sentinel', () => {
    const group = new FormBuilder().group({
      boot_loaders: [[] as string[]],
      boot_loaders_inherited: [false],
    });
    Utils.patchFormGroupInherited(group, ['<<inherit>>'], 'boot_loaders', [
      'grub',
      'ipxe',
    ]);
    expect(group.value.boot_loaders).toEqual(['grub', 'ipxe']);
    expect(group.value.boot_loaders_inherited).toBe(true);
  });

  it('patchFormGroupInherited keeps concrete values and unticks the checkbox', () => {
    const group = new FormBuilder().group({
      boot_loaders: [[] as string[]],
      boot_loaders_inherited: [true],
    });
    Utils.patchFormGroupInherited(group, ['grub'], 'boot_loaders', ['ipxe']);
    expect(group.value.boot_loaders).toEqual(['grub']);
    expect(group.value.boot_loaders_inherited).toBe(false);
  });
});
