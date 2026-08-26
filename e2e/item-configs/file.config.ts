import { ItemConfig } from './types';

export const fileConfig: ItemConfig = {
  type: 'file',
  xmlrpcType: 'file',
  label: 'File',
  overviewRoute: '/items/file',
  createFields: ({ name }) => ({
    name,
    path: '/etc/e2e-test.conf',
    owner: 'root',
    group: 'root',
    mode: '0644',
    template: 'default.ks',
  }),
  editableField: { label: 'Comment', value: 'e2e edited comment' },
};
