export interface Item {
  ctime: number;
  depth: number;
  mtime: number;
  uid: string;
}

export interface BootableItem extends Item {
  kernel_options: string | Map<string, any>;
  kernel_options_post: string | Map<string, any>;
  mgmt_classes: string | Array<any>;
  mgmt_parameters: Map<string, any> | string;
  is_subobject: boolean;
  fetchable_files: string | Map<string, any>;
  parent: string;
  autoinstall_meta: string | Map<string, any>;
  boot_files: string | Map<string, any>;
  template_files: string | Map<string, any>;
}

export interface Distro extends BootableItem {
  source_repos: Array<string>;
  tree_build_time: number;
  arch: string;
  boot_loaders: string | Array<string>;
  breed: string;
  comment: string;
  initrd: string;
  kernel: string;
  remote_boot_initrd: string;
  remote_boot_kernel: string;
  remote_grub_initrd: string;
  remote_grub_kernel: string;
  name: string;
  os_version: string;
  owners: string | Array<string>;
  redhat_management_key: string;
}

export interface Profile extends BootableItem {
  boot_loaders: string | Array<string>;
  autoinstall: string;
  comment: string;
  dhcp_tag: string;
  distro: string;
  enable_ipxe: string | boolean;
  enable_menu: string | boolean;
  menu: string;
  name: string;
  name_servers: Array<any>;
  name_servers_search: Array<any>;
  next_server_v4: string;
  next_server_v6: string;
  filename: string;
  owners: string | Array<string>;
  proxy: string;
  redhat_management_key: string;
  repos: Array<any>;
  server: string;
  virt_auto_boot: string | boolean;
  virt_bridge: string;
  virt_cpus: string | number;
  virt_disk_driver: string;
  virt_file_size: string | number;
  virt_path: string;
  virt_ram: string | number;
  virt_type: string;
}

export interface NetworkInterface {
  bonding_opts: string;
  bridge_opts: string;
  cnames: Array<string>;
  connected_mode: boolean;
  dhcp_tag: string;
  dns_name: string;
  if_gateway: string;
  interface_master: string;
  interface_type: string;
  ip_address: string;
  ipv6_address: string;
  ipv6_default_gateway: string;
  ipv6_mtu: string;
  ipv6_prefix: string;
  ipv6_secondaries: Array<string>;
  ipv6_static_routes: Array<string>;
  mac_address: string;
  management: boolean;
  mtu: string;
  netmask: string;
  static: boolean;
  static_routes: Array<string>;
  virt_bridge: string;
}

export interface System extends BootableItem {
  ipv6_autoconfiguration: boolean;
  repos_enabled: boolean;
  autoinstall: string;
  interfaces: Map<string, Map<string, any>>;
  boot_loaders: string | Array<string>;
  comment: string;
  enable_ipxe: string | boolean;
  gateway: string;
  hostname: string;
  image: string;
  ipv6_default_device: string;
  name: string;
  name_servers: Array<any>;
  name_servers_search: Array<any>;
  netboot_enabled: boolean;
  next_server_v4: string;
  next_server_v6: string;
  filename: string;
  owners: string | Array<string>;
  power_address: string;
  power_id: string;
  power_pass: string;
  power_type: string;
  power_user: string;
  power_options: string;
  power_identity_file: string;
  profile: string;
  proxy: string;
  redhat_management_key: string;
  server: string;
  status: string;
  virt_auto_boot: string | boolean;
  virt_cpus: string | number;
  virt_disk_driver: string;
  virt_file_size: string | number;
  virt_path: string;
  virt_pxe_boot: boolean;
  virt_ram: string | number;
  virt_type: string;
  serial_device: number;
  serial_baud_rate: number;
}

export interface Repo extends BootableItem {
  os_version: string;
  apt_components: Array<any>;
  apt_dists: Array<any>;
  arch: string;
  breed: string;
  comment: string;
  createrepo_flags: string;
  environment: Map<string, any>;
  keep_updated: boolean;
  mirror: string;
  mirror_type: string;
  mirror_locally: boolean;
  name: string;
  owners: string | Array<string>;
  priority: number;
  proxy: string;
  rpm_list: Array<any>;
  yumopts: Map<string, any>;
  rsyncopts: Map<string, any>;
}

export interface File extends BootableItem {
  action: string;
  comment: string;
  group: string;
  is_dir: boolean;
  mode: string;
  name: string;
  owner: string;
  owners: string | Array<string>;
  path: string;
  template: string;
}

export interface Image extends BootableItem {
  boot_loaders: string | Array<string>;
  menu: string;
  arch: string;
  autoinstall: string;
  breed: string;
  comment: string;
  file: string;
  image_type: string;
  name: string;
  network_count: number;
  os_version: string;
  owners: string | Array<string>;
  virt_auto_boot: string | boolean;
  virt_bridge: string;
  virt_cpus: string | number;
  virt_disk_driver: string;
  virt_file_size: string | number;
  virt_path: string;
  virt_ram: string | number;
  virt_type: string;
}

export interface Mgmgtclass extends BootableItem {
  is_definition: boolean;
  class_name: string;
  comment: string;
  files: Array<any>;
  name: string;
  owners: string | Array<string>;
  packages: Array<any>;
  params: Map<string, any>;
}

export interface Package extends BootableItem {
  mode: string;
  owner: string;
  group: string;
  path: string;
  template: string;
  action: string;
  comment: string;
  installer: string;
  name: string;
  owners: string | Array<string>;
  version: string;
}

export interface Menu extends BootableItem {
  name: string;
  comment: string;
  owners: string | Array<string>;
  display_name: string;
  children: Array<string>;
}
