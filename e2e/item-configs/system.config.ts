import { ItemConfig } from './types';

export const systemConfig: ItemConfig = {
  type: 'system',
  xmlrpcType: 'system',
  label: 'System',
  overviewRoute: '/items/system',
  createFields: ({ name, parentUid }) => ({
    name,
    profile: parentUid!,
  }),
  editableField: { label: 'Comment', value: 'e2e edited comment' },
  requiresParent: { type: 'profile', formControlName: 'profile' },
};
