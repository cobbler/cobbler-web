import { ItemConfig } from './types';

export const menuConfig: ItemConfig = {
  type: 'menu',
  xmlrpcType: 'menu',
  label: 'Menu',
  overviewRoute: '/items/menu',
  createFields: ({ name }) => ({ name }),
  editableField: { label: 'Comment', value: 'e2e edited comment' },
};
