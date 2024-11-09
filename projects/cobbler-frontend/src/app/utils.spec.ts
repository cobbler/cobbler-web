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
});
