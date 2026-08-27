import { distroConfig } from './distro.config';
import { imageConfig } from './image.config';
import { menuConfig } from './menu.config';
import { profileConfig } from './profile.config';
import { repositoryConfig } from './repository.config';
import { systemConfig } from './system.config';
import { ItemConfig } from './types';

/**
 * "Standard" item types: all follow the identical new_<x>/modify_<x>/save_<x>/remove_<x>/
 * get_<x>_handle XML-RPC surface and the identical dialog-create / isEditMode-edit UI pattern.
 * Template, Snippet (file-content API, no Item object) and NetworkInterface (sub-resource of
 * System, modified via modify_system) are deliberately excluded — they get their own dedicated
 * specs instead of this generic, config-driven one. ManagementClass/Package/File were removed
 * entirely (no longer exist server-side as of the Cobbler 4.0.0 rewrite - no corresponding
 * frontend/api support remains either, so there's nothing left for these configs to test).
 */
export const STANDARD_ITEM_CONFIGS: ItemConfig[] = [
  distroConfig,
  profileConfig,
  systemConfig,
  repositoryConfig,
  imageConfig,
  menuConfig,
];

export const ITEM_CONFIGS_BY_TYPE: Record<string, ItemConfig> =
  Object.fromEntries(
    STANDARD_ITEM_CONFIGS.map((config) => [config.type, config]),
  );
