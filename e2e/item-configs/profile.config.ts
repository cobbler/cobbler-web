import { ItemConfig } from './types';

export const profileConfig: ItemConfig = {
  type: 'profile',
  xmlrpcType: 'profile',
  label: 'Profile',
  overviewRoute: '/items/profile',
  createFields: ({ name, parentName }) => ({
    name,
    distro: parentName!,
  }),
  editableField: { label: 'Comment', value: 'e2e edited comment' },
  requiresParent: { type: 'distro', formControlName: 'distro' },
};
