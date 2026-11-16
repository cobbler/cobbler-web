import { expect, test } from '../../fixtures/auth.fixture';
import {
  createAncestorChain,
  removeAncestorChain,
} from '../../fixtures/ancestors';
import { e2eName } from '../../fixtures/naming';
import { distroGroupConfig } from '../../item-configs/distro-group.config';
import { profileGroupConfig } from '../../item-configs/profile-group.config';
import { systemGroupConfig } from '../../item-configs/system-group.config';
import { ITEM_CONFIGS_BY_TYPE } from '../../item-configs';
import { ItemConfig } from '../../item-configs/types';

/**
 * DistroGroup/ProfileGroup/SystemGroup's "members" field stores member uids, but
 * MultiSelectStrictComponent renders each as a linked chip showing the resolved member *name*
 * (see labelForValue() in multi-select-strict.component.html) - this is the e2e counterpart of
 * the unit-test fix for the same "names instead of uids" chip-rendering behavior. Member
 * objects are created directly via XML-RPC (bypassing the UI, like createAncestorChain), since
 * driving the chip-grid's autocomplete input is out of scope for this regression check.
 */
interface GroupMembershipCase {
  groupConfig: ItemConfig;
  memberType: string;
}

const CASES: GroupMembershipCase[] = [
  { groupConfig: distroGroupConfig, memberType: 'distro' },
  { groupConfig: profileGroupConfig, memberType: 'profile' },
  { groupConfig: systemGroupConfig, memberType: 'system' },
];

for (const { groupConfig, memberType } of CASES) {
  test.describe(`${groupConfig.label} membership`, () => {
    test(`shows member ${memberType} names, not uids, as linked chips`, async ({
      page,
      backend,
    }, testInfo) => {
      const memberConfig = ITEM_CONFIGS_BY_TYPE[memberType];
      const { chain, immediateParentUid } = await createAncestorChain(
        backend,
        memberConfig,
        testInfo.parallelIndex,
      );

      const memberName = e2eName(testInfo.parallelIndex, memberType);
      const groupName = e2eName(testInfo.parallelIndex, groupConfig.type);

      const memberUid = await backend.createItem(
        memberConfig.xmlrpcType,
        memberConfig.createFields({
          name: memberName,
          parentUid: immediateParentUid,
        }),
      );
      await backend.createItem(groupConfig.xmlrpcType, {
        name: groupName,
        members: [memberUid],
      });

      try {
        await page.goto(`${groupConfig.overviewRoute}/${groupName}`);

        const memberChip = page
          .locator('mat-chip-row')
          .filter({ hasText: memberName });
        await expect(memberChip).toBeVisible();
        // The chip must show the resolved name, never the raw uid.
        await expect(memberChip).not.toContainText(memberUid);
        await expect(
          memberChip.getByRole('link', { name: memberName }),
        ).toBeVisible();
      } finally {
        await backend
          .removeItem(groupConfig.xmlrpcType, groupName, true)
          .catch(() => {});
        await backend
          .removeItem(memberConfig.xmlrpcType, memberName, true)
          .catch(() => {});
        await removeAncestorChain(backend, chain);
      }
    });
  });
}
