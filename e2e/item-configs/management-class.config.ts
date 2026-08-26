import { ItemConfig } from './types';

export const managementClassConfig: ItemConfig = {
  type: 'management-class',
  xmlrpcType: 'mgmtclass',
  label: 'ManagementClass',
  overviewRoute: '/items/management-class',
  createFields: ({ name }) => ({ name }),
  editableField: { label: 'Comment', value: 'e2e edited comment' },
};
