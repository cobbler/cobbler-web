import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  // python True => true
  // python None => null
  // python methods => "methods"
  mockdata = [
    ['arch', 'x86_64', 0, 'Architecture', true, '', 'utils.get_valid_archs()', 'str'],
    ['autoinstall', '', 0, 'Automatic installation file', true, 'Path to autoinst/answer file template', 0, 'str'],
    ['breed', 'redhat', 0, 'Breed', true, '', 'utils.get_valid_breeds()', 'str'],
    ['comment', '', 0, 'Comment', true, 'Free form text description', 0, 'str'],
    ['file', '', 0, 'File', true, 'Path to local file or nfs://user@host:path', 0, 'str'],
    ['image_type', 'iso', 0, 'Image Type', true, '', ['iso', 'direct', 'memdisk', 'virt-image'], 'str'],
    ['name', '', 0, 'Name', true, '', 0, 'str'],
    ['network_count', 1, 0, 'Virt NICs', true, '', 0, 'int'],
    ['os_version', '', 0, 'OS Version', true, 'ex: rhel4', 'utils.get_valid_os_versions()', 'str'],
    ['owners', 'SETTINGS:default_ownership', 0, 'Owners', true, 'Owners list for authz_ownership (space delimited)',
      [], 'list'],
    ['virt_auto_boot', 'SETTINGS:virt_auto_boot', 0, 'Virt Auto Boot', true, 'Auto boot this VM?', 0, 'bool'],
    ['virt_bridge', 'SETTINGS:default_virt_bridge', 0, 'Virt Bridge', true, '', 0, 'str'],
    ['virt_cpus', 1, 0, 'Virt CPUs', true, '', 0, 'int'],
    ['virt_disk_driver', 'SETTINGS:default_virt_disk_driver', 0, 'Virt Disk Driver Type', true,
      'The on-disk format for the virtualization disk', 'raw', 'str'],
    ['virt_file_size', 'SETTINGS:default_virt_file_size', 0, 'Virt File Size (GB)', true, '', 0, 'float'],
    ['virt_path', '', 0, 'Virt Path', true, 'Ex: /directory or VolGroup00', 0, 'str'],
    ['virt_ram', 'SETTINGS:default_virt_ram', 0, 'Virt RAM (MB)', true, '', 0, 'int'],
    ['virt_type', 'SETTINGS:default_virt_type', 0, 'Virt Type', true, '', ['xenpv', 'xenfv', 'qemu', 'kvm', 'vmware'],
      'str'],
  ];

  constructor() {
  }

  getAll(): any[] {
    return this.mockdata;
  }
}
