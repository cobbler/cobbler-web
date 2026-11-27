import { createBackendClient } from './fixtures/backend.fixture';
import { ITEM_CONFIGS_BY_TYPE } from './item-configs';
import { isE2eName } from './fixtures/naming';

// Mirrors the backend's own safe removal order (OBJ_TYPES_REMOVE_ORDER in cobbler/actions/replicate.py):
// groups before their members, then children before parents. network_interface is omitted because
// interfaces are removed together with their owning system.
const SWEEP_TYPES = [
  'system_group',
  'profile_group',
  'distro_group',
  ITEM_CONFIGS_BY_TYPE['image'].xmlrpcType,
  ITEM_CONFIGS_BY_TYPE['system'].xmlrpcType,
  ITEM_CONFIGS_BY_TYPE['profile'].xmlrpcType,
  ITEM_CONFIGS_BY_TYPE['distro'].xmlrpcType,
  ITEM_CONFIGS_BY_TYPE['repository'].xmlrpcType,
  ITEM_CONFIGS_BY_TYPE['menu'].xmlrpcType,
  // Templates are regular items in Cobbler 4.0 (get_item_names('template'), remove_template).
  'template',
];

export default async function globalTeardown(): Promise<void> {
  const client = await createBackendClient();
  for (const type of SWEEP_TYPES) {
    let names: string[];
    try {
      names = await client.getItemNames(type);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `[e2e global-teardown] failed to list ${type} items, skipping:`,
        error,
      );
      continue;
    }
    for (const name of names.filter(isE2eName)) {
      try {
        await client.removeItem(type, name, true);
        // eslint-disable-next-line no-console
        console.log(`[e2e global-teardown] swept leftover ${type} "${name}"`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(
          `[e2e global-teardown] failed to remove ${type} "${name}":`,
          error,
        );
      }
    }
  }
}
