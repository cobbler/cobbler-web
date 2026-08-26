import { ItemConfig } from './types';

export const imageConfig: ItemConfig = {
  type: 'image',
  xmlrpcType: 'image',
  label: 'Image',
  overviewRoute: '/items/image',
  createFields: ({ name }) => ({ name }),
  editableField: { label: 'Comment', value: 'e2e edited comment' },
};
