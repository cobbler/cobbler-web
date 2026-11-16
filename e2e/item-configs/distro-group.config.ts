import { ItemConfig } from './types';

export const distroGroupConfig: ItemConfig = {
  type: 'distro-group',
  xmlrpcType: 'distro_group',
  label: 'Distro Group',
  overviewRoute: '/items/distro-group',
  createFields: ({ name }) => ({ name }),
  editableField: { label: 'Comment', value: 'e2e edited comment' },
};
