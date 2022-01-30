import { Injectable } from '@angular/core';
import { AuthenticationComponent } from '../authentication/authentication.component';

@Injectable({
  providedIn: 'root'
})
export class DataDistroService {
  // boolean True/False in python
  // boolean true/false in typescript
  // Changed function calls to strings for mockdata
  // python 'None' => typescript 'null'
  // shout names be shortened as keys, or kept descriptive?
  // mockdata to be replace by the xmlrpc fetched data
  canAccess: boolean;
  mockdata = {
  arch: ['arch', 'x86_64', 0, 'Architecture', true, 'Architecture', 'utils.get_valid_archs()', 'str'],
  autoinstall: ['autoinstall_meta', {}, 0, 'Automatic Installation Template Metadata', true, 'Ex: dog=fang agent=86',
    0, 'dict'],
  b_files: ['boot_files', {}, 0, 'TFTP Boot Files', true, 'Files copied into tftpboot beyond the kernel/initrd', 0,
    'list'],
  b_loader: ['boot_loader', '<<inherit>>', 0, 'Boot loader', true, 'Network installation boot loader',
    'utils.get_supported_system_boot_loaders()', 'str'],
  breed: ['breed', 'redhat', 0, 'Breed', true, 'What is the type of distribution?', 'utils.get_valid_breeds()', 'str'],
  comment: ['comment', '', 0, 'Comment', true, 'Free form text description', 0, 'str'],
  f_files: ['fetchable_files', {}, 0, 'Fetchable Files', true, 'Templates for tftp or wget/curl', 0, 'list'],
  initrd: ['initrd', null, 0, 'Initrd', true, 'Absolute path to kernel on filesystem', 0, 'str'],
  kernel: ['kernel', null, 0, 'Kernel', true, 'Absolute path to kernel on filesystem', 0, 'str'],
  rebo_initrd: ['remote_boot_initrd', null, 0, 'Remote Boot Initrd', true,
    'URL the bootloader directly retrieves and boots from', 0, 'str'],
  rebo_kernel: ['remote_boot_kernel', null, 0, 'Remote Boot Kernel', true,
    'URL the bootloader directly retrieves and boots from', 0, 'str'],
  kernel_options: ['kernel_options', {}, 0, 'Kernel Options', true, 'Ex: selinux=permissive', 0, 'dict'],
  k_opt_post: ['kernel_options_post', {}, 0, 'Kernel Options (Post Install)', true, 'Ex: clocksource=pit noapic', 0,
    'dict'],
  mng_class: ['mgmt_classes', [], 0, 'Management Classes', true, 'Management classes for external config management',
    0, 'list'],
  name: ['name', '', 0, 'Name', true, 'Ex: Fedora-11-i386', 0, 'str'],
  os_version: ['os_version', 'virtio26', 0, 'OS Version', true, 'Needed for some virtualization optimizations',
    'utils.get_valid_os_versions()', 'str'],
  owners: ['owners', 'DEFAULT', 0, 'Owners', true, 'Owners list for authz_ownership (space delimited)', 0, 'list'],
  rh_mng_key: ['redhat_management_key', '', '', 'Redhat Management Key', true,
    'Registration key for RHN, Spacewalk, or Satellite', 0, 'str'],
  tmplt_files: ['template_files', {}, 0, 'Template Files', true, 'File mappings for built-in config management', 0,
    'dict']

};

  constructor() {
    // possibly add authentication subscription as seen in navbar.component.ts?
  }

  // TODO: Specify return type properly
  get_item(key: any): any {
    // return list of data from mockdata
    const data = this.mockdata[key];
    const faildata = ['none=name', 'none=extra data', 'none=num', 'none=Title', 'none=boolean', 'none=description',
      'none=num', 'none=type'];
    // add type check for array ?
    if (data !== null) {
      return data;
    }
    return faildata;
  }
}
