import { ItemConfig } from './types';

export const systemGroupConfig: ItemConfig = {
  type: 'system-group',
  xmlrpcType: 'system_group',
  label: 'System Group',
  overviewRoute: '/items/system-group',
  createFields: ({ name }) => ({ name }),
  editableField: { label: 'Comment', value: 'e2e edited comment' },
};
