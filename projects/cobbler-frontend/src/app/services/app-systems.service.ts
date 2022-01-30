import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSystemsService {

  mockdata = [
    ['autoinstall', '<<inherit>>', 0, 'Automatic Installation Template', true,
      'Path to automatic installation template', 0, 'str'],
    ['autoinstall_meta', {}, 0, 'Automatic Installation Template Metadata', true, 'Ex: dog=fang agent=86', 0, 'dict'],
    ['boot_files', {}, '<<inherit>>', 'TFTP Boot Files', true, 'Files copied into tftpboot beyond the kernel/initrd',
      0, 'list'],
    ['boot_loader', '<<inherit>>', 0, 'Boot loader', true, 'Linux installation boot loader',
      'utils.get_supported_system_boot_loaders()', 'str'],
    ['comment', '', 0, 'Comment', true, 'Free form text description', 0, 'str'],
    ['enable_gpxe', '<<inherit>>', 0, 'Enable gPXE?', true, 'Use gPXE instead of PXELINUX for advanced booting options',
      0, 'bool'],
    ['fetchable_files', {}, '<<inherit>>', 'Fetchable Files', true, 'Templates for tftp or wget/curl', 0, 'dict'],
    ['gateway', '', 0, 'Gateway', true, '', 0, 'str'],
    ['hostname', '', 0, 'Hostname', true, '', 0, 'str'],
    ['image', 'None', 0, 'Image', true, 'Parent image (if not a profile)', 0, 'str'],
    ['ipv6_default_device', '', 0, 'IPv6 Default Device', true, '', 0, 'str'],
    ['kernel_options', {}, 0, 'Kernel Options', true, 'Ex: selinux=permissive', 0, 'dict'],
    ['kernel_options_post', {}, 0, 'Kernel Options (Post Install)', true, 'Ex: clocksource=pit noapic', 0, 'dict'],
    ['mgmt_classes', '<<inherit>>', 0, 'Management Classes', true, 'For external config management', 0, 'list'],
    ['mgmt_parameters', '<<inherit>>', 0, 'Management Parameters', true,
      'Parameters which will be handed to your management application (Must be valid YAML dictionary)', 0, 'str'],
    ['name', '', 0, 'Name', true, 'Ex: vanhalen.example.org', 0, 'str'],
    ['name_servers', [], 0, 'Name Servers', true, 'space delimited', 0, 'list'],
    ['name_servers_search', [], 0, 'Name Servers Search Path', true, 'space delimited', 0, 'list'],
    ['netboot_enabled', true, 0, 'Netboot Enabled', true, 'PXE (re)install this machine at next boot?', 0, 'bool'],
    ['next_server', '<<inherit>>', 0, 'Next Server Override', true, 'See manpage or leave blank', 0, 'str'],
    ['filename', '<<inherit>>', '<<inherit>>', 'DHCP Filename Override', true, 'Use to boot non-default bootloaders',
      0, 'str'],
    ['owners', '<<inherit>>', 0, 'Owners', true, 'Owners list for authz_ownership (space delimited)', 0, 'list'],
    ['power_address', '', 0, 'Power Management Address', true, 'Ex: power-device.example.org', 0, 'str'],
    ['power_id', '', 0, 'Power Management ID', true, 'Usually a plug number or blade name, if power type requires it',
      0, 'str'],
    ['power_pass', '', 0, 'Power Management Password', true, '', 0, 'str'],
    ['power_type', 'SETTINGS:power_management_default_type', 0, 'Power Management Type', true,
      'Power management script to use', 'power_manager.get_power_types()', 'str'],
    ['power_user', '', 0, 'Power Management Username', true, '', 0, 'str'],
    ['power_options', '', 0, 'Power Management Options', true, 'Additional options, to be passed to the fencing agent',
      0, 'str'],
    ['power_identity_file', '', 0, 'Power Identity File', true,
      'Identity file to be passed to the fencing agent (ssh key)', 0, 'str'],
    ['profile', 'None', 0, 'Profile', true, 'Parent profile', [], 'str'],
    ['proxy', '<<inherit>>', 0, 'Internal Proxy', true, 'Internal proxy URL', 0, 'str'],
    ['redhat_management_key', '<<inherit>>', 0, 'Redhat Management Key', true,
      'Registration key for RHN, Spacewalk, or Satellite', 0, 'str'],
    ['server', '<<inherit>>', 0, 'Server Override', true, 'See manpage or leave blank', 0, 'str'],
    ['status', 'production', 0, 'Status', true, 'System status', ['', 'development', 'testing', 'acceptance',
      'production'], 'str'],
    ['template_files', {}, 0, 'Template Files', true, 'File mappings for built-in configuration management', 0, 'dict'],
    ['virt_auto_boot', '<<inherit>>', 0, 'Virt Auto Boot', true, 'Auto boot this VM?', 0, 'bool'],
    ['virt_cpus', '<<inherit>>', 0, 'Virt CPUs', true, '', 0, 'int'],
    ['virt_disk_driver', '<<inherit>>', 0, 'Virt Disk Driver Type', true,
      'The on-disk format for the virtualization disk', 'validate.VIRT_DISK_DRIVERS', 'str'],
    ['virt_file_size', '<<inherit>>', 0, 'Virt File Size(GB)', true, '', 0, 'float'],
    ['virt_path', '<<inherit>>', 0, 'Virt Path', true, 'Ex: /directory or VolGroup00', 0, 'str'],
    ['virt_pxe_boot', 0, 0, 'Virt PXE Boot', true, 'Use PXE to build this VM?', 0, 'bool'],
    ['virt_ram', '<<inherit>>', 0, 'Virt RAM (MB)', true, '', 0, 'int'],
    ['virt_type', '<<inherit>>', 0, 'Virt Type', true, 'Virtualization technology to use', 'validate.VIRT_TYPES',
      'str'],
    ['serial_device', '', 0, 'Serial Device #', true, 'Serial Device Number', 0, 'int'],
    ['serial_baud_rate', '', 0, 'Serial Baud Rate', true, 'Serial Baud Rate',
      ['', '2400', '4800', '9600', '19200', '38400', '57600', '115200'], 'int'],
  ];

  constructor() {
  }

  getAll(): Array<any> {
    return this.mockdata;
  }
}
