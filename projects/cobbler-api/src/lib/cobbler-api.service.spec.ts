import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Event, ExtendedVersion} from './custom-types/misc';
import {COBBLER_URL} from './lib.config';
import {AngularXmlrpcService} from 'typescript-xmlrpc';

import {CobblerApiService} from './cobbler-api.service';

describe('CobblerApiService', () => {
  let service: CobblerApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api')
        },
        {
          provide: AngularXmlrpcService,
          useClass: AngularXmlrpcService
        },
        {
          provide: CobblerApiService,
          deps: [AngularXmlrpcService, COBBLER_URL]
        }
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

  it('should execute the get_events action on the Cobbler Server', () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>2023-01-24_075223_Create bootable bootloader images_77c9dbafc9234f018d67ec3295fcc22b</name><value><array><data><value><double>1674546743.8418643</double></value><value><string>Create bootable bootloader images</string></value><value><string>complete</string></value><value><array><data><value><string>1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ==</string></value></data></array></value></data></array></value></member><member><name>2023-01-24_075801_Replicate_ea7a003a81264039b4277ac55664661a</name><value><array><data><value><double>1674547081.1178503</double></value><value><string>Replicate</string></value><value><string>failed</string></value><value><array><data><value><string>1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ==</string></value></data></array></value></data></array></value></member><member><name>2023-01-24_083001_Build Iso_20fa7d4256fc4f61a2b9c2237c80fb41</name><value><array><data><value><double>1674549001.176315</double></value><value><string>Build Iso</string></value><value><string>failed</string></value><value><array><data><value><string>1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ==</string></value></data></array></value></data></array></value></member><member><name>2023-01-24_083137_(CLI) ACL Configuration_334327920d2946fda3ac95dbf457e76d</name><value><array><data><value><double>1674549097.240632</double></value><value><string>(CLI) ACL Configuration</string></value><value><string>failed</string></value><value><array><data><value><string>1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ==</string></value></data></array></value></data></array></value></member></struct></value></param></params></methodResponse>`
    const result : Array<Event> = [
      {
        id: "2023-01-24_075223_Create bootable bootloader images_77c9dbafc9234f018d67ec3295fcc22b",
        statetime: 1674546743.8418643,
        name: "Create bootable bootloader images",
        state: "complete",
        readByWho: ["1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ=="]
      },
      {
        id: "2023-01-24_075801_Replicate_ea7a003a81264039b4277ac55664661a",
        statetime: 1674547081.1178503,
        name: "Replicate",
        state: "failed",
        readByWho: ["1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ=="]
      },
      {
        id: "2023-01-24_083001_Build Iso_20fa7d4256fc4f61a2b9c2237c80fb41",
        statetime: 1674549001.176315,
        name: "Build Iso",
        state: "failed",
        readByWho: ["1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ=="]
      },
      {
        id: "2023-01-24_083137_(CLI) ACL Configuration_334327920d2946fda3ac95dbf457e76d",
        statetime: 1674549097.240632,
        name: "(CLI) ACL Configuration",
        state: "failed",
        readByWho: ["1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ=="]
      }
    ];
    service.get_events('').subscribe(value => {
      expect(value).toEqual(result)
    });
    const mockRequest = httpTestingController.expectOne('http://localhost/cobbler_api');
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_event_log action on the Cobbler Server', () => {
    /* eslint-disable max-len */
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,744 - INFO | start_task(sync); event_id(2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29)
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,744 - INFO | syncing all
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,745 - INFO | copying: /var/lib/cobbler/misc/anamon.init -&gt; /srv/www/cobbler/misc
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,745 - INFO | copying: /var/lib/cobbler/misc/anamon -&gt; /srv/www/cobbler/misc
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,745 - INFO | running pre-sync triggers
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,746 - INFO | cleaning trees
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,746 - INFO | removing: /srv/tftpboot/pxelinux.cfg
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,746 - INFO | removing: /srv/tftpboot/grub
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,746 - INFO | removing: /srv/tftpboot/images
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,746 - INFO | removing: /srv/tftpboot/ipxe
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,746 - INFO | removing: /srv/tftpboot/esxi
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,747 - INFO | removing: /srv/www/cobbler/rendered
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,747 - INFO | copying bootloaders
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,747 - INFO | running: ['rsync', '-rpt', '--copy-links', '--exclude=.cobbler_postun_cleanup', '/var/lib/cobbler/loaders/', '/srv/tftpboot']
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,936 - INFO | received on stdout:
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,936 - INFO | running: ['rsync', '-rpt', '--copy-links', '--exclude=README.grubconfig', '/var/lib/cobbler/grub_config/', '/srv/tftpboot']
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,942 - INFO | received on stdout:
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,942 - INFO | copying distros to tftpboot
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,943 - INFO | copying images
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,943 - INFO | generating PXE configuration files
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,943 - INFO | generating PXE menu structure
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,945 - INFO | rendering DHCP files
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,945 - INFO | generating /etc/dhcpd.conf
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,962 - INFO | cleaning link caches
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,962 - INFO | running post-sync triggers
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,962 - INFO | running: ['dhcpd', '-t', '-q']
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:25,002 - INFO | received on stdout:
[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:26,044 - INFO | ### TASK COMPLETE ###</string></value></param></params></methodResponse>`
    /* eslint-enable max-len */
    service.get_event_log('2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29').subscribe(value => [
      expect(value.split(/\r?\n/).length).toEqual(28)
    ]);
    const mockRequest = httpTestingController.expectOne('http://localhost/cobbler_api');
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_task_status action on the Cobbler Server', () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><double>1664568243.5196018</double></value><value><string>Updating Signatures</string></value><value><string>complete</string></value><value><array><data></data></array></value></data></array></value></param></params></methodResponse>`
    const result = {
      id: "2022-09-30_200403_Updating Signatures_8f2b3c1626fb4b158636059b31242ee6",
      statetime: 1664568243.5196018,
      name: "Updating Signatures",
      state: "complete",
      readByWho: []
    }
    service.get_task_status(
      '2022-09-30_200403_Updating Signatures_8f2b3c1626fb4b158636059b31242ee6'
    ).subscribe(value => {
      expect(value).toEqual(result)
    });
    const mockRequest = httpTestingController.expectOne('http://localhost/cobbler_api');
    mockRequest.flush(methodResponse);
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

  it('should execute the get_settings action on the Cobbler Server', (done) => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>auto_migrate_settings</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_hostnames</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_ips</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_macs</name><value><boolean>0</boolean></value></member><member><name>allow_dynamic_settings</name><value><boolean>0</boolean></value></member><member><name>always_write_dhcp_entries</name><value><boolean>0</boolean></value></member><member><name>anamon_enabled</name><value><boolean>0</boolean></value></member><member><name>auth_token_expiration</name><value><int>3600</int></value></member><member><name>authn_pam_service</name><value><string>login</string></value></member><member><name>autoinstall_snippets_dir</name><value><string>/var/lib/cobbler/snippets</string></value></member><member><name>autoinstall_templates_dir</name><value><string>/var/lib/cobbler/templates</string></value></member><member><name>bind_chroot_path</name><value><string></string></value></member><member><name>bind_zonefile_path</name><value><string>/var/lib/named</string></value></member><member><name>bind_master</name><value><string>127.0.0.1</string></value></member><member><name>boot_loader_conf_template_dir</name><value><string>/etc/cobbler/boot_loader_conf</string></value></member><member><name>bootloaders_dir</name><value><string>/var/lib/cobbler/loaders</string></value></member><member><name>bootloaders_shim_folder</name><value><string>/usr/share/efi/*/</string></value></member><member><name>bootloaders_shim_file</name><value><string>shim\\.efi$</string></value></member><member><name>bootloaders_ipxe_folder</name><value><string>/usr/share/ipxe/</string></value></member><member><name>bootloaders_formats</name><value><struct><member><name>aarch64</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member></struct></value></member><member><name>arm</name><value><struct><member><name>binary_name</name><value><string>bootarm.efi</string></value></member></struct></value></member><member><name>arm64-efi</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>efinet</string></value></data></array></value></member></struct></value></member><member><name>i386-efi</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>i386-pc-pxe</name><value><struct><member><name>binary_name</name><value><string>grub.0</string></value></member><member><name>mod_dir</name><value><string>i386-pc</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>pxe</string></value><value><string>biosdisk</string></value></data></array></value></member></struct></value></member><member><name>i686</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>IA64</name><value><struct><member><name>binary_name</name><value><string>bootia64.efi</string></value></member></struct></value></member><member><name>powerpc-ieee1275</name><value><struct><member><name>binary_name</name><value><string>grub.ppc64le</string></value></member><member><name>extra_modules</name><value><array><data><value><string>net</string></value><value><string>ofnet</string></value></data></array></value></member></struct></value></member><member><name>x86_64-efi</name><value><struct><member><name>binary_name</name><value><string>grubx86.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>efinet</string></value></data></array></value></member></struct></value></member></struct></value></member><member><name>bootloaders_modules</name><value><array><data><value><string>btrfs</string></value><value><string>ext2</string></value><value><string>xfs</string></value><value><string>jfs</string></value><value><string>reiserfs</string></value><value><string>all_video</string></value><value><string>boot</string></value><value><string>cat</string></value><value><string>configfile</string></value><value><string>echo</string></value><value><string>fat</string></value><value><string>font</string></value><value><string>gfxmenu</string></value><value><string>gfxterm</string></value><value><string>gzio</string></value><value><string>halt</string></value><value><string>iso9660</string></value><value><string>jpeg</string></value><value><string>linux</string></value><value><string>loadenv</string></value><value><string>minicmd</string></value><value><string>normal</string></value><value><string>part_apple</string></value><value><string>part_gpt</string></value><value><string>part_msdos</string></value><value><string>password_pbkdf2</string></value><value><string>png</string></value><value><string>reboot</string></value><value><string>search</string></value><value><string>search_fs_file</string></value><value><string>search_fs_uuid</string></value><value><string>search_label</string></value><value><string>sleep</string></value><value><string>test</string></value><value><string>true</string></value><value><string>video</string></value><value><string>mdraid09</string></value><value><string>mdraid1x</string></value><value><string>lvm</string></value><value><string>serial</string></value><value><string>regexp</string></value><value><string>tr</string></value><value><string>tftp</string></value><value><string>http</string></value><value><string>luks</string></value><value><string>gcry_rijndael</string></value><value><string>gcry_sha1</string></value><value><string>gcry_sha256</string></value></data></array></value></member><member><name>grubconfig_dir</name><value><string>/var/lib/cobbler/grub_config</string></value></member><member><name>build_reporting_enabled</name><value><boolean>0</boolean></value></member><member><name>build_reporting_email</name><value><array><data></data></array></value></member><member><name>build_reporting_ignorelist</name><value><array><data></data></array></value></member><member><name>build_reporting_sender</name><value><string></string></value></member><member><name>build_reporting_smtp_server</name><value><string>localhost</string></value></member><member><name>build_reporting_subject</name><value><string></string></value></member><member><name>buildisodir</name><value><string>/var/cache/cobbler/buildiso</string></value></member><member><name>cheetah_import_whitelist</name><value><array><data><value><string>re</string></value><value><string>random</string></value><value><string>time</string></value></data></array></value></member><member><name>client_use_https</name><value><boolean>0</boolean></value></member><member><name>client_use_localhost</name><value><boolean>0</boolean></value></member><member><name>cobbler_master</name><value><string></string></value></member><member><name>convert_server_to_ip</name><value><boolean>0</boolean></value></member><member><name>createrepo_flags</name><value><string>-ccache-ssha</string></value></member><member><name>autoinstall</name><value><string>default.ks</string></value></member><member><name>default_name_servers</name><value><array><data></data></array></value></member><member><name>default_name_servers_search</name><value><array><data></data></array></value></member><member><name>default_ownership</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>default_password_crypted</name><value><string>\\$1\\$mF86/UHC\\$WvcIcX2t6crBz2onWxyac.</string></value></member><member><name>default_template_type</name><value><string>cheetah</string></value></member><member><name>default_virt_bridge</name><value><string>xenbr0</string></value></member><member><name>default_virt_disk_driver</name><value><string>raw</string></value></member><member><name>default_virt_file_size</name><value><double>5.0</double></value></member><member><name>default_virt_ram</name><value><int>512</int></value></member><member><name>default_virt_type</name><value><string>xenpv</string></value></member><member><name>enable_ipxe</name><value><boolean>0</boolean></value></member><member><name>enable_menu</name><value><boolean>1</boolean></value></member><member><name>grub2_mod_dir</name><value><string>/usr/share/grub2/</string></value></member><member><name>http_port</name><value><int>80</int></value></member><member><name>iso_template_dir</name><value><string>/etc/cobbler/iso</string></value></member><member><name>jinja2_includedir</name><value><string>/var/lib/cobbler/jinja2</string></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>ldap_anonymous_bind</name><value><boolean>1</boolean></value></member><member><name>ldap_base_dn</name><value><string>DC=devel,DC=redhat,DC=com</string></value></member><member><name>ldap_port</name><value><int>389</int></value></member><member><name>ldap_search_bind_dn</name><value><string></string></value></member><member><name>ldap_search_passwd</name><value><string></string></value></member><member><name>ldap_search_prefix</name><value><string>uid=</string></value></member><member><name>ldap_server</name><value><string>grimlock.devel.redhat.com</string></value></member><member><name>ldap_tls</name><value><boolean>1</boolean></value></member><member><name>ldap_tls_cacertdir</name><value><string></string></value></member><member><name>ldap_tls_cacertfile</name><value><string></string></value></member><member><name>ldap_tls_certfile</name><value><string></string></value></member><member><name>ldap_tls_keyfile</name><value><string></string></value></member><member><name>ldap_tls_reqcert</name><value><string>hard</string></value></member><member><name>ldap_tls_cipher_suite</name><value><string></string></value></member><member><name>bind_manage_ipmi</name><value><boolean>0</boolean></value></member><member><name>manage_dhcp</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp_v6</name><value><boolean>0</boolean></value></member><member><name>manage_dhcp_v4</name><value><boolean>1</boolean></value></member><member><name>manage_dns</name><value><boolean>0</boolean></value></member><member><name>manage_forward_zones</name><value><array><data></data></array></value></member><member><name>manage_reverse_zones</name><value><array><data></data></array></value></member><member><name>manage_genders</name><value><boolean>0</boolean></value></member><member><name>manage_rsync</name><value><boolean>0</boolean></value></member><member><name>manage_tftpd</name><value><boolean>1</boolean></value></member><member><name>mgmt_classes</name><value><array><data></data></array></value></member><member><name>mgmt_parameters</name><value><struct><member><name>from_cobbler</name><value><int>1</int></value></member></struct></value></member><member><name>next_server_v4</name><value><string>192.168.1.1</string></value></member><member><name>next_server_v6</name><value><string>::1</string></value></member><member><name>nsupdate_enabled</name><value><boolean>0</boolean></value></member><member><name>nsupdate_log</name><value><string>/var/log/cobbler/nsupdate.log</string></value></member><member><name>nsupdate_tsig_algorithm</name><value><string>hmac-sha512</string></value></member><member><name>nsupdate_tsig_key</name><value><array><data></data></array></value></member><member><name>power_management_default_type</name><value><string>ipmilan</string></value></member><member><name>proxies</name><value><array><data></data></array></value></member><member><name>proxy_url_ext</name><value><string></string></value></member><member><name>proxy_url_int</name><value><string></string></value></member><member><name>puppet_auto_setup</name><value><boolean>0</boolean></value></member><member><name>puppet_parameterized_classes</name><value><boolean>1</boolean></value></member><member><name>puppet_server</name><value><string>puppet</string></value></member><member><name>puppet_version</name><value><int>2</int></value></member><member><name>puppetca_path</name><value><string>/usr/bin/puppet</string></value></member><member><name>pxe_just_once</name><value><boolean>1</boolean></value></member><member><name>nopxe_with_triggers</name><value><boolean>1</boolean></value></member><member><name>redhat_management_permissive</name><value><boolean>0</boolean></value></member><member><name>redhat_management_server</name><value><string>xmlrpc.rhn.redhat.com</string></value></member><member><name>redhat_management_key</name><value><string></string></value></member><member><name>register_new_installs</name><value><boolean>0</boolean></value></member><member><name>remove_old_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>replicate_repo_rsync_options</name><value><string>-avzH</string></value></member><member><name>replicate_rsync_options</name><value><string>-avzH</string></value></member><member><name>reposync_flags</name><value><string>-l-m-d</string></value></member><member><name>reposync_rsync_flags</name><value><string></string></value></member><member><name>restart_dhcp</name><value><boolean>1</boolean></value></member><member><name>restart_dns</name><value><boolean>1</boolean></value></member><member><name>run_install_triggers</name><value><boolean>1</boolean></value></member><member><name>scm_track_enabled</name><value><boolean>0</boolean></value></member><member><name>scm_track_mode</name><value><string>git</string></value></member><member><name>scm_track_author</name><value><string>cobbler&lt;cobbler@localhost&gt;</string></value></member><member><name>scm_push_script</name><value><string>/bin/true</string></value></member><member><name>serializer_pretty_json</name><value><boolean>0</boolean></value></member><member><name>server</name><value><string>192.168.1.1</string></value></member><member><name>sign_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>signature_path</name><value><string>/var/lib/cobbler/distro_signatures.json</string></value></member><member><name>signature_url</name><value><string>https://cobbler.github.io/signatures/3.0.x/latest.json</string></value></member><member><name>syslinux_dir</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_memdisk_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_pxelinux_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>tftpboot_location</name><value><string>/srv/tftpboot</string></value></member><member><name>virt_auto_boot</name><value><boolean>1</boolean></value></member><member><name>webdir</name><value><string>/var/www/cobbler</string></value></member><member><name>webdir_whitelist</name><value><array><data><value><string>.link_cache</string></value><value><string>misc</string></value><value><string>distro_mirror</string></value><value><string>images</string></value><value><string>links</string></value><value><string>localmirror</string></value><value><string>pub</string></value><value><string>rendered</string></value><value><string>repo_mirror</string></value><value><string>repo_profile</string></value><value><string>repo_system</string></value><value><string>svc</string></value><value><string>web</string></value><value><string>webui</string></value></data></array></value></member><member><name>xmlrpc_port</name><value><int>25151</int></value></member><member><name>yum_distro_priority</name><value><int>1</int></value></member><member><name>yum_post_install_mirror</name><value><boolean>1</boolean></value></member><member><name>yumdownloader_flags</name><value><string>--resolve</string></value></member><member><name>windows_enabled</name><value><boolean>0</boolean></value></member><member><name>windows_template_dir</name><value><string>/etc/cobbler/windows</string></value></member><member><name>samba_distro_share</name><value><string>DISTRO</string></value></member></struct></value></param></params></methodResponse>`
    const result = 131
    service.get_settings('').subscribe((data) => {
      // Let's not compare the content as this is taken care of by the deserializer tests
      expect(Object.keys(data).length).toEqual(result);
      done();
    });
    const mockRequest = httpTestingController.expectOne('http://localhost/cobbler_api');
    mockRequest.flush(methodResponse);
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

  it('should execute the version action on the Cobbler Server', (done: DoneFn) => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><double>3.4</double></value></param></params></methodResponse>`
    const result = 3.4
    service.version().subscribe(value => {
      expect(value).toEqual(result);
      done()
    });
    const mockRequest = httpTestingController.expectOne('http://localhost/cobbler_api');
    mockRequest.flush(methodResponse);
  });

  it('should execute the extended_version action on the Cobbler Server', (done: DoneFn) => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>gitdate</name><value><string>Mon Jun 13 16:13:33 2022 +0200</string></value></member><member><name>gitstamp</name><value><string>0e20f01b</string></value></member><member><name>builddate</name><value><string>Mon Jun 27 06:34:23 2022</string></value></member><member><name>version</name><value><string>3.4.0</string></value></member><member><name>version_tuple</name><value><array><data><value><int>3</int></value><value><int>4</int></value><value><int>0</int></value></data></array></value></member></struct></value></param></params></methodResponse>`
    const result: ExtendedVersion = {
      gitdate: "Mon Jun 13 16:13:33 2022 +0200",
      gitstamp: "0e20f01b",
      builddate: "Mon Jun 27 06:34:23 2022",
      version: "3.4.0",
      versionTuple: {
        major: 3,
        minor: 4,
        patch: 0
      }
    }

    service.extended_version().subscribe(
      value => {
        expect(value).toEqual(result);
        done();
      });
    const mockRequest = httpTestingController.expectOne('http://localhost/cobbler_api');
    mockRequest.flush(methodResponse);
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
