import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // mockdata python=>JS conversion
  // python Bool => JS bool
  // python None => ''None''
  // python method() => 'method()'

  mockdata = [
    ['autoinstall', 'SETTINGS:default_autoinstall', '<<inherit>>', 'Automatic Installation Template', true, 'Path to automatic installation template', 0, 'str'],
    ['autoinstall_meta', {}, '<<inherit>>', 'Automatic Installation Metadata', true, 'Ex: dog=fang agent=86', 0, 'dict'],
    ['boot_files', {}, '<<inherit>>', 'TFTP Boot Files', true, 'Files copied into tftpboot beyond the kernel/initrd', 0, 'list'],
    ['comment', '', '', 'Comment', true, 'Free form text description', 0, 'str'],
    ['dhcp_tag', 'default', '<<inherit>>', 'DHCP Tag', true, 'See manpage or leave blank', 0, 'str'],
    ['distro', 'None', '<<inherit>>', 'Distribution', true, 'Parent distribution', [], 'str'],
    ['enable_gpxe', 'SETTINGS:enable_gpxe', 0, 'Enable gPXE?', true,
      'Use gPXE instead of PXELINUX for advanced booting options', 0, 'bool'],
    ['enable_menu', 'SETTINGS:enable_menu', '<<inherit>>', 'Enable PXE Menu?', true, 'Show this profile in the PXE menu?', 0, 'bool'],
    ['fetchable_files', {}, '<<inherit>>', 'Fetchable Files', true, 'Templates for tftp or wget/curl', 0, 'dict'],
    ['kernel_options', {}, '<<inherit>>', 'Kernel Options', true, 'Ex: selinux=permissive', 0, 'dict'],
    ['kernel_options_post', {}, '<<inherit>>', 'Kernel Options (Post Install)', true, 'Ex: clocksource=pit noapic', 0, 'dict'],
    ['mgmt_classes', [], '<<inherit>>', 'Management Classes', true, 'For external configuration management', 0, 'list'],
    ['mgmt_parameters', '<<inherit>>', '<<inherit>>', 'Management Parameters', true, 'Parameters which will be handed to your management application (Must be valid YAML dictionary)', 0, 'str'],
    ['name', '', 'None', 'Name', true, 'Ex: F10-i386-webserver', 0, 'str'],
    ['name_servers', 'SETTINGS:default_name_servers', [], 'Name Servers', true, 'space delimited', 0, 'list'],
    ['name_servers_search', 'SETTINGS:default_name_servers_search', [], 'Name Servers Search Path', true, 'space delimited', 0, 'list'],
    ['next_server', '<<inherit>>', '<<inherit>>', 'Next Server Override', true, 'See manpage or leave blank', 0, 'str'],
    ['filename', '<<inherit>>', '<<inherit>>', 'DHCP Filename Override', true, 'Use to boot non-default bootloaders', 0, 'str'],
    ['owners', 'SETTINGS:default_ownership', 'SETTINGS:default_ownership', 'Owners', true, 'Owners list for authz_ownership (space delimited)', 0, 'list'],
    ['parent', '', '', 'Parent Profile', true, '', [], 'str'],
    ['proxy', 'SETTINGS:proxy_url_int', '<<inherit>>', 'Proxy', true, 'Proxy URL', 0, 'str'],
    ['redhat_management_key', '<<inherit>>', '<<inherit>>', 'Red Hat Management Key', true, 'Registration key for RHN, Spacewalk, or Satellite', 0, 'str'],
    ['repos', [], '<<inherit>>', 'Repos', true, 'Repos to auto-assign to this profile', [], 'list'],
    ['server', '<<inherit>>', '<<inherit>>', 'Server Override', true, 'See manpage or leave blank', 0, 'str'],
    ['template_files', {}, '<<inherit>>', 'Template Files', true, 'File mappings for built-in config management', 0, 'dict'],
    ['virt_auto_boot', 'SETTINGS:virt_auto_boot', '<<inherit>>', 'Virt Auto Boot', true, 'Auto boot this VM?', 0, 'bool'],
    ['virt_bridge', 'SETTINGS:default_virt_bridge', '<<inherit>>', 'Virt Bridge', true, '', 0, 'str'],
    ['virt_cpus', 1, '<<inherit>>', 'Virt CPUs', true, 'integer', 0, 'int'],
    ['virt_disk_driver', 'SETTINGS:default_virt_disk_driver', '<<inherit>>', 'Virt Disk Driver Type', true, 'The on-disk format for the virtualization disk', 'validate.VIRT_DISK_DRIVERS', 'str'],
    ['virt_file_size', 'SETTINGS:default_virt_file_size', '<<inherit>>', 'Virt File Size(GB)', true, '', 0, 'int'],
    ['virt_path', '', '<<inherit>>', 'Virt Path', true, 'Ex: /directory OR VolGroup00', 0, 'str'],
    ['virt_ram', 'SETTINGS:default_virt_ram', '<<inherit>>', 'Virt RAM (MB)', true, '', 0, 'int'],
    ['virt_type', 'SETTINGS:default_virt_type', '<<inherit>>', 'Virt Type', true, 'Virtualization technology to use', 'validate.VIRT_TYPES', 'str'],

  ];

  constructor() {
  }

  getAll(): any[] {
    return this.mockdata;
  }
}
