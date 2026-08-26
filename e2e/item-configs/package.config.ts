import { ItemConfig } from './types';

export const packageConfig: ItemConfig = {
  type: 'package',
  xmlrpcType: 'package',
  label: 'Package',
  overviewRoute: '/items/package',
  createFields: ({ name }) => ({ name }),
  editableField: { label: 'Comment', value: 'e2e edited comment' },
};
