export interface Item {
  ctime: number;
  depth: number;
  mtime: number;
  uid: string;
}

export interface Distro extends Item {
  is_subobject: boolean;
  source_repos: Array<string>;
  tree_build_time: number;
  arch: string;
  autoinstall_meta: object;
  boot_files: object;
  boot_loaders: string | Array<string>;
  breed: string;
  comment: string;
  parent: string;
  fetchable_files: object;
  initrd: string;
  kernel: string;
  remote_boot_initrd: string;
  remote_boot_kernel: string;
  remote_grub_initrd: string;
  remote_grub_kernel: string;
  kernel_options: object;
  kernel_options_post: object;
  mgmt_classes: Array<string>;
  mgmt_parameters: object;
  name: string;
  os_version: string;
  owners: string | Array<string>;
  redhat_management_key: string;
  template_files: object;
}

export interface Profile extends Item {
  autoinstall: string;
  autoinstall_meta: object;
  boot_files: Array<any>;
  comment: string;
  dhcp_tag: string;
  distro: string;
  enable_gpxe: boolean;
  enable_menu: boolean;
  fetchable_files: object;
  kernel_options: object;
  kernel_options_post: object;
  mgmt_classes: Array<any>;
  mgmt_parameters: string;
  name: string;
  name_servers: Array<any>;
  name_servers_search: Array<any>;
  next_server: string;
  filename: string;
  owners: Array<any>;
  parent: string;
  proxy: string;
  redhat_management_key: string;
  repos: Array<any>;
  server: string;
  template_files: object;
  virt_auto_boot: boolean;
  virt_bridge: string;
  virt_cpus: number;
  virt_disk_driver: string;
  virt_file_size: number;
  virt_path: string;
  virt_ram: number;
  virt_type: string;
}

export interface System extends Item {
  ipv6_autoconfiguration: boolean;
  repos_enabled: false;
  autoinstall: string;
  autoinstall_meta: object;
  boot_files: Array<any>;
  boot_loader: string;
  comment: string;
  enable_ipxe: boolean;
  fetchable_files: object;
  gateway: string;
  hostname: string;
  image: string;
  ipv6_default_device: string;
  kernel_options: object;
  kernel_options_post: object;
  mgmt_classes: Array<any>;
  mgmt_parameters: string;
  name: string;
  name_servers: Array<any>;
  name_servers_search: Array<any>;
  netboot_enabled: boolean;
  next_server: string;
  filename: string;
  owners: Array<any>;
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
  template_files: object;
  virt_auto_boot: boolean;
  virt_cpus: number;
  virt_disk_driver: string;
  virt_file_size: number;
  virt_path: string;
  virt_pxe_boot: boolean;
  virt_ram: number;
  virt_type: string;
  serial_device: number;
  serial_baud_rate: number;
}

export interface Repo extends Item {
  parent: string;
  apt_components: Array<any>;
  apt_dists: Array<any>;
  arch: string;
  breed: string;
  comment: string;
  createrepo_flags: object;
  environment: object;
  keep_updated: boolean;
  mirror: string;
  mirror_type: string;
  mirror_locally: boolean;
  name: string;
  owners: Array<any>;
  priority: number;
  proxy: string;
  rpm_list: Array<any>;
  yumopts: object;
  rsyncopts: object;
}

export interface File extends Item {
  action: string;
  comment: string;
  group: string;
  is_dir: boolean;
  mode: string;
  name: string;
  owner: string;
  owners: Array<any>;
  path: string;
  template: string;
}

export interface Image extends Item {
  parent: string;
  arch: string;
  autoinstall: string;
  breed: string;
  comment: string;
  file: string;
  image_type: string;
  name: string;
  network_count: number;
  os_version: string;
  owners: Array<any>;
  virt_auto_boot: boolean;
  virt_bridge: string;
  virt_cpus: number;
  virt_disk_driver: string;
  virt_file_size: number;
  virt_path: string;
  virt_ram: number;
  virt_type: string;
}

export interface Mgmgtclass extends Item {
  is_definition: boolean;
  class_name: string;
  comment: string;
  files: Array<any>;
  name: string;
  owners: Array<any>;
  packages: Array<any>;
  params: object;
}

export interface Package extends Item {
  action: string;
  comment: string;
  installer: string;
  name: string;
  owners: Array<any>;
  version: string;
}
