import { createBackendClient } from './fixtures/backend.fixture';
import { ITEM_CONFIGS_BY_TYPE } from './item-configs';
import { isE2eName } from './fixtures/naming';

// Child-first: deleting a Distro/Profile that still has dependents would fail without `recursive`,
// and we'd rather see each type's own leftovers explicitly than rely on cascading deletes.
const SWEEP_TYPES = [
  ITEM_CONFIGS_BY_TYPE['system'].xmlrpcType,
  ITEM_CONFIGS_BY_TYPE['profile'].xmlrpcType,
  ITEM_CONFIGS_BY_TYPE['distro'].xmlrpcType,
  ITEM_CONFIGS_BY_TYPE['repository'].xmlrpcType,
  ITEM_CONFIGS_BY_TYPE['image'].xmlrpcType,
  ITEM_CONFIGS_BY_TYPE['management-class'].xmlrpcType,
  ITEM_CONFIGS_BY_TYPE['package'].xmlrpcType,
  ITEM_CONFIGS_BY_TYPE['file'].xmlrpcType,
  ITEM_CONFIGS_BY_TYPE['menu'].xmlrpcType,
];

export default async function globalTeardown(): Promise<void> {
  const client = await createBackendClient();
  for (const type of SWEEP_TYPES) {
    let names: string[];
    try {
      names = await client.getItemNames(type);
    } catch {
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

  // Templates aren't Item objects (see fixtures/xmlrpc-client.ts) — swept separately.
  try {
    const templateNames = await client.getAutoinstallTemplates();
    for (const name of templateNames.filter(isE2eName)) {
      try {
        await client.removeAutoinstallTemplate(name);
        // eslint-disable-next-line no-console
        console.log(`[e2e global-teardown] swept leftover template "${name}"`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(
          `[e2e global-teardown] failed to remove template "${name}":`,
          error,
        );
      }
    }
  } catch {
    // ignore — best-effort sweep
  }
}
