import { randomInt } from 'node:crypto';

/** Prefix every e2e-created backend object gets, so a sweep can find and delete leftovers. */
export const E2E_PREFIX = 'e2e';

/**
 * Generates a unique, human-traceable name for an e2e-created object.
 * Unique per worker + call, so fully-parallel tests never collide on the shared backend.
 * Uses crypto.randomInt (not Math.random) - purely to avoid CodeQL's insecure-randomness
 * flag on this value flowing into object names, not because uniqueness here is
 * security-sensitive.
 */
export function e2eName(workerIndex: number, type: string): string {
  return `${E2E_PREFIX}-${workerIndex}-${Date.now()}-${randomInt(1e6)}-${type}`;
}

export function isE2eName(name: string): boolean {
  return name.startsWith(`${E2E_PREFIX}-`);
}
