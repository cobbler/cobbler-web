import {
  BaudRates,
  Bootloader,
  ImageTypes,
  MirrorType,
  NetworkInterfaceType,
  RepoArchs,
  RepoBreeds,
  Value,
} from './enums';
import {
  AptOption,
  DnsInterfaceOption,
  DnsOption,
  Ipv4Option,
  Ipv6Option,
  PowerOption,
  TftpOption,
  UriOption,
  VirtOption,
} from './options';
import { KernelOptionsDict } from './types';

/**
 * Mirrors ``cobbler.items.abstract.base_item.BaseItem``.
 *
 * Note: the Python attributes ``_inmemory``, ``_in_transaction``, ``_cache``, ``_has_initialized`` and
 * ``_supported_boot_loaders`` are explicitly excluded from ``to_dict()`` by ``BaseItem._is_dict_key()``, so they never
 * appear on the wire and are therefore not modelled here.
 */
export interface BaseItem {
  ctime: number;
  mtime: number;
  uid: string;
  name: string;
  comment: string;
  owners: Array<string> | string;
}

/**
 * Mirrors ``cobbler.items.abstract.inheritable_item.InheritableItem``.
 */
export interface InheritableItem extends BaseItem {
  depth: number;
  parent: string;
  is_subobject: boolean;
  children: Array<string>;
}

/**
 * Mirrors ``cobbler.items.abstract.bootable_item.BootableItem``, which derives from ``InheritableItem`` in Python.
 *
 * The four struct-backed fields below arrive as XML-RPC ``<struct>`` values. The ``typescript-xmlrpc`` deserializer
 * turns those into a native ``Map``, which ``CobblerApiService.rebuildItem()`` recursively converts back into a plain
 * object, so at runtime these are plain objects. They may alternatively be the literal string ``"<<inherit>>"``.
 */
export interface BootableItem extends InheritableItem {
  kernel_options: KernelOptionsDict | string;
  kernel_options_post: KernelOptionsDict | string;
  autoinstall_meta: Record<string, unknown> | string;
  template_files: Record<string, string>;
}

export interface GroupItem extends InheritableItem {
  members: Array<string>;
}

export interface Distro extends BootableItem {
  tree_build_time: number;
  arch: string;
  boot_loaders: Bootloader | Array<Bootloader>;
  breed: string;
  initrd: string;
  kernel: string;
  os_version: string;
  redhat_management_key: string | Value.INHERITED;
  redhat_management_org: string | Value.INHERITED;
  redhat_management_user: string | Value.INHERITED;
  redhat_management_password: string | Value.INHERITED;
  source_repos: Array<[string, string]>;
  source_tree_path: string;
  remote_boot_iso: string;
  remote_boot_kernel: string;
  remote_grub_kernel: string;
  remote_boot_initrd: string;
  remote_grub_initrd: string;
}

export interface DistroGroup extends GroupItem {}

export interface Profile extends BootableItem {
  autoinstall: string;
  boot_loaders: Bootloader | Array<Bootloader>;
  dhcp_tag: string;
  distro: string;
  dns: DnsOption;
  enable_ipxe: string | boolean;
  enable_menu: string | boolean;
  filename: string;
  tftp: TftpOption;
  proxy: string | Value.INHERITED;
  redhat_management_key: string | Value.INHERITED;
  redhat_management_org: string | Value.INHERITED;
  redhat_management_user: string | Value.INHERITED;
  redhat_management_password: string | Value.INHERITED;
  repos: Array<string> | string;
  server: string | Value.INHERITED;
  menu: string;
  display_name: string;
  virt: VirtOption;
  virt_bridge: string | Value.INHERITED;
}

export interface ProfileGroup extends GroupItem {}

export interface NetworkInterface extends BaseItem {
  bonding_opts: string;
  bridge_opts: string;
  connected_mode: boolean;
  dhcp_tag: string;
  dns: DnsInterfaceOption;
  interface_master: string;
  interface_type: NetworkInterfaceType;
  ipv4: Ipv4Option;
  ipv6: Ipv6Option;
  ipv6_static_routes: Array<string>;
  mac_address: string;
  management: boolean;
  static: boolean;
  virt_bridge: string | Value.INHERITED;
  system_uid: string;
}

export interface System extends BootableItem {
  ipv6_autoconfiguration: boolean;
  repos_enabled: boolean;
  autoinstall: string | Value.INHERITED;
  boot_loaders: Array<Bootloader>;
  dns: DnsOption;
  enable_ipxe: boolean | string;
  gateway: string;
  hostname: string;
  image: string;
  ipv6_default_device: string;
  netboot_enabled: boolean;
  tftp: TftpOption;
  filename: string;
  power: PowerOption;
  profile: string;
  proxy: string | Value.INHERITED;
  redhat_management_key: string | Value.INHERITED;
  redhat_management_org: string | Value.INHERITED;
  redhat_management_user: string | Value.INHERITED;
  redhat_management_password: string | Value.INHERITED;
  server: string | Value.INHERITED;
  status: string;
  virt: VirtOption;
  serial_device: number;
  serial_baud_rate: BaudRates;
  display_name: string;
  owners: Array<string> | string;
}

export interface SystemGroup extends GroupItem {}

export interface Repo extends BootableItem {
  breed: RepoBreeds;
  arch: RepoArchs;
  environment: Record<string, unknown>;
  yumopts: Record<string, string>;
  rsyncopts: Record<string, any>;
  mirror_type: MirrorType;
  apt: AptOption;
  createrepo_flags: string | Value.INHERITED;
  keep_updated: boolean;
  mirror: string;
  mirror_locally: boolean;
  priority: number;
  proxy: string | Value.INHERITED;
  rpm_list: Array<string>;
  os_version: string;
}

export interface Image extends BootableItem {
  arch: string;
  autoinstall: string | Value.INHERITED;
  breed: string;
  file: string;
  image_type: ImageTypes;
  network_count: number;
  os_version: string;
  boot_loaders: Array<Bootloader>;
  menu: string;
  display_name: string;
  virt: VirtOption;
  virt_bridge: string | Value.INHERITED;
}

export interface Menu extends BootableItem {
  display_name: string;
}

export interface Template extends BaseItem {
  template_type: string;
  /**
   * A nested XML-RPC ``<struct>``; recursively converted into a plain object (see the note on {@link BootableItem}).
   */
  uri: UriOption;
  built_in: boolean;
  tags: Array<string>;
  /**
   * The template body. The Python attribute is name-mangled to ``_Template__content``; ``BaseItem`` unmangles it
   * (``_dict_key_to_attribute_name()``), so it is serialized like any other field. The frontend still loads it
   * separately via ``CobblerApiService.get_template_content(uid, token)``.
   */
  content: string;
}
