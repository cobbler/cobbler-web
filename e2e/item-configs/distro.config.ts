import { ItemConfig } from './types';

export const distroConfig: ItemConfig = {
  type: 'distro',
  xmlrpcType: 'distro',
  label: 'Distro',
  overviewRoute: '/items/distro',
  createFields: ({ name }) => ({
    name,
    kernel:
      process.env['COBBLER_TEST_KERNEL_PATH'] ??
      '/code/system-tests/images/fake/vmlinuz',
    initrd:
      process.env['COBBLER_TEST_INITRD_PATH'] ??
      '/code/system-tests/images/fake/initramfs',
  }),
  editableField: { label: 'Comment', value: 'e2e edited comment' },
};
