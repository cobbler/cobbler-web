export interface Version {
  major: number;
  minor: number;
  patch: number;
}

export interface ExtendedVersion {
  gitdate: string;
  gitstamp: string;
  builddate: string;
  version: string;
  versionTuple: Version;
}

export interface BackgroundBuildisoOptions {
  iso: string;
  profiles: string;
  systems: string;
  buildisodir: string;
  distro: string;
  standalone: boolean;
  airgapped: boolean;
  source: string;
  excludeDNS: boolean;
  xorrisofsOpts: string;
}

export interface BackgroundAclSetupOptions {
  adduser: string;
  addgroup: string;
  removeuser: string;
  removegroup: string;
}

export interface SyncOptions {
  dhcp: boolean;
  dns: boolean;
  verbose: boolean;
}

export interface SyncSystemsOptions {
  systems: Array<string>;
  verbose: boolean;
}

export interface BackgroundReplicateOptions {
  master: string;
  port: string;
  distro_patterns: string;
  profile_patterns: string;
  system_patterns: string;
  repo_patterns: string;
  image_patterns: string;
  mgmtclass_patterns: string;
  package_patterns: string;
  file_patterns: string;
  prune: boolean;
  omit_data: boolean;
  sync_all: boolean;
  use_ssl: boolean;
}

export interface BackgroundImportOptions {
  path: string;
  name: string;
  available_as: string;
  autoinstall_file: string;
  rsync_flags: string;
  arch: string;
  breed: string;
  os_version: string;
}

export interface BackgroundReposyncOptions {
  repos: Array<string>;
  only: string;
  nofail: boolean;
  tries: number;
}

export interface BackgroundPowerSystem {
  systems: Array<string>;
  power: string;
}

export interface RegisterOptions {
  name: string;
  profile: string;
  hostname: string;
  interfaces: object;
}

export interface PagesItemsResult {
  items: object;
  pageinfo: PageInfo;
}

export interface PageInfo {
  page: number;
  prev_page: number;
  next_page: number;
  pages: Array<number>;
  num_pages: number;
  num_items: number;
  start_item: number;
  end_item: number;
  items_per_page: number;
  items_per_page_list: [10, 20, 50, 100, 200, 500];
}

export interface Event {
  id: string
  statetime: number
  name: string
  state: string
  readByWho: Array<string>
}
