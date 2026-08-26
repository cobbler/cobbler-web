/** Prefix every e2e-created backend object gets, so a sweep can find and delete leftovers. */
export const E2E_PREFIX = 'e2e';

/**
 * Generates a unique, human-traceable name for an e2e-created object.
 * Unique per worker + call, so fully-parallel tests never collide on the shared backend.
 */
export function e2eName(workerIndex: number, type: string): string {
  return `${E2E_PREFIX}-${workerIndex}-${Date.now()}-${Math.floor(Math.random() * 1e6)}-${type}`;
}

export function isE2eName(name: string): boolean {
  return name.startsWith(`${E2E_PREFIX}-`);
}
