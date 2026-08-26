import { ItemConfig } from '../item-configs/types';
import { ITEM_CONFIGS_BY_TYPE } from '../item-configs';
import { e2eName } from './naming';
import { CobblerXmlRpcClient } from './xmlrpc-client';

export interface AncestorRecord {
  xmlrpcType: string;
  name: string;
}

/**
 * Creates the full prerequisite chain for `config` via direct XML-RPC calls (root-first, e.g.
 * Distro before Profile before System), bypassing the UI entirely. Returns the created chain
 * (for cleanup, in creation order) and the immediate parent's name (to feed the UI create-dialog
 * of the type actually under test).
 */
export async function createAncestorChain(
  backend: CobblerXmlRpcClient,
  config: ItemConfig,
  workerIndex: number,
): Promise<{
  chain: AncestorRecord[];
  immediateParentName: string | undefined;
}> {
  const ancestorConfigs: ItemConfig[] = [];
  let current: ItemConfig | undefined = config;
  while (current?.requiresParent) {
    const parent = ITEM_CONFIGS_BY_TYPE[current.requiresParent.type];
    ancestorConfigs.unshift(parent);
    current = parent;
  }

  const chain: AncestorRecord[] = [];
  let parentName: string | undefined;
  for (const ancestor of ancestorConfigs) {
    const name = e2eName(workerIndex, ancestor.type);
    await backend.createItem(
      ancestor.xmlrpcType,
      ancestor.createFields({ name, parentName }),
    );
    chain.push({ xmlrpcType: ancestor.xmlrpcType, name });
    parentName = name;
  }
  return { chain, immediateParentName: parentName };
}

/** Best-effort teardown of a chain created by `createAncestorChain`, nearest-first. */
export async function removeAncestorChain(
  backend: CobblerXmlRpcClient,
  chain: AncestorRecord[],
): Promise<void> {
  for (const ancestor of [...chain].reverse()) {
    try {
      await backend.removeItem(ancestor.xmlrpcType, ancestor.name, true);
    } catch {
      // best-effort; global-teardown.ts sweeps anything left behind
    }
  }
}
