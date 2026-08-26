import { ItemConfig } from './types';

export const repositoryConfig: ItemConfig = {
  type: 'repository',
  xmlrpcType: 'repo',
  label: 'Repository',
  overviewRoute: '/items/repository',
  createFields: ({ name }) => ({ name }),
  editableField: { label: 'Comment', value: 'e2e edited comment' },
};
