import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {CobblerApiService} from './cobbler-api.service';

describe('CobblerApiService', () => {
  let service: CobblerApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CobblerApiService,
        {provide: 'COBBLER_URL', useValue: new URL('http://localhost/cobbler_api')}
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CobblerApiService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO: This is a failed check, we need a positive one as well!
  it('should execute the check action on the Cobbler Server', (done: DoneFn) => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>The 'server' field in /etc/cobbler/settings.yaml must be set to something other than localhost, or automatic installation features will not work.  This should be a resolvable hostname or IP for the boot server as reachable by all machines that will use it.</string></value><value><string>For PXE to be functional, the 'next_server_v4' field in /etc/cobbler/settings.yaml must be set to something other than 127.0.0.1, and should match the IP of the boot server on the PXE network.</string></value><value><string>For PXE to be functional, the 'next_server_v6' field in /etc/cobbler/settings.yaml must be set to something other than ::1, and should match the IP of the boot server on the PXE network.</string></value><value><string>service cobblerd is not running</string></value><value><string>some network boot-loaders are missing from /var/lib/cobbler/loaders. If you only want to handle x86/x86_64 netbooting, you may ensure that you have installed a *recent* version of the syslinux package installed and can ignore this message entirely. Files in this directory, should you want to support all architectures, should include pxelinux.0, andmenu.c32.</string></value><value><string>enable and start rsyncd.service with systemctl</string></value><value><string>reposync not installed, install yum-utils</string></value><value><string>yumdownloader is not installed, install yum-utils</string></value><value><string>The default password used by the sample templates for newly installed machines (default_password_crypted in /etc/cobbler/settings.yaml) is still set to 'cobbler' and should be changed, try: "openssl passwd -1 -salt 'random-phrase-here' 'your-password-here'" to generate new one</string></value></data></array></value></param></params></methodResponse>`;

    const result = [
      // eslint-disable-next-line max-len
      'The \'server\' field in /etc/cobbler/settings.yaml must be set to something other than localhost, or automatic installation features will not work.  This should be a resolvable hostname or IP for the boot server as reachable by all machines that will use it.',
      // eslint-disable-next-line max-len
      'For PXE to be functional, the \'next_server_v4\' field in /etc/cobbler/settings.yaml must be set to something other than 127.0.0.1, and should match the IP of the boot server on the PXE network.',
      // eslint-disable-next-line max-len
      'For PXE to be functional, the \'next_server_v6\' field in /etc/cobbler/settings.yaml must be set to something other than ::1, and should match the IP of the boot server on the PXE network.',
      'service cobblerd is not running',
      // eslint-disable-next-line max-len
      'some network boot-loaders are missing from /var/lib/cobbler/loaders. If you only want to handle x86/x86_64 netbooting, you may ensure that you have installed a *recent* version of the syslinux package installed and can ignore this message entirely. Files in this directory, should you want to support all architectures, should include pxelinux.0, andmenu.c32.',
      'enable and start rsyncd.service with systemctl',
      'reposync not installed, install yum-utils',
      'yumdownloader is not installed, install yum-utils',
      // eslint-disable-next-line max-len
      'The default password used by the sample templates for newly installed machines (default_password_crypted in /etc/cobbler/settings.yaml) is still set to \'cobbler\' and should be changed, try: "openssl passwd -1 -salt \'random-phrase-here\' \'your-password-here\'" to generate new one'
    ];
    service.check('').subscribe(
      value => {
        expect(value).toEqual(result);
        done();
      });
    const mockRequest = httpTestingController.expectOne('http://localhost/cobbler_api');
    mockRequest.flush(methodResponse);
  });

  xit('should execute the background_buildiso action on the Cobbler Server', () => {
    service.background_buildiso(undefined, '');
    expect(service).toBeFalsy();
  });

  xit('should execute the background_aclsetup action on the Cobbler Server', () => {
    service.background_aclsetup(undefined, '');
    expect(service).toBeFalsy();
  });

  xit('should execute the background_sync action on the Cobbler Server', () => {
    service.background_sync(undefined, '');
    expect(service).toBeFalsy();
  });

  xit('should execute the background_syncsystems action on the Cobbler Server', () => {
    service.background_syncsystems(undefined, '');
    expect(service).toBeFalsy();
  });

  xit('should execute the background_hardlink action on the Cobbler Server', () => {
    service.background_hardlink('');
    expect(service).toBeFalsy();
  });

  xit('should execute the background_validate_autoinstall_files action on the Cobbler Server',
    () => {
      service.background_validate_autoinstall_files('');
      expect(service).toBeFalsy();
    });

  xit('should execute the background_replicate action on the Cobbler Server', () => {
    service.background_replicate(undefined, '');
    expect(service).toBeFalsy();
  });

  xit('should execute the background_import action on the Cobbler Server', () => {
    service.background_import(undefined, '');
    expect(service).toBeFalsy();
  });

  xit('should execute the background_reposync action on the Cobbler Server', () => {
    service.background_reposync(undefined, '');
    expect(service).toBeFalsy();
  });

  xit('should execute the background_power_system action on the Cobbler Server', () => {
    service.background_power_system(undefined, '');
    expect(service).toBeFalsy();
  });

  xit('should execute the power_system action on the Cobbler Server', () => {
    service.power_system('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the background_signature_update action on the Cobbler Server', () => {
    service.background_signature_update('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_events action on the Cobbler Server', () => {
    service.get_events('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_event_log action on the Cobbler Server', () => {
    service.get_event_log('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_task_status action on the Cobbler Server', () => {
    service.get_task_status('');
    expect(service).toBeFalsy();
  });

  xit('should execute the last_modified_time action on the Cobbler Server', () => {
    service.last_modified_time();
    expect(service).toBeFalsy();
  });

  xit('should execute the ping action on the Cobbler Server', () => {
    service.ping();
    expect(service).toBeFalsy();
  });

  xit('should execute the get_user_from_token action on the Cobbler Server', () => {
    service.get_user_from_token('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_item action on the Cobbler Server', () => {
    service.get_item('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_distro action on the Cobbler Server', () => {
    service.get_distro('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_profile action on the Cobbler Server', () => {
    service.get_profile('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_system action on the Cobbler Server', () => {
    service.get_system('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_repo action on the Cobbler Server', () => {
    service.get_repo('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_image action on the Cobbler Server', () => {
    service.get_image('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_mgmtclass action on the Cobbler Server', () => {
    service.get_mgmtclass('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_package action on the Cobbler Server', () => {
    service.get_package('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_file action on the Cobbler Server', () => {
    service.get_file('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_items action on the Cobbler Server', () => {
    service.get_items('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_item_names action on the Cobbler Server', () => {
    service.get_item_names('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_distros action on the Cobbler Server', () => {
    service.get_distros();
    expect(service).toBeFalsy();
  });

  xit('should execute the get_profiles action on the Cobbler Server', () => {
    service.get_profiles();
    expect(service).toBeFalsy();
  });

  xit('should execute the get_systems action on the Cobbler Server', () => {
    service.get_systems();
    expect(service).toBeFalsy();
  });

  xit('should execute the get_repos action on the Cobbler Server', () => {
    service.get_repos();
    expect(service).toBeFalsy();
  });

  xit('should execute the get_images action on the Cobbler Server', () => {
    service.get_images();
    expect(service).toBeFalsy();
  });

  xit('should execute the get_mgmtclasses action on the Cobbler Server', () => {
    service.get_mgmtclasses();
    expect(service).toBeFalsy();
  });

  xit('should execute the get_packages action on the Cobbler Server', () => {
    service.get_packages();
    expect(service).toBeFalsy();
  });

  xit('should execute the get_files action on the Cobbler Server', () => {
    service.get_files();
    expect(service).toBeFalsy();
  });

  xit('should execute the find_items action on the Cobbler Server', () => {
    service.find_items('', undefined, '', false);
    expect(service).toBeFalsy();
  });

  xit('should execute the find_distro action on the Cobbler Server', () => {
    service.find_distro(undefined, false);
    expect(service).toBeFalsy();
  });

  xit('should execute the find_profile action on the Cobbler Server', () => {
    service.find_profile(undefined, false);
    expect(service).toBeFalsy();
  });

  xit('should execute the find_system action on the Cobbler Server', () => {
    service.find_system(undefined, false);
    expect(service).toBeFalsy();
  });

  xit('should execute the find_repo action on the Cobbler Server', () => {
    service.find_repo(undefined, false);
    expect(service).toBeFalsy();
  });

  xit('should execute the find_image action on the Cobbler Server', () => {
    service.find_image(undefined, false);
    expect(service).toBeFalsy();
  });

  xit('should execute the find_mgmtclass action on the Cobbler Server', () => {
    service.find_mgmtclass(undefined, false);
    expect(service).toBeFalsy();
  });

  xit('should execute the find_package action on the Cobbler Server', () => {
    service.find_package(undefined, false);
    expect(service).toBeFalsy();
  });

  xit('should execute the find_file action on the Cobbler Server', () => {
    service.find_file(undefined, false);
    expect(service).toBeFalsy();
  });

  xit('should execute the find_items_paged action on the Cobbler Server', () => {
    service.find_items_paged('', undefined, '', 0, 0, '');
    expect(service).toBeFalsy();
  });

  xit('should execute the has_item action on the Cobbler Server', () => {
    service.has_item('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_item_handle action on the Cobbler Server', () => {
    service.get_item_handle('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_distro_handle action on the Cobbler Server', () => {
    service.get_distro_handle('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_profile_handle action on the Cobbler Server', () => {
    service.get_profile_handle('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_system_handle action on the Cobbler Server', () => {
    service.get_system_handle('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_repo_handle action on the Cobbler Server', () => {
    service.get_repo_handle('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_image_handle action on the Cobbler Server', () => {
    service.get_image_handle('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_mgmtclass_handle action on the Cobbler Server', () => {
    service.get_mgmtclass_handle('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_package_handle action on the Cobbler Server', () => {
    service.get_package_handle('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_file_handle action on the Cobbler Server', () => {
    service.get_file_handle('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the remove_item action on the Cobbler Server', () => {
    service.remove_item('', '', '', true);
    expect(service).toBeFalsy();
  });

  xit('should execute the remove_distro action on the Cobbler Server', () => {
    service.remove_distro('', '', true);
    expect(service).toBeFalsy();
  });

  xit('should execute the remove_profile action on the Cobbler Server', () => {
    service.remove_profile('', '', true);
    expect(service).toBeFalsy();
  });

  xit('should execute the remove_system action on the Cobbler Server', () => {
    service.remove_system('', '', true);
    expect(service).toBeFalsy();
  });

  xit('should execute the remove_repo action on the Cobbler Server', () => {
    service.remove_repo('', '', true);
    expect(service).toBeFalsy();
  });

  xit('should execute the remove_image action on the Cobbler Server', () => {
    service.remove_image('', '', true);
    expect(service).toBeFalsy();
  });

  xit('should execute the remove_mgmtclass action on the Cobbler Server', () => {
    service.remove_mgmtclass('', '', true);
    expect(service).toBeFalsy();
  });

  xit('should execute the remove_package action on the Cobbler Server', () => {
    service.remove_package('', '', true);
    expect(service).toBeFalsy();
  });

  xit('should execute the remove_file action on the Cobbler Server', () => {
    service.remove_file('', '', true);
    expect(service).toBeFalsy();
  });

  xit('should execute the copy_item action on the Cobbler Server', () => {
    service.copy_item('', '', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the copy_distro action on the Cobbler Server', () => {
    service.copy_distro('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the copy_profile action on the Cobbler Server', () => {
    service.copy_profile('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the copy_system action on the Cobbler Server', () => {
    service.copy_system('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the copy_repo action on the Cobbler Server', () => {
    service.copy_repo('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the copy_image action on the Cobbler Server', () => {
    service.copy_image('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the copy_mgmtclass action on the Cobbler Server', () => {
    service.copy_mgmtclass('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the copy_package action on the Cobbler Server', () => {
    service.copy_package('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the copy_file action on the Cobbler Server', () => {
    service.copy_file('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the rename_item action on the Cobbler Server', () => {
    service.rename_item('', '', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the rename_distro action on the Cobbler Server', () => {
    service.rename_distro('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the rename_profile action on the Cobbler Server', () => {
    service.rename_profile('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the rename_system action on the Cobbler Server', () => {
    service.rename_system('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the rename_repo action on the Cobbler Server', () => {
    service.rename_repo('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the rename_image action on the Cobbler Server', () => {
    service.rename_image('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the rename_mgmtclass action on the Cobbler Server', () => {
    service.rename_mgmtclass('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the rename_package action on the Cobbler Server', () => {
    service.rename_package('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the rename_file action on the Cobbler Server', () => {
    service.rename_file('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the new_item action on the Cobbler Server', () => {
    service.new_item('', '', false);
    expect(service).toBeFalsy();
  });

  xit('should execute the new_distro action on the Cobbler Server', () => {
    service.new_distro('');
    expect(service).toBeFalsy();
  });

  xit('should execute the new_profile action on the Cobbler Server', () => {
    service.new_profile('');
    expect(service).toBeFalsy();
  });

  xit('should execute the new_subprofile action on the Cobbler Server', () => {
    service.new_subprofile('');
    expect(service).toBeFalsy();
  });

  xit('should execute the new_system action on the Cobbler Server', () => {
    service.new_system('');
    expect(service).toBeFalsy();
  });

  xit('should execute the new_repo action on the Cobbler Server', () => {
    service.new_repo('');
    expect(service).toBeFalsy();
  });

  xit('should execute the new_image action on the Cobbler Server', () => {
    service.new_image('');
    expect(service).toBeFalsy();
  });

  xit('should execute the new_mgmtclass action on the Cobbler Server', () => {
    service.new_mgmtclass('');
    expect(service).toBeFalsy();
  });

  xit('should execute the new_package action on the Cobbler Server', () => {
    service.new_package('');
    expect(service).toBeFalsy();
  });

  xit('should execute the new_file action on the Cobbler Server', () => {
    service.new_file('');
    expect(service).toBeFalsy();
  });

  xit('should execute the modify_item action on the Cobbler Server', () => {
    service.modify_item('', '', '', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the modify_distro action on the Cobbler Server', () => {
    service.modify_distro('', '', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the modify_profile action on the Cobbler Server', () => {
    service.modify_profile('', '', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the modify_system action on the Cobbler Server', () => {
    service.modify_system('', '', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the modify_image action on the Cobbler Server', () => {
    service.modify_image('', '', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the modify_repo action on the Cobbler Server', () => {
    service.modify_repo('', '', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the modify_mgmtclass action on the Cobbler Server', () => {
    service.modify_mgmtclass('', '', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the modify_package action on the Cobbler Server', () => {
    service.modify_package('', '', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the modify_file action on the Cobbler Server', () => {
    service.modify_file('', '', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the modify_setting action on the Cobbler Server', () => {
    service.modify_setting('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the auto_add_repos action on the Cobbler Server', () => {
    service.auto_add_repos('');
    expect(service).toBeFalsy();
  });

  xit('should execute the xapi_object_edit action on the Cobbler Server', () => {
    service.xapi_object_edit('', '', '', {members: []}, '');
    expect(service).toBeFalsy();
  });

  xit('should execute the save_item action on the Cobbler Server', () => {
    service.save_item('', '', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the save_distro action on the Cobbler Server', () => {
    service.save_distro('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the save_profile action on the Cobbler Server', () => {
    service.save_profile('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the save_system action on the Cobbler Server', () => {
    service.save_system('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the save_image action on the Cobbler Server', () => {
    service.save_image('', '', '');
    expect(service).toBeFalsy();
  });


  xit('should execute the save_repo action on the Cobbler Server', () => {
    service.save_repo('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the save_mgmtclass action on the Cobbler Server', () => {
    service.save_mgmtclass('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the save_package action on the Cobbler Server', () => {
    service.save_package('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the save_file action on the Cobbler Server', () => {
    service.save_file('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_autoinstall_templates action on the Cobbler Server', () => {
    service.get_autoinstall_templates('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_autoinstall_snippets action on the Cobbler Server', () => {
    service.get_autoinstall_snippets('');
    expect(service).toBeFalsy();
  });

  xit('should execute the is_autoinstall_in_use action on the Cobbler Server', () => {
    service.is_autoinstall_in_use('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the generate_autoinstall action on the Cobbler Server', () => {
    service.generate_autoinstall('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the generate_profile_autoinstall action on the Cobbler Server', () => {
    service.generate_profile_autoinstall('');
    expect(service).toBeFalsy();
  });

  xit('should execute the generate_system_autoinstall action on the Cobbler Server', () => {
    service.generate_system_autoinstall('');
    expect(service).toBeFalsy();
  });

  xit('should execute the generate_ipxe action on the Cobbler Server', () => {
    service.generate_ipxe('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the generate_bootcfg action on the Cobbler Server', () => {
    service.generate_bootcfg('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the generate_script action on the Cobbler Server', () => {
    service.generate_script('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_blended_data action on the Cobbler Server', () => {
    service.get_blended_data('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_settings action on the Cobbler Server', () => {
    service.get_settings('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_signatures action on the Cobbler Server', () => {
    service.get_signatures('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_valid_breeds action on the Cobbler Server', () => {
    service.get_valid_breeds('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_valid_os_versions_for_breed action on the Cobbler Server', () => {
    service.get_valid_os_versions_for_breed('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_valid_os_versions action on the Cobbler Server', () => {
    service.get_valid_os_versions('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_valid_archs action on the Cobbler Server', () => {
    service.get_valid_archs('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_repo_config_for_profile action on the Cobbler Server', () => {
    service.get_repo_config_for_profile('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_repo_config_for_system action on the Cobbler Server', () => {
    service.get_repo_config_for_system('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_template_file_for_profile action on the Cobbler Server', () => {
    service.get_template_file_for_profile('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_template_file_for_system action on the Cobbler Server', () => {
    service.get_template_file_for_system('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the register_new_system action on the Cobbler Server', () => {
    service.register_new_system(undefined);
    expect(service).toBeFalsy();
  });

  xit('should execute the disable_netboot action on the Cobbler Server', () => {
    service.disable_netboot('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the upload_log_data action on the Cobbler Server', () => {
    service.upload_log_data('', undefined, undefined, undefined, undefined, '');
    expect(service).toBeFalsy();
  });

  xit('should execute the run_install_triggers action on the Cobbler Server', () => {
    service.run_install_triggers('', '', '', undefined, '');
    expect(service).toBeFalsy();
  });

  xit('should execute the version action on the Cobbler Server', () => {
    service.version();
    expect(service).toBeFalsy();
  });

  xit('should execute the extended_version action on the Cobbler Server', () => {
    service.extended_version();
    expect(service).toBeFalsy();
  });

  xit('should execute the get_distros_since action on the Cobbler Server', () => {
    service.get_distros_since(0);
    expect(service).toBeFalsy();
  });

  xit('should execute the get_profiles_since action on the Cobbler Server', () => {
    service.get_profiles_since(0);
    expect(service).toBeFalsy();
  });

  xit('should execute the get_systems_since action on the Cobbler Server', () => {
    service.get_systems_since(0);
    expect(service).toBeFalsy();
  });

  xit('should execute the get_repos_since action on the Cobbler Server', () => {
    service.get_repos_since(0);
    expect(service).toBeFalsy();
  });

  xit('should execute the get_images_since action on the Cobbler Server', () => {
    service.get_images_since(0);
    expect(service).toBeFalsy();
  });

  xit('should execute the get_mgmtclasses_since action on the Cobbler Server', () => {
    service.get_mgmtclasses_since(0);
    expect(service).toBeFalsy();
  });

  xit('should execute the get_packages_since action on the Cobbler Server', () => {
    service.get_packages_since(0);
    expect(service).toBeFalsy();
  });

  xit('should execute the get_files_since action on the Cobbler Server', () => {
    service.get_files_since(0);
    expect(service).toBeFalsy();
  });

  xit('should execute the get_repos_compatible_with_profile action on the Cobbler Server', () => {
    service.get_repos_compatible_with_profile('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the find_system_by_dns_name action on the Cobbler Server', () => {
    service.find_system_by_dns_name('');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_distro_as_rendered action on the Cobbler Server', () => {
    service.get_distro_as_rendered('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_profile_as_rendered action on the Cobbler Server', () => {
    service.get_profile_as_rendered('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_system_as_rendered action on the Cobbler Server', () => {
    service.get_system_as_rendered('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_repo_as_rendered action on the Cobbler Server', () => {
    service.get_repo_as_rendered('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_image_as_rendered action on the Cobbler Server', () => {
    service.get_image_as_rendered('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_mgmtclass_as_rendered action on the Cobbler Server', () => {
    service.get_mgmtclass_as_rendered('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_package_as_rendered action on the Cobbler Server', () => {
    service.get_package_as_rendered('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_file_as_rendered action on the Cobbler Server', () => {
    service.get_file_as_rendered('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_random_mac action on the Cobbler Server', () => {
    service.get_random_mac('');
    expect(service).toBeFalsy();
  });

  xit('should execute the xmlrpc_hacks action on the Cobbler Server', () => {
    service.xmlrpc_hacks(undefined);
    expect(service).toBeFalsy();
  });

  xit('should execute the get_status action on the Cobbler Server', () => {
    service.get_status('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the check_access_no_fail action on the Cobbler Server', () => {
    service.check_access_no_fail('', '', undefined, undefined);
    expect(service).toBeFalsy();
  });

  xit('should execute the check_access action on the Cobbler Server', () => {
    service.check_access('', '', undefined, undefined);
    expect(service).toBeFalsy();
  });

  xit('should execute the get_authn_module_name action on the Cobbler Server', () => {
    service.get_authn_module_name('');
    expect(service).toBeFalsy();
  });

  it('should execute the login action on the Cobbler Server', (done: DoneFn) => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>alksjdbskjdbakljdbsaajkiuhgzulnbgtz=</string></value></param></params></methodResponse>`;

    const result = 'alksjdbskjdbakljdbsaajkiuhgzulnbgtz=';
    service.login('cobbler', 'cobbler').subscribe(
      value => {
        expect(value).toEqual(result);
        done();
      });
    const mockRequest = httpTestingController.expectOne('http://localhost/cobbler_api');
    mockRequest.flush(methodResponse);
  });

  it('should execute the logout action on the Cobbler Server', (done: DoneFn) => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

    const result = true;
    service.logout('alksjdbskjdbakljdbsaajkiuhgzulnbgtz=').subscribe(
      value => {
        expect(value).toEqual(result);
        done();
      });
    const mockRequest = httpTestingController.expectOne('http://localhost/cobbler_api');
    mockRequest.flush(methodResponse);
  });

  it('should execute the token_check action on the Cobbler Server', (done: DoneFn) => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

    const result = true;
    service.token_check('alksjdbskjdbakljdbsaajkiuhgzulnbgtz=').subscribe(
      value => {
        expect(value).toEqual(result);
        done();
      });
    const mockRequest = httpTestingController.expectOne('http://localhost/cobbler_api');
    mockRequest.flush(methodResponse);
  });

  it('should execute the sync_dhcp action on the Cobbler Server', (done: DoneFn) => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

    const result = true;
    service.sync_dhcp('alksjdbskjdbakljdbsaajkiuhgzulnbgtz=').subscribe(
      value => {
        expect(value).toEqual(result);
        done();
      });
    const mockRequest = httpTestingController.expectOne('http://localhost/cobbler_api');
    mockRequest.flush(methodResponse);
  });

  it('should execute the sync action on the Cobbler Server', (done: DoneFn) => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

    const result = true;
    service.sync('alksjdbskjdbakljdbsaajkiuhgzulnbgtz=').subscribe(
      value => {
        expect(value).toEqual(result);
        done();
      });
    const mockRequest = httpTestingController.expectOne('http://localhost/cobbler_api');
    mockRequest.flush(methodResponse);
  });

  xit('should execute the read_autoinstall_template action on the Cobbler Server', () => {
    service.read_autoinstall_template('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the write_autoinstall_template action on the Cobbler Server', () => {
    service.write_autoinstall_template('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the remove_autoinstall_template action on the Cobbler Server', () => {
    service.remove_autoinstall_template('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the read_autoinstall_snippet action on the Cobbler Server', () => {
    service.read_autoinstall_snippet('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the write_autoinstall_snippet action on the Cobbler Server', () => {
    service.write_autoinstall_snippet('', '', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the remove_autoinstall_snippet action on the Cobbler Server', () => {
    service.remove_autoinstall_snippet('', '');
    expect(service).toBeFalsy();
  });

  xit('should execute the get_config_data action on the Cobbler Server', () => {
    service.get_config_data('');
    expect(service).toBeFalsy();
  });

  xit('should execute the clear_system_logs action on the Cobbler Server', () => {
    service.clear_system_logs('', '');
    expect(service).toBeFalsy();
  });
});
