import { Value, VirtDiskDrivers } from './enums';
import { ItemType } from './types';

export interface ItemOption<T extends ItemType = ItemType> {
  /**
   * Param which is used only for type-checking
   */
  readonly __itemType?: T;
}

export interface IpOption extends ItemOption<'NetworkInterface'> {
  address: string;
  static_routes: Array<string> | [];
  mtu: string;
}

export interface TftpOption extends ItemOption<'Profile' | 'System'> {
  next_server_v4: Value.INHERITED;
  next_server_v6: Value.INHERITED;
}

export interface DnsOption extends ItemOption<'Profile' | 'System'> {
  name_servers: string | Array<string> | [];
  name_servers_search: string | Array<string> | [];
}

export interface DnsInterfaceOption extends ItemOption<'NetworkInterface'> {
  name: string;
  common_names: Array<string> | [];
}

export interface VirtOption extends ItemOption<'Image' | 'Profile' | 'System'> {
  auto_boot: boolean | string | Value.INHERITED;
  cpus: number | string | Value.INHERITED;
  disk_driver: VirtDiskDrivers.INHERITED;
  file_size: number | string | Value.INHERITED;
  path: Value.INHERITED;
  pxe_boot: boolean;
  ram: number | string | Value.INHERITED;
  type: Value.INHERITED;
  uefi: boolean;
}

export interface Ipv4Option extends IpOption {
  netmask: string;
}

export interface Ipv6Option extends IpOption {
  default_gateway: string;
  prefix: string;
  secondaries: Array<string> | [];
}

export interface AptOption extends ItemOption<'Repo'> {
  components: Array<string>;
  dists: Array<string>;
}

export interface PowerOption extends ItemOption<'System'> {
  address: string;
  id: string;
  password: string;
  type: string;
  user: string;
  options: string;
  identity_file: string;
}

export interface UriOption extends ItemOption<'Template'> {
  schema: string;
  authority: string;
  path: string;
  query: string;
  fragment: string;
  path_validator?: ((path: string) => boolean) | null;
}
