import { expect } from 'vitest';

/**
 * Asserts that a serialized `save_<type>` XML-RPC request enables triggers and sync (both `true`) and uses the given
 * editmode. `new` is required when creating an item (duplicate-name check), `bypass` when editing one.
 */
export function expectSaveArguments(
  body: string,
  editMode: 'new' | 'bypass',
): void {
  expect(body).not.toContain('<boolean>0</boolean>');
  expect(body).toMatch(
    new RegExp(
      `<boolean>1</boolean>[\\s\\S]*<boolean>1</boolean>[\\s\\S]*<string>${editMode}</string>`,
    ),
  );
}
