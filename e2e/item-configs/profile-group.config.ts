import { ItemConfig } from './types';

export const profileGroupConfig: ItemConfig = {
  type: 'profile-group',
  xmlrpcType: 'profile_group',
  label: 'Profile Group',
  overviewRoute: '/items/profile-group',
  createFields: ({ name }) => ({ name }),
  editableField: { label: 'Comment', value: 'e2e edited comment' },
};
