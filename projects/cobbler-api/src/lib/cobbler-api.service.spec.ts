import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { describe, expect, it } from 'vitest';

import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Bootloader, Value } from './custom-types/enums';
import {
  BackgroundBuildisoOptions,
  BackgroundImportOptions,
  BackgroundPowerSystem,
  BackgroundReplicateOptions,
  BackgroundReposyncOptions,
  Event,
  ExtendedVersion,
  InstallationStatus,
  RegisterOptions,
  SyncSystemsOptions,
} from './custom-types/misc';
import { DistroSignatures } from './custom-types/signatures';
import { COBBLER_URL } from './lib.config';
import { AngularXmlrpcService } from 'typescript-xmlrpc';

import { CobblerApiService } from './cobbler-api.service';
import { KernelOptionsDict } from './custom-types/types';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('CobblerApiService', () => {
  let service: CobblerApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: AngularXmlrpcService,
          useClass: AngularXmlrpcService,
        },
        {
          provide: CobblerApiService,
          deps: [AngularXmlrpcService, COBBLER_URL],
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
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
  it('should execute the check action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>The 'server' field in /etc/cobbler/settings.yaml must be set to something other than localhost, or automatic installation features will not work.  This should be a resolvable hostname or IP for the boot server as reachable by all machines that will use it.</string></value><value><string>For PXE to be functional, the 'next_server_v4' field in /etc/cobbler/settings.yaml must be set to something other than 127.0.0.1, and should match the IP of the boot server on the PXE network.</string></value><value><string>For PXE to be functional, the 'next_server_v6' field in /etc/cobbler/settings.yaml must be set to something other than ::1, and should match the IP of the boot server on the PXE network.</string></value><value><string>service cobblerd is not running</string></value><value><string>some network boot-loaders are missing from /var/lib/cobbler/loaders. If you only want to handle x86/x86_64 netbooting, you may ensure that you have installed a *recent* version of the syslinux package installed and can ignore this message entirely. Files in this directory, should you want to support all architectures, should include pxelinux.0, andmenu.c32.</string></value><value><string>enable and start rsyncd.service with systemctl</string></value><value><string>reposync not installed, install yum-utils</string></value><value><string>yumdownloader is not installed, install yum-utils</string></value><value><string>The default password used by the sample templates for newly installed machines (default_password_crypted in /etc/cobbler/settings.yaml) is still set to 'cobbler' and should be changed, try: "openssl passwd -1 -salt 'random-phrase-here' 'your-password-here'" to generate new one</string></value></data></array></value></param></params></methodResponse>`;

    const result = [
      // eslint-disable-next-line max-len
      "The 'server' field in /etc/cobbler/settings.yaml must be set to something other than localhost, or automatic installation features will not work.  This should be a resolvable hostname or IP for the boot server as reachable by all machines that will use it.",
      // eslint-disable-next-line max-len
      "For PXE to be functional, the 'next_server_v4' field in /etc/cobbler/settings.yaml must be set to something other than 127.0.0.1, and should match the IP of the boot server on the PXE network.",
      // eslint-disable-next-line max-len
      "For PXE to be functional, the 'next_server_v6' field in /etc/cobbler/settings.yaml must be set to something other than ::1, and should match the IP of the boot server on the PXE network.",
      'service cobblerd is not running',
      // eslint-disable-next-line max-len
      'some network boot-loaders are missing from /var/lib/cobbler/loaders. If you only want to handle x86/x86_64 netbooting, you may ensure that you have installed a *recent* version of the syslinux package installed and can ignore this message entirely. Files in this directory, should you want to support all architectures, should include pxelinux.0, andmenu.c32.',
      'enable and start rsyncd.service with systemctl',
      'reposync not installed, install yum-utils',
      'yumdownloader is not installed, install yum-utils',
      // eslint-disable-next-line max-len
      "The default password used by the sample templates for newly installed machines (default_password_crypted in /etc/cobbler/settings.yaml) is still set to 'cobbler' and should be changed, try: \"openssl passwd -1 -salt 'random-phrase-here' 'your-password-here'\" to generate new one",
    ];
    service.check('').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the background_buildiso action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>2023-01-24_083001_Build Iso_20fa7d4256fc4f61a2b9c2237c80fb41</string></value></param></params></methodResponse>`;
    const result =
      '2023-01-24_083001_Build Iso_20fa7d4256fc4f61a2b9c2237c80fb41';
    const buildisoOptions: BackgroundBuildisoOptions = {
      iso: '',
      profiles: '',
      systems: '',
      buildisodir: '',
      distro: '',
      standalone: false,
      airgapped: false,
      source: '',
      excludeDNS: false,
      xorrisofsOpts: '',
    };

    service.background_buildiso(buildisoOptions, '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the background_aclsetup action on the Cobbler Server', () => {
    service.background_aclsetup(undefined, '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the background_sync action on the Cobbler Server', () => {
    service.background_sync(undefined, '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the background_syncsystems action on the Cobbler Server', () => {
    service.background_syncsystems(undefined, '');
    expect(service).toBeFalsy();
  });

  it('should execute the background_hardlink action on the Cobbler Server', () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>2022-09-30_203004_Hardlink_800c38f4e0424187aed6a6ffb6553ef8</string></value></param></params></methodResponse>`;
    const result =
      '2022-09-30_203004_Hardlink_800c38f4e0424187aed6a6ffb6553ef8';
    service.background_hardlink('').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the background_mkloaders action on the Cobbler Server', () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>2022-09-30_203957_Create bootable bootloader images_9c809af4d6f148e49b071fac84f9a664</string></value></param></params></methodResponse>`;
    const result =
      '2022-09-30_203957_Create bootable bootloader images_9c809af4d6f148e49b071fac84f9a664';
    service.backgroundMkloaders('').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the background_validate_autoinstall_files action on the Cobbler Server', () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>2022-09-30_203505_Automated installation files validation_487b1a5d1d914c62834126391ac2b601</string></value></param></params></methodResponse>`;
    const result =
      '2022-09-30_203505_Automated installation files validation_487b1a5d1d914c62834126391ac2b601';
    service.background_validate_autoinstall_files('').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the background_replicate action on the Cobbler Server', () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>2023-01-24_075801_Replicate_ea7a003a81264039b4277ac55664661a</string></value></param></params></methodResponse>`;
    const result =
      '2023-01-24_075801_Replicate_ea7a003a81264039b4277ac55664661a';
    const replicateOptions: BackgroundReplicateOptions = {
      master: '',
      port: '',
      distro_patterns: '',
      profile_patterns: '',
      system_patterns: '',
      repo_patterns: '',
      image_patterns: '',

      prune: false,
      omit_data: false,
      sync_all: false,
      use_ssl: false,
    };
    service.background_replicate(replicateOptions, '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the background_import action on the Cobbler Server', () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>2023-01-24_103639_Media import_dd297121f7bc412e9ce4d80f05de4b3f</string></value></param></params></methodResponse>`;
    const result =
      '2023-01-24_103639_Media import_dd297121f7bc412e9ce4d80f05de4b3f';
    const importOptions: BackgroundImportOptions = {
      path: '',
      name: '',
      available_as: '',
      autoinstall_file: '',
      rsync_flags: '',
      arch: '',
      breed: '',
      os_version: '',
    };
    service.background_import(importOptions, '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the background_reposync action on the Cobbler Server', () => {
    service.background_reposync(undefined, '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the background_power_system action on the Cobbler Server', () => {
    service.background_power_system(undefined, '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the power_system action on the Cobbler Server', () => {
    service.power_system('', '', '');
    expect(service).toBeFalsy();
  });

  it('should execute the background_signature_update action on the Cobbler Server', () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>2022-09-30_195846_Updating Signatures_6c5300d51c224984b4319fb536cc21d0</string></value></param></params></methodResponse>`;
    const result =
      '2022-09-30_195846_Updating Signatures_6c5300d51c224984b4319fb536cc21d0';
    service.background_signature_update('').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_events action on the Cobbler Server', () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>2023-01-24_075223_Create bootable bootloader images_77c9dbafc9234f018d67ec3295fcc22b</name><value><array><data><value><double>1674546743.8418643</double></value><value><string>Create bootable bootloader images</string></value><value><string>complete</string></value><value><array><data><value><string>1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ==</string></value></data></array></value></data></array></value></member><member><name>2023-01-24_075801_Replicate_ea7a003a81264039b4277ac55664661a</name><value><array><data><value><double>1674547081.1178503</double></value><value><string>Replicate</string></value><value><string>failed</string></value><value><array><data><value><string>1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ==</string></value></data></array></value></data></array></value></member><member><name>2023-01-24_083001_Build Iso_20fa7d4256fc4f61a2b9c2237c80fb41</name><value><array><data><value><double>1674549001.176315</double></value><value><string>Build Iso</string></value><value><string>failed</string></value><value><array><data><value><string>1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ==</string></value></data></array></value></data></array></value></member><member><name>2023-01-24_083137_(CLI) ACL Configuration_334327920d2946fda3ac95dbf457e76d</name><value><array><data><value><double>1674549097.240632</double></value><value><string>(CLI) ACL Configuration</string></value><value><string>failed</string></value><value><array><data><value><string>1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ==</string></value></data></array></value></data></array></value></member></struct></value></param></params></methodResponse>`;
    const result: Array<Event> = [
      {
        id: '2023-01-24_075223_Create bootable bootloader images_77c9dbafc9234f018d67ec3295fcc22b',
        statetime: 1674546743.8418643,
        name: 'Create bootable bootloader images',
        state: 'complete',
        readByWho: ['1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ=='],
      },
      {
        id: '2023-01-24_075801_Replicate_ea7a003a81264039b4277ac55664661a',
        statetime: 1674547081.1178503,
        name: 'Replicate',
        state: 'failed',
        readByWho: ['1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ=='],
      },
      {
        id: '2023-01-24_083001_Build Iso_20fa7d4256fc4f61a2b9c2237c80fb41',
        statetime: 1674549001.176315,
        name: 'Build Iso',
        state: 'failed',
        readByWho: ['1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ=='],
      },
      {
        id: '2023-01-24_083137_(CLI) ACL Configuration_334327920d2946fda3ac95dbf457e76d',
        statetime: 1674549097.240632,
        name: '(CLI) ACL Configuration',
        state: 'failed',
        readByWho: ['1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ=='],
      },
    ];
    service.get_events('').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_event_log action on the Cobbler Server', () => {
    /* eslint-disable max-len */
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,744 - INFO | start_task(sync); event_id(2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29)\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,744 - INFO | syncing all\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,745 - INFO | copying: /var/lib/cobbler/misc/anamon.init -&gt; /srv/www/cobbler/misc\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,745 - INFO | copying: /var/lib/cobbler/misc/anamon -&gt; /srv/www/cobbler/misc\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,745 - INFO | running pre-sync triggers\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,746 - INFO | cleaning trees\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,746 - INFO | removing: /srv/tftpboot/pxelinux.cfg\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,746 - INFO | removing: /srv/tftpboot/grub\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,746 - INFO | removing: /srv/tftpboot/images\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,746 - INFO | removing: /srv/tftpboot/ipxe\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,746 - INFO | removing: /srv/tftpboot/esxi\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,747 - INFO | removing: /srv/www/cobbler/rendered\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,747 - INFO | copying bootloaders\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,747 - INFO | running: ['rsync', '-rpt', '--copy-links', '--exclude=.cobbler_postun_cleanup', '/var/lib/cobbler/loaders/', '/srv/tftpboot']\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,936 - INFO | received on stdout:\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,936 - INFO | running: ['rsync', '-rpt', '--copy-links', '--exclude=README.grubconfig', '/var/lib/cobbler/grub_config/', '/srv/tftpboot']\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,942 - INFO | received on stdout:\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,942 - INFO | copying distros to tftpboot\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,943 - INFO | copying images\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,943 - INFO | generating PXE configuration files\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,943 - INFO | generating PXE menu structure\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,945 - INFO | rendering DHCP files\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,945 - INFO | generating /etc/dhcpd.conf\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,962 - INFO | cleaning link caches\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,962 - INFO | running post-sync triggers\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:24,962 - INFO | running: ['dhcpd', '-t', '-q']\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:25,002 - INFO | received on stdout:\n[2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29] 2022-09-30 14:51:26,044 - INFO | ### TASK COMPLETE ###</string></value></param></params></methodResponse>`;
    /* eslint-enable max-len */
    service
      .get_event_log('2022-09-30_145124_Sync_2cabdc4eddfa4731b45f145d7b625e29')
      .subscribe((value) => [expect(value.split(/\r?\n/).length).toEqual(28)]);
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_task_status action on the Cobbler Server', () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><double>1664568243.5196018</double></value><value><string>Updating Signatures</string></value><value><string>complete</string></value><value><array><data></data></array></value></data></array></value></param></params></methodResponse>`;
    const result = {
      id: '2022-09-30_200403_Updating Signatures_8f2b3c1626fb4b158636059b31242ee6',
      statetime: 1664568243.5196018,
      name: 'Updating Signatures',
      state: 'complete',
      readByWho: [],
    };
    service
      .get_task_status(
        '2022-09-30_200403_Updating Signatures_8f2b3c1626fb4b158636059b31242ee6',
      )
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the last_modified_time action on the Cobbler Server', () => {
    service.last_modified_time();
    expect(service).toBeFalsy();
  });

  it.skip('should execute the ping action on the Cobbler Server', () => {
    service.ping();
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_user_from_token action on the Cobbler Server', () => {
    service.get_user_from_token('');
    expect(service).toBeFalsy();
  });

  // Captured live from a Cobbler 4.0.0b1 dev instance: get_item("profile", ...) for a profile with a non-empty
  // kernel_options struct and several nested structs (dns, tftp, virt). The legacy ks_meta/kickstart aliases must
  // be dropped, matching get_profile()'s own conversion via rebuildItem().
  it('should execute the get_item action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>ctime</name><value><double>1787515044.264215</double></value></member><member><name>mtime</name><value><double>1787515044.264215</double></value></member><member><name>uid</name><value><string>56e49548605b4cd69c018bcefc0d100c</string></value></member><member><name>name</name><value><string>task5profile</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>depth</name><value><int>1</int></value></member><member><name>parent</name><value><string></string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>kernel_options</name><value><struct><member><name>a</name><value><string>b</string></value></member><member><name>c</name><value><string>d</string></value></member></struct></value></member><member><name>kernel_options_post</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>autoinstall_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_loaders</name><value><array><data><value><string>&lt;&lt;inherit&gt;&gt;</string></value></data></array></value></member><member><name>dhcp_tag</name><value><string></string></value></member><member><name>distro</name><value><string>8d6b61d0ad2646f487fdb27221b37b0d</string></value></member><member><name>dns</name><value><struct><member><name>name_servers</name><value><array><data></data></array></value></member><member><name>name_servers_search</name><value><array><data></data></array></value></member></struct></value></member><member><name>enable_ipxe</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>enable_menu</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>tftp</name><value><struct><member><name>next_server_v4</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>next_server_v6</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></member><member><name>filename</name><value><string></string></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_org</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_user</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_password</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>repos</name><value><array><data></data></array></value></member><member><name>server</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>menu</name><value><string></string></value></member><member><name>display_name</name><value><string></string></value></member><member><name>virt</name><value><struct><member><name>auto_boot</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>cpus</name><value><int>1</int></value></member><member><name>disk_driver</name><value><string>raw</string></value></member><member><name>file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>path</name><value><string></string></value></member><member><name>pxe_boot</name><value><boolean>0</boolean></value></member><member><name>ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>type</name><value><string>kvm</string></value></member><member><name>uefi</name><value><boolean>0</boolean></value></member></struct></value></member><member><name>virt_bridge</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>kickstart</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ks_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></param></params></methodResponse>`;
    const result = {
      ctime: 1787515044.264215,
      mtime: 1787515044.264215,
      uid: '56e49548605b4cd69c018bcefc0d100c',
      name: 'task5profile',
      comment: '',
      owners: '<<inherit>>',
      depth: 1,
      parent: '',
      is_subobject: false,
      children: [],
      kernel_options: { a: 'b', c: 'd' },
      kernel_options_post: '<<inherit>>',
      autoinstall_meta: '<<inherit>>',
      template_files: {},
      autoinstall: '<<inherit>>',
      boot_loaders: ['<<inherit>>'],
      dhcp_tag: '',
      distro: '8d6b61d0ad2646f487fdb27221b37b0d',
      dns: { name_servers: [], name_servers_search: [] },
      enable_ipxe: '<<inherit>>',
      enable_menu: '<<inherit>>',
      tftp: { next_server_v4: '<<inherit>>', next_server_v6: '<<inherit>>' },
      filename: '',
      proxy: '<<inherit>>',
      redhat_management_key: '<<inherit>>',
      redhat_management_org: '<<inherit>>',
      redhat_management_user: '<<inherit>>',
      redhat_management_password: '<<inherit>>',
      repos: [],
      server: '<<inherit>>',
      menu: '',
      display_name: '',
      virt: {
        auto_boot: '<<inherit>>',
        cpus: 1,
        disk_driver: 'raw',
        file_size: '<<inherit>>',
        path: '',
        pxe_boot: false,
        ram: '<<inherit>>',
        type: 'kvm',
        uefi: false,
      },
      virt_bridge: '<<inherit>>',
    };
    service
      .get_item('profile', '56e49548605b4cd69c018bcefc0d100c')
      .subscribe((value) => {
        expect(value).toEqual(result);
        // The legacy ks_meta/kickstart aliases must be dropped, and nested structs must be plain objects.
        expect('ks_meta' in value).toBeFalsy();
        expect('kickstart' in value).toBeFalsy();
        expect((value as any).kernel_options instanceof Map).toBeFalsy();
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_distro action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480439.039089</double></value></member><member><name>mtime</name><value><double>1721480439.039089</double></value></member><member><name>uid</name><value><string>12f034d6781946d1af0783e20684cbd4</string></value></member><member><name>name</name><value><string>test</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>fetchable_files</name><value><struct></struct></value></member><member><name>boot_files</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>tree_build_time</name><value><double>0.0</double></value></member><member><name>arch</name><value><string>x86_64</string></value></member><member><name>boot_loaders</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>breed</name><value><string></string></value></member><member><name>initrd</name><value><string>/root/initrd</string></value></member><member><name>kernel</name><value><string>/root/kernel</string></value></member><member><name>os_version</name><value><string></string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>source_repos</name><value><array><data></data></array></value></member><member><name>remote_boot_kernel</name><value><string></string></value></member><member><name>remote_grub_kernel</name><value><string></string></value></member><member><name>remote_boot_initrd</name><value><string></string></value></member><member><name>remote_grub_initrd</name><value><string></string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></param></params></methodResponse>`;
    const result = {
      ctime: 1721480439.039089,
      depth: 0,
      mtime: 1721480439.039089,
      uid: '12f034d6781946d1af0783e20684cbd4',
      source_repos: [],
      tree_build_time: 0,
      arch: 'x86_64',
      autoinstall_meta: {},
      boot_files: {},
      boot_loaders: Bootloader.INHERITED,
      is_subobject: false,
      parent: '',
      breed: '',
      comment: '',
      fetchable_files: {},
      initrd: '/root/initrd',
      kernel: '/root/kernel',
      remote_boot_initrd: '',
      remote_boot_kernel: '',
      remote_grub_initrd: '',
      remote_grub_kernel: '',
      kernel_options: {},
      kernel_options_post: {},
      name: 'test',
      os_version: '',
      owners: '<<inherit>>',
      redhat_management_key: Value.INHERITED,
      template_files: {},
    };
    service
      .get_distro('12f034d6781946d1af0783e20684cbd4', false, false, '')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_profile action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>1</int></value></member><member><name>ctime</name><value><double>1721480439.3090012</double></value></member><member><name>mtime</name><value><double>1721480439.3090012</double></value></member><member><name>uid</name><value><string>5f01667614244fcd9c7ca7fa59c7def1</string></value></member><member><name>name</name><value><string>testprof</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>kernel_options_post</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>autoinstall_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>fetchable_files</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_files</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_loaders</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>dhcp_tag</name><value><string></string></value></member><member><name>distro</name><value><string>test</string></value></member><member><name>enable_ipxe</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>enable_menu</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>name_servers</name><value><array><data></data></array></value></member><member><name>name_servers_search</name><value><array><data></data></array></value></member><member><name>next_server_v4</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>next_server_v6</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>filename</name><value><string></string></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>repos</name><value><array><data></data></array></value></member><member><name>server</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>menu</name><value><string></string></value></member><member><name>virt_auto_boot</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_bridge</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_cpus</name><value><int>1</int></value></member><member><name>virt_disk_driver</name><value><string>raw</string></value></member><member><name>virt_file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_path</name><value><string></string></value></member><member><name>virt_ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_type</name><value><string>xenpv</string></value></member><member><name>kickstart</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ks_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></param></params></methodResponse>`;
    const result = {
      name: 'testprof',
      depth: 1,
      mtime: 1721480439.3090012,
      is_subobject: false,
      boot_loaders: '<<inherit>>',
      autoinstall_meta: '<<inherit>>',
      server: '<<inherit>>',
      distro: 'test',
      comment: '',
      next_server_v4: '<<inherit>>',
      next_server_v6: '<<inherit>>',
      enable_ipxe: '<<inherit>>',
      parent: '',
      owners: '<<inherit>>',
      autoinstall: '<<inherit>>',
      uid: '5f01667614244fcd9c7ca7fa59c7def1',
      virt_ram: '<<inherit>>',
      boot_files: '<<inherit>>',
      name_servers: [],
      enable_menu: '<<inherit>>',
      menu: '',
      ctime: 1721480439.3090012,
      fetchable_files: '<<inherit>>',
      kernel_options: '<<inherit>>',
      virt_auto_boot: '<<inherit>>',
      kernel_options_post: '<<inherit>>',
      proxy: '<<inherit>>',
      filename: '',
      dhcp_tag: '',
      redhat_management_key: '<<inherit>>',
      repos: [],
      template_files: {},
      virt_type: 'xenpv',
      virt_cpus: 1,
      virt_bridge: '<<inherit>>',
      name_servers_search: [],
      virt_path: '',
      virt_file_size: '<<inherit>>',
      virt_disk_driver: 'raw',
    };
    service
      .get_profile('5f01667614244fcd9c7ca7fa59c7def1', false, false, '')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_system action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>2</int></value></member><member><name>ctime</name><value><double>1721480439.5932038</double></value></member><member><name>mtime</name><value><double>1721480439.5932038</double></value></member><member><name>uid</name><value><string>a3320bc9105c44f1b92ab1743d460ed8</string></value></member><member><name>name</name><value><string>testsys</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>kernel_options_post</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>autoinstall_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>fetchable_files</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_files</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>interfaces</name><value><struct><member><name>default</name><value><struct><member><name>bonding_opts</name><value><string></string></value></member><member><name>bridge_opts</name><value><string></string></value></member><member><name>cnames</name><value><array><data></data></array></value></member><member><name>connected_mode</name><value><boolean>0</boolean></value></member><member><name>dhcp_tag</name><value><string></string></value></member><member><name>dns_name</name><value><string></string></value></member><member><name>if_gateway</name><value><string></string></value></member><member><name>interface_master</name><value><string></string></value></member><member><name>interface_type</name><value><string>na</string></value></member><member><name>ip_address</name><value><string></string></value></member><member><name>ipv6_address</name><value><string></string></value></member><member><name>ipv6_default_gateway</name><value><string></string></value></member><member><name>ipv6_mtu</name><value><string></string></value></member><member><name>ipv6_prefix</name><value><string></string></value></member><member><name>ipv6_secondaries</name><value><array><data></data></array></value></member><member><name>ipv6_static_routes</name><value><array><data></data></array></value></member><member><name>mac_address</name><value><string></string></value></member><member><name>management</name><value><boolean>0</boolean></value></member><member><name>mtu</name><value><string></string></value></member><member><name>netmask</name><value><string></string></value></member><member><name>static</name><value><boolean>0</boolean></value></member><member><name>static_routes</name><value><array><data></data></array></value></member><member><name>virt_bridge</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></member></struct></value></member><member><name>ipv6_autoconfiguration</name><value><boolean>0</boolean></value></member><member><name>repos_enabled</name><value><boolean>0</boolean></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_loaders</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>enable_ipxe</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>gateway</name><value><string></string></value></member><member><name>hostname</name><value><string></string></value></member><member><name>image</name><value><string></string></value></member><member><name>ipv6_default_device</name><value><string></string></value></member><member><name>name_servers</name><value><array><data></data></array></value></member><member><name>name_servers_search</name><value><array><data></data></array></value></member><member><name>netboot_enabled</name><value><boolean>0</boolean></value></member><member><name>next_server_v4</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>next_server_v6</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>filename</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>power_address</name><value><string></string></value></member><member><name>power_id</name><value><string></string></value></member><member><name>power_pass</name><value><string></string></value></member><member><name>power_type</name><value><string></string></value></member><member><name>power_user</name><value><string></string></value></member><member><name>power_options</name><value><string></string></value></member><member><name>power_identity_file</name><value><string></string></value></member><member><name>profile</name><value><string>testprof</string></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>server</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>status</name><value><string></string></value></member><member><name>virt_auto_boot</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_cpus</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_disk_driver</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_path</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_pxe_boot</name><value><boolean>0</boolean></value></member><member><name>virt_ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_type</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>serial_device</name><value><int>-1</int></value></member><member><name>serial_baud_rate</name><value><int>-1</int></value></member><member><name>kickstart</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ks_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></param></params></methodResponse>`;
    const result = {
      ctime: 1721480439.5932038,
      mtime: 1721480439.5932038,
      name: 'testsys',
      depth: 2,
      comment: '',
      owners: '<<inherit>>',
      uid: 'a3320bc9105c44f1b92ab1743d460ed8',
      autoinstall: '<<inherit>>',
      boot_files: '<<inherit>>',
      boot_loaders: '<<inherit>>',
      parent: '',
      is_subobject: false,
      autoinstall_meta: '<<inherit>>',
      enable_ipxe: '<<inherit>>',
      fetchable_files: '<<inherit>>',
      filename: '<<inherit>>',
      gateway: '',
      hostname: '',
      image: '',
      ipv6_autoconfiguration: false,
      ipv6_default_device: '',
      kernel_options: '<<inherit>>',
      kernel_options_post: '<<inherit>>',
      name_servers: [],
      name_servers_search: [],
      netboot_enabled: false,
      next_server_v4: '<<inherit>>',
      next_server_v6: '<<inherit>>',
      power_address: '',
      power_id: '',
      power_identity_file: '',
      power_options: '',
      power_pass: '',
      power_type: '',
      power_user: '',
      profile: 'testprof',
      proxy: '<<inherit>>',
      redhat_management_key: '<<inherit>>',
      repos_enabled: false,
      server: '<<inherit>>',
      serial_baud_rate: -1,
      serial_device: -1,
      status: '',
      virt_auto_boot: '<<inherit>>',
      virt_disk_driver: '<<inherit>>',
      virt_path: '<<inherit>>',
      virt_ram: '<<inherit>>',
      virt_type: '<<inherit>>',
      virt_file_size: '<<inherit>>',
      virt_cpus: '<<inherit>>',
      virt_pxe_boot: false,
      template_files: {},
      interfaces: {
        default: {
          bonding_opts: '',
          bridge_opts: '',
          cnames: [],
          connected_mode: false,
          dhcp_tag: '',
          dns_name: '',
          if_gateway: '',
          interface_master: '',
          interface_type: 'na',
          ip_address: '',
          ipv6_address: '',
          ipv6_default_gateway: '',
          ipv6_mtu: '',
          ipv6_prefix: '',
          ipv6_secondaries: [],
          ipv6_static_routes: [],
          mac_address: '',
          management: false,
          mtu: '',
          netmask: '',
          static: false,
          static_routes: [],
          virt_bridge: '<<inherit>>',
        },
      },
    };
    service
      .get_system('a3320bc9105c44f1b92ab1743d460ed8', false, false, '')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  // Captured live from a Cobbler 4.0.0b1 dev instance ("v4.0.0b1", XML-RPC at http://localhost/cobbler_api) for a
  // system that deliberately carries non-empty nested struct data: kernel_options with two entries, autoinstall_meta
  // with one entry and populated dns/power sub-objects. The expected object below is the exact dict the Python server
  // returned for the same call (minus the legacy ks_meta/kickstart aliases that rebuildItem() drops).
  it('should convert the nested structs of a real Cobbler 4.0.0 get_system response into plain objects', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>ctime</name><value><double>1787509606.0302052</double></value></member><member><name>mtime</name><value><double>1787509606.0302052</double></value></member><member><name>uid</name><value><string>5a1d7b47cd424c5aa4b5b63853df4fc7</string></value></member><member><name>name</name><value><string>t4system</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>depth</name><value><int>2</int></value></member><member><name>parent</name><value><string></string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>kernel_options</name><value><struct><member><name>rd.debug</name><value><string>~</string></value></member><member><name>ip</name><value><string>dhcp</string></value></member></struct></value></member><member><name>kernel_options_post</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>autoinstall_meta</name><value><struct><member><name>sysmeta</name><value><string>yes</string></value></member></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>ipv6_autoconfiguration</name><value><boolean>0</boolean></value></member><member><name>repos_enabled</name><value><boolean>0</boolean></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_loaders</name><value><array><data><value><string>&lt;&lt;inherit&gt;&gt;</string></value></data></array></value></member><member><name>dns</name><value><struct><member><name>name_servers</name><value><array><data><value><string>198.51.100.1</string></value></data></array></value></member><member><name>name_servers_search</name><value><array><data></data></array></value></member></struct></value></member><member><name>enable_ipxe</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>gateway</name><value><string></string></value></member><member><name>hostname</name><value><string></string></value></member><member><name>image</name><value><string></string></value></member><member><name>ipv6_default_device</name><value><string></string></value></member><member><name>netboot_enabled</name><value><boolean>0</boolean></value></member><member><name>tftp</name><value><struct><member><name>next_server_v4</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>next_server_v6</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></member><member><name>filename</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>power</name><value><struct><member><name>address</name><value><string>192.0.2.10</string></value></member><member><name>id</name><value><string></string></value></member><member><name>password</name><value><string></string></value></member><member><name>type</name><value><string>ipmilanplus</string></value></member><member><name>user</name><value><string>admin</string></value></member><member><name>options</name><value><string></string></value></member><member><name>identity_file</name><value><string></string></value></member></struct></value></member><member><name>profile</name><value><string>0b5d3ef680694a18a21fe2b86d147bf0</string></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_org</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_user</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_password</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>server</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>status</name><value><string></string></value></member><member><name>virt</name><value><struct><member><name>auto_boot</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>cpus</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>disk_driver</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>path</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>pxe_boot</name><value><boolean>0</boolean></value></member><member><name>ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>type</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>uefi</name><value><boolean>0</boolean></value></member></struct></value></member><member><name>serial_device</name><value><int>-1</int></value></member><member><name>serial_baud_rate</name><value><int>-1</int></value></member><member><name>display_name</name><value><string></string></value></member><member><name>kickstart</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ks_meta</name><value><struct><member><name>sysmeta</name><value><string>yes</string></value></member></struct></value></member></struct></value></param></params></methodResponse>`;
    const result = {
      autoinstall: '<<inherit>>',
      autoinstall_meta: {
        sysmeta: 'yes',
      },
      boot_loaders: ['<<inherit>>'],
      children: [],
      comment: '',
      ctime: 1787509606.0302052,
      depth: 2,
      display_name: '',
      dns: {
        name_servers: ['198.51.100.1'],
        name_servers_search: [],
      },
      enable_ipxe: '<<inherit>>',
      filename: '<<inherit>>',
      gateway: '',
      hostname: '',
      image: '',
      ipv6_autoconfiguration: false,
      ipv6_default_device: '',
      is_subobject: false,
      kernel_options: {
        ip: 'dhcp',
        'rd.debug': '~',
      },
      kernel_options_post: '<<inherit>>',
      mtime: 1787509606.0302052,
      name: 't4system',
      netboot_enabled: false,
      owners: '<<inherit>>',
      parent: '',
      power: {
        address: '192.0.2.10',
        id: '',
        identity_file: '',
        options: '',
        password: '',
        type: 'ipmilanplus',
        user: 'admin',
      },
      profile: '0b5d3ef680694a18a21fe2b86d147bf0',
      proxy: '<<inherit>>',
      redhat_management_key: '<<inherit>>',
      redhat_management_org: '<<inherit>>',
      redhat_management_password: '<<inherit>>',
      redhat_management_user: '<<inherit>>',
      repos_enabled: false,
      serial_baud_rate: -1,
      serial_device: -1,
      server: '<<inherit>>',
      status: '',
      template_files: {},
      tftp: {
        next_server_v4: '<<inherit>>',
        next_server_v6: '<<inherit>>',
      },
      uid: '5a1d7b47cd424c5aa4b5b63853df4fc7',
      virt: {
        auto_boot: '<<inherit>>',
        cpus: '<<inherit>>',
        disk_driver: '<<inherit>>',
        file_size: '<<inherit>>',
        path: '<<inherit>>',
        pxe_boot: false,
        ram: '<<inherit>>',
        type: '<<inherit>>',
        uefi: false,
      },
    };
    service
      .get_system('5a1d7b47cd424c5aa4b5b63853df4fc7', false, false, '')
      .subscribe((value) => {
        expect(value).toEqual(result);
        // Explicitly assert the runtime shape: nested structs are plain objects, not Map instances.
        expect(value.kernel_options instanceof Map).toBeFalsy();
        expect(value.power instanceof Map).toBeFalsy();
        expect((value.kernel_options as KernelOptionsDict)['rd.debug']).toBe(
          '~',
        );
        expect(value.power.address).toBe('192.0.2.10');
        expect(value.dns.name_servers).toEqual(['198.51.100.1']);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_repo action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480440.9711354</double></value></member><member><name>mtime</name><value><double>1721480440.9711354</double></value></member><member><name>uid</name><value><string>8b58f9b09a3e4d28965160d97a5de482</string></value></member><member><name>name</name><value><string>testrepo</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>fetchable_files</name><value><struct></struct></value></member><member><name>boot_files</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>breed</name><value><string>none</string></value></member><member><name>arch</name><value><string>none</string></value></member><member><name>environment</name><value><struct></struct></value></member><member><name>yumopts</name><value><struct></struct></value></member><member><name>rsyncopts</name><value><struct></struct></value></member><member><name>mirror_type</name><value><string>baseurl</string></value></member><member><name>apt_components</name><value><array><data></data></array></value></member><member><name>apt_dists</name><value><array><data></data></array></value></member><member><name>createrepo_flags</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>keep_updated</name><value><boolean>0</boolean></value></member><member><name>mirror</name><value><string></string></value></member><member><name>mirror_locally</name><value><boolean>0</boolean></value></member><member><name>priority</name><value><int>0</int></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>rpm_list</name><value><array><data></data></array></value></member><member><name>os_version</name><value><string></string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></param></params></methodResponse>`;
    const result = {
      ctime: 1721480440.9711354,
      mtime: 1721480440.9711354,
      name: 'testrepo',
      depth: 0,
      comment: '',
      owners: '<<inherit>>',
      uid: '8b58f9b09a3e4d28965160d97a5de482',
      fetchable_files: {},
      is_subobject: false,
      parent: '',
      kernel_options: {},
      kernel_options_post: {},
      arch: 'none',
      breed: 'none',
      apt_components: [],
      apt_dists: [],
      mirror: '',
      rsyncopts: {},
      proxy: '<<inherit>>',
      createrepo_flags: '<<inherit>>',
      environment: {},
      keep_updated: false,
      mirror_locally: false,
      mirror_type: 'baseurl',
      priority: 0,
      rpm_list: [],
      yumopts: {},
      autoinstall_meta: {},
      boot_files: {},
      os_version: '',
      template_files: {},
    };
    service
      .get_repo('8b58f9b09a3e4d28965160d97a5de482', false, false, '')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_image action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480441.493743</double></value></member><member><name>mtime</name><value><double>1721480441.493743</double></value></member><member><name>uid</name><value><string>911577c3691b4294acdf017e7f15f4cf</string></value></member><member><name>name</name><value><string>testimage</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>fetchable_files</name><value><struct></struct></value></member><member><name>boot_files</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>arch</name><value><string>x86_64</string></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>breed</name><value><string></string></value></member><member><name>file</name><value><string></string></value></member><member><name>image_type</name><value><string>direct</string></value></member><member><name>network_count</name><value><int>0</int></value></member><member><name>os_version</name><value><string></string></value></member><member><name>boot_loaders</name><value><array><data></data></array></value></member><member><name>menu</name><value><string></string></value></member><member><name>virt_auto_boot</name><value><boolean>0</boolean></value></member><member><name>virt_bridge</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_cpus</name><value><int>1</int></value></member><member><name>virt_disk_driver</name><value><string>raw</string></value></member><member><name>virt_file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_path</name><value><string></string></value></member><member><name>virt_ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_type</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>kickstart</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></param></params></methodResponse>`;
    const result = {
      ctime: 1721480441.493743,
      mtime: 1721480441.493743,
      name: 'testimage',
      depth: 0,
      comment: '',
      owners: '<<inherit>>',
      uid: '911577c3691b4294acdf017e7f15f4cf',
      arch: 'x86_64',
      breed: '',
      file: '',
      fetchable_files: {},
      is_subobject: false,
      parent: '',
      kernel_options: {},
      kernel_options_post: {},
      autoinstall: '<<inherit>>',
      image_type: 'direct',
      network_count: 0,
      os_version: '',
      virt_auto_boot: false,
      virt_bridge: '<<inherit>>',
      virt_cpus: 1,
      virt_disk_driver: 'raw',
      virt_file_size: '<<inherit>>',
      virt_path: '',
      virt_ram: '<<inherit>>',
      virt_type: '<<inherit>>',
      menu: '',
      autoinstall_meta: {},
      boot_files: {},
      boot_loaders: [],
      template_files: {},
    };
    service
      .get_image('911577c3691b4294acdf017e7f15f4cf', false, false, '')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_menu action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>ctime</name><value><double>1716132890.5260634</double></value></member><member><name>mtime</name><value><double>1716132890.5260634</double></value></member><member><name>uid</name><value><string>ecfb2f9cb717495988bee1d9d1c79504</string></value></member><member><name>name</name><value><string>testmenu</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><string></string></value></member><member><name>kernel_options_post</name><value><string></string></value></member><member><name>autoinstall_meta</name><value><string></string></value></member><member><name>fetchable_files</name><value><string></string></value></member><member><name>boot_files</name><value><string></string></value></member><member><name>template_files</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>display_name</name><value><string></string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></param></params></methodResponse>`;
    const result = {
      ctime: 1716132890.5260634,
      mtime: 1716132890.5260634,
      name: 'testmenu',
      depth: 0,
      comment: '',
      owners: '<<inherit>>',
      uid: 'ecfb2f9cb717495988bee1d9d1c79504',
      fetchable_files: '',
      is_subobject: false,
      kernel_options: '',
      kernel_options_post: '',
      template_files: '',
      autoinstall_meta: '',
      boot_files: '',
      parent: '',
      display_name: '',
      children: [],
    };
    service
      .get_menu('ecfb2f9cb717495988bee1d9d1c79504', false, false, '')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the get_items action on the Cobbler Server', () => {
    service.get_items('');
    expect(service).toBeFalsy();
  });

  it('should execute the get_item_names action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>testdistro</string></value></data></array></value></param></params></methodResponse>`;
    const result = ['testdistro'];
    service.get_item_names('distro').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_distros action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480439.039089</double></value></member><member><name>mtime</name><value><double>1721480439.039089</double></value></member><member><name>uid</name><value><string>12f034d6781946d1af0783e20684cbd4</string></value></member><member><name>name</name><value><string>test</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>fetchable_files</name><value><struct></struct></value></member><member><name>boot_files</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>tree_build_time</name><value><double>0.0</double></value></member><member><name>arch</name><value><string>x86_64</string></value></member><member><name>boot_loaders</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>breed</name><value><string></string></value></member><member><name>initrd</name><value><string>/root/initrd</string></value></member><member><name>kernel</name><value><string>/root/kernel</string></value></member><member><name>os_version</name><value><string></string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>source_repos</name><value><array><data></data></array></value></member><member><name>remote_boot_kernel</name><value><string></string></value></member><member><name>remote_grub_kernel</name><value><string></string></value></member><member><name>remote_boot_initrd</name><value><string></string></value></member><member><name>remote_grub_initrd</name><value><string></string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1721480439.039089,
        depth: 0,
        mtime: 1721480439.039089,
        uid: '12f034d6781946d1af0783e20684cbd4',
        source_repos: [],
        tree_build_time: 0,
        arch: 'x86_64',
        autoinstall_meta: {},
        boot_files: {},
        boot_loaders: '<<inherit>>',
        is_subobject: false,
        parent: '',
        breed: '',
        comment: '',
        fetchable_files: {},
        initrd: '/root/initrd',
        kernel: '/root/kernel',
        remote_boot_initrd: '',
        remote_boot_kernel: '',
        remote_grub_initrd: '',
        remote_grub_kernel: '',
        kernel_options: {},
        kernel_options_post: {},
        name: 'test',
        os_version: '',
        owners: '<<inherit>>',
        redhat_management_key: '<<inherit>>',
        template_files: {},
      },
    ];
    service.get_distros().subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_profiles action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>1</int></value></member><member><name>ctime</name><value><double>1721480439.3090012</double></value></member><member><name>mtime</name><value><double>1721480439.3090012</double></value></member><member><name>uid</name><value><string>5f01667614244fcd9c7ca7fa59c7def1</string></value></member><member><name>name</name><value><string>testprof</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>kernel_options_post</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>autoinstall_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>fetchable_files</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_files</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_loaders</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>dhcp_tag</name><value><string></string></value></member><member><name>distro</name><value><string>test</string></value></member><member><name>enable_ipxe</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>enable_menu</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>name_servers</name><value><array><data></data></array></value></member><member><name>name_servers_search</name><value><array><data></data></array></value></member><member><name>next_server_v4</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>next_server_v6</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>filename</name><value><string></string></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>repos</name><value><array><data></data></array></value></member><member><name>server</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>menu</name><value><string></string></value></member><member><name>virt_auto_boot</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_bridge</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_cpus</name><value><int>1</int></value></member><member><name>virt_disk_driver</name><value><string>raw</string></value></member><member><name>virt_file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_path</name><value><string></string></value></member><member><name>virt_ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_type</name><value><string>xenpv</string></value></member><member><name>kickstart</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ks_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        name: 'testprof',
        depth: 1,
        mtime: 1721480439.3090012,
        is_subobject: false,
        boot_loaders: '<<inherit>>',
        autoinstall_meta: '<<inherit>>',
        server: '<<inherit>>',
        distro: 'test',
        comment: '',
        next_server_v4: '<<inherit>>',
        next_server_v6: '<<inherit>>',
        enable_ipxe: '<<inherit>>',
        parent: '',
        owners: '<<inherit>>',
        autoinstall: '<<inherit>>',
        uid: '5f01667614244fcd9c7ca7fa59c7def1',
        virt_ram: '<<inherit>>',
        boot_files: '<<inherit>>',
        name_servers: [],
        enable_menu: '<<inherit>>',
        menu: '',
        ctime: 1721480439.3090012,
        fetchable_files: '<<inherit>>',
        kernel_options: '<<inherit>>',
        virt_auto_boot: '<<inherit>>',
        kernel_options_post: '<<inherit>>',
        proxy: '<<inherit>>',
        filename: '',
        dhcp_tag: '',
        redhat_management_key: '<<inherit>>',
        repos: [],
        template_files: {},
        virt_type: 'xenpv',
        virt_cpus: 1,
        virt_bridge: '<<inherit>>',
        name_servers_search: [],
        virt_path: '',
        virt_file_size: '<<inherit>>',
        virt_disk_driver: 'raw',
      },
    ];
    service.get_profiles().subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_systems action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>2</int></value></member><member><name>ctime</name><value><double>1721480439.5932038</double></value></member><member><name>mtime</name><value><double>1721480439.5932038</double></value></member><member><name>uid</name><value><string>a3320bc9105c44f1b92ab1743d460ed8</string></value></member><member><name>name</name><value><string>testsys</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>kernel_options_post</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>autoinstall_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>fetchable_files</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_files</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>interfaces</name><value><struct><member><name>default</name><value><struct><member><name>bonding_opts</name><value><string></string></value></member><member><name>bridge_opts</name><value><string></string></value></member><member><name>cnames</name><value><array><data></data></array></value></member><member><name>connected_mode</name><value><boolean>0</boolean></value></member><member><name>dhcp_tag</name><value><string></string></value></member><member><name>dns_name</name><value><string></string></value></member><member><name>if_gateway</name><value><string></string></value></member><member><name>interface_master</name><value><string></string></value></member><member><name>interface_type</name><value><string>na</string></value></member><member><name>ip_address</name><value><string></string></value></member><member><name>ipv6_address</name><value><string></string></value></member><member><name>ipv6_default_gateway</name><value><string></string></value></member><member><name>ipv6_mtu</name><value><string></string></value></member><member><name>ipv6_prefix</name><value><string></string></value></member><member><name>ipv6_secondaries</name><value><array><data></data></array></value></member><member><name>ipv6_static_routes</name><value><array><data></data></array></value></member><member><name>mac_address</name><value><string></string></value></member><member><name>management</name><value><boolean>0</boolean></value></member><member><name>mtu</name><value><string></string></value></member><member><name>netmask</name><value><string></string></value></member><member><name>static</name><value><boolean>0</boolean></value></member><member><name>static_routes</name><value><array><data></data></array></value></member><member><name>virt_bridge</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></member></struct></value></member><member><name>ipv6_autoconfiguration</name><value><boolean>0</boolean></value></member><member><name>repos_enabled</name><value><boolean>0</boolean></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_loaders</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>enable_ipxe</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>gateway</name><value><string></string></value></member><member><name>hostname</name><value><string></string></value></member><member><name>image</name><value><string></string></value></member><member><name>ipv6_default_device</name><value><string></string></value></member><member><name>name_servers</name><value><array><data></data></array></value></member><member><name>name_servers_search</name><value><array><data></data></array></value></member><member><name>netboot_enabled</name><value><boolean>0</boolean></value></member><member><name>next_server_v4</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>next_server_v6</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>filename</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>power_address</name><value><string></string></value></member><member><name>power_id</name><value><string></string></value></member><member><name>power_pass</name><value><string></string></value></member><member><name>power_type</name><value><string></string></value></member><member><name>power_user</name><value><string></string></value></member><member><name>power_options</name><value><string></string></value></member><member><name>power_identity_file</name><value><string></string></value></member><member><name>profile</name><value><string>testprof</string></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>server</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>status</name><value><string></string></value></member><member><name>virt_auto_boot</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_cpus</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_disk_driver</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_path</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_pxe_boot</name><value><boolean>0</boolean></value></member><member><name>virt_ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_type</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>serial_device</name><value><int>-1</int></value></member><member><name>serial_baud_rate</name><value><int>-1</int></value></member><member><name>kickstart</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ks_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1721480439.5932038,
        mtime: 1721480439.5932038,
        name: 'testsys',
        depth: 2,
        comment: '',
        owners: '<<inherit>>',
        uid: 'a3320bc9105c44f1b92ab1743d460ed8',
        autoinstall: '<<inherit>>',
        boot_files: '<<inherit>>',
        boot_loaders: '<<inherit>>',
        parent: '',
        is_subobject: false,
        autoinstall_meta: '<<inherit>>',
        enable_ipxe: '<<inherit>>',
        fetchable_files: '<<inherit>>',
        filename: '<<inherit>>',
        gateway: '',
        hostname: '',
        image: '',
        ipv6_autoconfiguration: false,
        ipv6_default_device: '',
        kernel_options: '<<inherit>>',
        kernel_options_post: '<<inherit>>',
        name_servers: [],
        name_servers_search: [],
        netboot_enabled: false,
        next_server_v4: '<<inherit>>',
        next_server_v6: '<<inherit>>',
        power_address: '',
        power_id: '',
        power_identity_file: '',
        power_options: '',
        power_pass: '',
        power_type: '',
        power_user: '',
        profile: 'testprof',
        proxy: '<<inherit>>',
        redhat_management_key: '<<inherit>>',
        repos_enabled: false,
        server: '<<inherit>>',
        serial_baud_rate: -1,
        serial_device: -1,
        status: '',
        virt_auto_boot: '<<inherit>>',
        virt_disk_driver: '<<inherit>>',
        virt_path: '<<inherit>>',
        virt_ram: '<<inherit>>',
        virt_type: '<<inherit>>',
        virt_file_size: '<<inherit>>',
        virt_cpus: '<<inherit>>',
        virt_pxe_boot: false,
        template_files: {},
        interfaces: {
          default: {
            bonding_opts: '',
            bridge_opts: '',
            cnames: [],
            connected_mode: false,
            dhcp_tag: '',
            dns_name: '',
            if_gateway: '',
            interface_master: '',
            interface_type: 'na',
            ip_address: '',
            ipv6_address: '',
            ipv6_default_gateway: '',
            ipv6_mtu: '',
            ipv6_prefix: '',
            ipv6_secondaries: [],
            ipv6_static_routes: [],
            mac_address: '',
            management: false,
            mtu: '',
            netmask: '',
            static: false,
            static_routes: [],
            virt_bridge: '<<inherit>>',
          },
        },
      },
    ];
    service.get_systems().subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_repos action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480440.9711354</double></value></member><member><name>mtime</name><value><double>1721480440.9711354</double></value></member><member><name>uid</name><value><string>8b58f9b09a3e4d28965160d97a5de482</string></value></member><member><name>name</name><value><string>testrepo</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>fetchable_files</name><value><struct></struct></value></member><member><name>boot_files</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>breed</name><value><string>none</string></value></member><member><name>arch</name><value><string>none</string></value></member><member><name>environment</name><value><struct></struct></value></member><member><name>yumopts</name><value><struct></struct></value></member><member><name>rsyncopts</name><value><struct></struct></value></member><member><name>mirror_type</name><value><string>baseurl</string></value></member><member><name>apt_components</name><value><array><data></data></array></value></member><member><name>apt_dists</name><value><array><data></data></array></value></member><member><name>createrepo_flags</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>keep_updated</name><value><boolean>0</boolean></value></member><member><name>mirror</name><value><string></string></value></member><member><name>mirror_locally</name><value><boolean>0</boolean></value></member><member><name>priority</name><value><int>0</int></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>rpm_list</name><value><array><data></data></array></value></member><member><name>os_version</name><value><string></string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1721480440.9711354,
        mtime: 1721480440.9711354,
        name: 'testrepo',
        depth: 0,
        comment: '',
        owners: '<<inherit>>',
        uid: '8b58f9b09a3e4d28965160d97a5de482',
        fetchable_files: {},
        is_subobject: false,
        parent: '',
        kernel_options: {},
        kernel_options_post: {},
        arch: 'none',
        breed: 'none',
        apt_components: [],
        apt_dists: [],
        mirror: '',
        rsyncopts: {},
        proxy: '<<inherit>>',
        createrepo_flags: '<<inherit>>',
        environment: {},
        keep_updated: false,
        mirror_locally: false,
        mirror_type: 'baseurl',
        priority: 0,
        rpm_list: [],
        yumopts: {},
        autoinstall_meta: {},
        boot_files: {},
        os_version: '',
        template_files: {},
      },
    ];
    service.get_repos().subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_images action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480441.493743</double></value></member><member><name>mtime</name><value><double>1721480441.493743</double></value></member><member><name>uid</name><value><string>911577c3691b4294acdf017e7f15f4cf</string></value></member><member><name>name</name><value><string>testimage</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>fetchable_files</name><value><struct></struct></value></member><member><name>boot_files</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>arch</name><value><string>x86_64</string></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>breed</name><value><string></string></value></member><member><name>file</name><value><string></string></value></member><member><name>image_type</name><value><string>direct</string></value></member><member><name>network_count</name><value><int>0</int></value></member><member><name>os_version</name><value><string></string></value></member><member><name>boot_loaders</name><value><array><data></data></array></value></member><member><name>menu</name><value><string></string></value></member><member><name>virt_auto_boot</name><value><boolean>0</boolean></value></member><member><name>virt_bridge</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_cpus</name><value><int>1</int></value></member><member><name>virt_disk_driver</name><value><string>raw</string></value></member><member><name>virt_file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_path</name><value><string></string></value></member><member><name>virt_ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_type</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>kickstart</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1721480441.493743,
        mtime: 1721480441.493743,
        name: 'testimage',
        depth: 0,
        comment: '',
        owners: '<<inherit>>',
        uid: '911577c3691b4294acdf017e7f15f4cf',
        arch: 'x86_64',
        breed: '',
        file: '',
        fetchable_files: {},
        is_subobject: false,
        parent: '',
        kernel_options: {},
        kernel_options_post: {},
        autoinstall: '<<inherit>>',
        image_type: 'direct',
        network_count: 0,
        os_version: '',
        virt_auto_boot: false,
        virt_bridge: '<<inherit>>',
        virt_cpus: 1,
        virt_disk_driver: 'raw',
        virt_file_size: '<<inherit>>',
        virt_path: '',
        virt_ram: '<<inherit>>',
        virt_type: '<<inherit>>',
        menu: '',
        autoinstall_meta: {},
        boot_files: {},
        boot_loaders: [],
        template_files: {},
      },
    ];
    service.get_images().subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_menus action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>ctime</name><value><double>1716132890.5260634</double></value></member><member><name>mtime</name><value><double>1716132890.5260634</double></value></member><member><name>uid</name><value><string>ecfb2f9cb717495988bee1d9d1c79504</string></value></member><member><name>name</name><value><string>testmenu</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>fetchable_files</name><value><struct></struct></value></member><member><name>boot_files</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>display_name</name><value><string></string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1716132890.5260634,
        mtime: 1716132890.5260634,
        name: 'testmenu',
        depth: 0,
        comment: '',
        owners: '<<inherit>>',
        uid: 'ecfb2f9cb717495988bee1d9d1c79504',
        fetchable_files: {},
        is_subobject: false,
        kernel_options: {},
        kernel_options_post: {},
        template_files: {},
        autoinstall_meta: {},
        boot_files: {},
        parent: '',
        children: new Array<string>(),
        display_name: '',
      },
    ];
    service.get_menus().subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  // With expand=false the server only returns matching item names, not full objects; with expand=true it returns
  // full item structs (verified against a live Cobbler 4.0.0 dev instance).
  it('should execute the find_items action on the Cobbler Server with expand=false', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>test</string></value></data></array></value></param></params></methodResponse>`;
    service
      .find_items('distro', undefined, '', false, false, '')
      .subscribe((value) => {
        expect(value).toEqual(['test']);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_items action on the Cobbler Server with expand=true', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480439.039089</double></value></member><member><name>mtime</name><value><double>1721480439.039089</double></value></member><member><name>uid</name><value><string>12f034d6781946d1af0783e20684cbd4</string></value></member><member><name>name</name><value><string>test</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>fetchable_files</name><value><struct></struct></value></member><member><name>boot_files</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>tree_build_time</name><value><double>0.0</double></value></member><member><name>arch</name><value><string>x86_64</string></value></member><member><name>boot_loaders</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>breed</name><value><string></string></value></member><member><name>initrd</name><value><string>/root/initrd</string></value></member><member><name>kernel</name><value><string>/root/kernel</string></value></member><member><name>os_version</name><value><string></string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>source_repos</name><value><array><data></data></array></value></member><member><name>remote_boot_kernel</name><value><string></string></value></member><member><name>remote_grub_kernel</name><value><string></string></value></member><member><name>remote_boot_initrd</name><value><string></string></value></member><member><name>remote_grub_initrd</name><value><string></string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1721480439.039089,
        depth: 0,
        mtime: 1721480439.039089,
        uid: '12f034d6781946d1af0783e20684cbd4',
        source_repos: [],
        tree_build_time: 0,
        arch: 'x86_64',
        autoinstall_meta: {},
        boot_files: {},
        boot_loaders: Bootloader.INHERITED,
        is_subobject: false,
        parent: '',
        breed: '',
        comment: '',
        fetchable_files: {},
        initrd: '/root/initrd',
        kernel: '/root/kernel',
        remote_boot_initrd: '',
        remote_boot_kernel: '',
        remote_grub_initrd: '',
        remote_grub_kernel: '',
        kernel_options: {},
        kernel_options_post: {},
        name: 'test',
        os_version: '',
        owners: '<<inherit>>',
        redhat_management_key: Value.INHERITED,
        template_files: {},
      },
    ];
    service
      .find_items('distro', undefined, '', true, false, '')
      .subscribe((value) => {
        expect(value).toEqual(result);
        expect('ks_meta' in value[0]).toBeFalsy();
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_distro action on the Cobbler Server with expand=false', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>test</string></value></data></array></value></param></params></methodResponse>`;
    service.find_distro(undefined, false, false, '').subscribe((value) => {
      expect(value).toEqual(['test']);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_distro action on the Cobbler Server with expand=true', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480439.039089</double></value></member><member><name>mtime</name><value><double>1721480439.039089</double></value></member><member><name>uid</name><value><string>12f034d6781946d1af0783e20684cbd4</string></value></member><member><name>name</name><value><string>test</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>fetchable_files</name><value><struct></struct></value></member><member><name>boot_files</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>tree_build_time</name><value><double>0.0</double></value></member><member><name>arch</name><value><string>x86_64</string></value></member><member><name>boot_loaders</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>breed</name><value><string></string></value></member><member><name>initrd</name><value><string>/root/initrd</string></value></member><member><name>kernel</name><value><string>/root/kernel</string></value></member><member><name>os_version</name><value><string></string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>source_repos</name><value><array><data></data></array></value></member><member><name>remote_boot_kernel</name><value><string></string></value></member><member><name>remote_grub_kernel</name><value><string></string></value></member><member><name>remote_boot_initrd</name><value><string></string></value></member><member><name>remote_grub_initrd</name><value><string></string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1721480439.039089,
        depth: 0,
        mtime: 1721480439.039089,
        uid: '12f034d6781946d1af0783e20684cbd4',
        source_repos: [],
        tree_build_time: 0,
        arch: 'x86_64',
        autoinstall_meta: {},
        boot_files: {},
        boot_loaders: Bootloader.INHERITED,
        is_subobject: false,
        parent: '',
        breed: '',
        comment: '',
        fetchable_files: {},
        initrd: '/root/initrd',
        kernel: '/root/kernel',
        remote_boot_initrd: '',
        remote_boot_kernel: '',
        remote_grub_initrd: '',
        remote_grub_kernel: '',
        kernel_options: {},
        kernel_options_post: {},
        name: 'test',
        os_version: '',
        owners: '<<inherit>>',
        redhat_management_key: Value.INHERITED,
        template_files: {},
      },
    ];
    service.find_distro(undefined, true, false, '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  // Captured live from a Cobbler 4.0.0b1 dev instance: find_profile({name: "task5profile"}, ...) for a profile
  // with a non-empty kernel_options struct and several nested structs (dns, tftp, virt).
  it('should execute the find_profile action on the Cobbler Server with expand=false', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>task5profile</string></value></data></array></value></param></params></methodResponse>`;
    service
      .find_profile(
        { members: [{ name: 'name', value: 'task5profile' }] },
        false,
        false,
        '',
      )
      .subscribe((value) => {
        expect(value).toEqual(['task5profile']);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_profile action on the Cobbler Server with expand=true', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>ctime</name><value><double>1787515044.264215</double></value></member><member><name>mtime</name><value><double>1787515044.264215</double></value></member><member><name>uid</name><value><string>56e49548605b4cd69c018bcefc0d100c</string></value></member><member><name>name</name><value><string>task5profile</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>depth</name><value><int>1</int></value></member><member><name>parent</name><value><string></string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>kernel_options</name><value><struct><member><name>a</name><value><string>b</string></value></member><member><name>c</name><value><string>d</string></value></member></struct></value></member><member><name>kernel_options_post</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>autoinstall_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_loaders</name><value><array><data><value><string>&lt;&lt;inherit&gt;&gt;</string></value></data></array></value></member><member><name>dhcp_tag</name><value><string></string></value></member><member><name>distro</name><value><string>8d6b61d0ad2646f487fdb27221b37b0d</string></value></member><member><name>dns</name><value><struct><member><name>name_servers</name><value><array><data></data></array></value></member><member><name>name_servers_search</name><value><array><data></data></array></value></member></struct></value></member><member><name>enable_ipxe</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>enable_menu</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>tftp</name><value><struct><member><name>next_server_v4</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>next_server_v6</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></member><member><name>filename</name><value><string></string></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_org</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_user</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_password</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>repos</name><value><array><data></data></array></value></member><member><name>server</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>menu</name><value><string></string></value></member><member><name>display_name</name><value><string></string></value></member><member><name>virt</name><value><struct><member><name>auto_boot</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>cpus</name><value><int>1</int></value></member><member><name>disk_driver</name><value><string>raw</string></value></member><member><name>file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>path</name><value><string></string></value></member><member><name>pxe_boot</name><value><boolean>0</boolean></value></member><member><name>ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>type</name><value><string>kvm</string></value></member><member><name>uefi</name><value><boolean>0</boolean></value></member></struct></value></member><member><name>virt_bridge</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>kickstart</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ks_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1787515044.264215,
        mtime: 1787515044.264215,
        uid: '56e49548605b4cd69c018bcefc0d100c',
        name: 'task5profile',
        comment: '',
        owners: '<<inherit>>',
        depth: 1,
        parent: '',
        is_subobject: false,
        children: [],
        kernel_options: { a: 'b', c: 'd' },
        kernel_options_post: '<<inherit>>',
        autoinstall_meta: '<<inherit>>',
        template_files: {},
        autoinstall: '<<inherit>>',
        boot_loaders: ['<<inherit>>'],
        dhcp_tag: '',
        distro: '8d6b61d0ad2646f487fdb27221b37b0d',
        dns: { name_servers: [], name_servers_search: [] },
        enable_ipxe: '<<inherit>>',
        enable_menu: '<<inherit>>',
        tftp: { next_server_v4: '<<inherit>>', next_server_v6: '<<inherit>>' },
        filename: '',
        proxy: '<<inherit>>',
        redhat_management_key: '<<inherit>>',
        redhat_management_org: '<<inherit>>',
        redhat_management_user: '<<inherit>>',
        redhat_management_password: '<<inherit>>',
        repos: [],
        server: '<<inherit>>',
        menu: '',
        display_name: '',
        virt: {
          auto_boot: '<<inherit>>',
          cpus: 1,
          disk_driver: 'raw',
          file_size: '<<inherit>>',
          path: '',
          pxe_boot: false,
          ram: '<<inherit>>',
          type: 'kvm',
          uefi: false,
        },
        virt_bridge: '<<inherit>>',
      },
    ];
    service
      .find_profile(
        { members: [{ name: 'name', value: 'task5profile' }] },
        true,
        false,
        '',
      )
      .subscribe((value) => {
        expect(value).toEqual(result);
        expect('ks_meta' in value[0]).toBeFalsy();
        expect('kickstart' in value[0]).toBeFalsy();
        expect((value[0] as any).kernel_options instanceof Map).toBeFalsy();
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_system action on the Cobbler Server with expand=false', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>testsys</string></value></data></array></value></param></params></methodResponse>`;
    service.find_system(undefined, false, false, '').subscribe((value) => {
      expect(value).toEqual(['testsys']);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_system action on the Cobbler Server with expand=true', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>2</int></value></member><member><name>ctime</name><value><double>1721480439.5932038</double></value></member><member><name>mtime</name><value><double>1721480439.5932038</double></value></member><member><name>uid</name><value><string>a3320bc9105c44f1b92ab1743d460ed8</string></value></member><member><name>name</name><value><string>testsys</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>kernel_options_post</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>autoinstall_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>fetchable_files</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_files</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>interfaces</name><value><struct><member><name>default</name><value><struct><member><name>bonding_opts</name><value><string></string></value></member><member><name>bridge_opts</name><value><string></string></value></member><member><name>cnames</name><value><array><data></data></array></value></member><member><name>connected_mode</name><value><boolean>0</boolean></value></member><member><name>dhcp_tag</name><value><string></string></value></member><member><name>dns_name</name><value><string></string></value></member><member><name>if_gateway</name><value><string></string></value></member><member><name>interface_master</name><value><string></string></value></member><member><name>interface_type</name><value><string>na</string></value></member><member><name>ip_address</name><value><string></string></value></member><member><name>ipv6_address</name><value><string></string></value></member><member><name>ipv6_default_gateway</name><value><string></string></value></member><member><name>ipv6_mtu</name><value><string></string></value></member><member><name>ipv6_prefix</name><value><string></string></value></member><member><name>ipv6_secondaries</name><value><array><data></data></array></value></member><member><name>ipv6_static_routes</name><value><array><data></data></array></value></member><member><name>mac_address</name><value><string></string></value></member><member><name>management</name><value><boolean>0</boolean></value></member><member><name>mtu</name><value><string></string></value></member><member><name>netmask</name><value><string></string></value></member><member><name>static</name><value><boolean>0</boolean></value></member><member><name>static_routes</name><value><array><data></data></array></value></member><member><name>virt_bridge</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></member></struct></value></member><member><name>ipv6_autoconfiguration</name><value><boolean>0</boolean></value></member><member><name>repos_enabled</name><value><boolean>0</boolean></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_loaders</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>enable_ipxe</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>gateway</name><value><string></string></value></member><member><name>hostname</name><value><string></string></value></member><member><name>image</name><value><string></string></value></member><member><name>ipv6_default_device</name><value><string></string></value></member><member><name>name_servers</name><value><array><data></data></array></value></member><member><name>name_servers_search</name><value><array><data></data></array></value></member><member><name>netboot_enabled</name><value><boolean>0</boolean></value></member><member><name>next_server_v4</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>next_server_v6</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>filename</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>power_address</name><value><string></string></value></member><member><name>power_id</name><value><string></string></value></member><member><name>power_pass</name><value><string></string></value></member><member><name>power_type</name><value><string></string></value></member><member><name>power_user</name><value><string></string></value></member><member><name>power_options</name><value><string></string></value></member><member><name>power_identity_file</name><value><string></string></value></member><member><name>profile</name><value><string>testprof</string></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>server</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>status</name><value><string></string></value></member><member><name>virt_auto_boot</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_cpus</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_disk_driver</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_path</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_pxe_boot</name><value><boolean>0</boolean></value></member><member><name>virt_ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_type</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>serial_device</name><value><int>-1</int></value></member><member><name>serial_baud_rate</name><value><int>-1</int></value></member><member><name>kickstart</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ks_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    service.find_system(undefined, true, false, '').subscribe((value) => {
      expect(value.length).toEqual(1);
      expect(value[0].name).toEqual('testsys');
      expect('ks_meta' in value[0]).toBeFalsy();
      expect('kickstart' in value[0]).toBeFalsy();
      expect((value[0] as any).interfaces['default'].interface_type).toEqual(
        'na',
      );
      expect((value[0] as any).interfaces instanceof Map).toBeFalsy();
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_repo action on the Cobbler Server with expand=false', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>testrepo</string></value></data></array></value></param></params></methodResponse>`;
    service.find_repo(undefined, false, false, '').subscribe((value) => {
      expect(value).toEqual(['testrepo']);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_repo action on the Cobbler Server with expand=true', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480440.9711354</double></value></member><member><name>mtime</name><value><double>1721480440.9711354</double></value></member><member><name>uid</name><value><string>8b58f9b09a3e4d28965160d97a5de482</string></value></member><member><name>name</name><value><string>testrepo</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>fetchable_files</name><value><struct></struct></value></member><member><name>boot_files</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>breed</name><value><string>none</string></value></member><member><name>arch</name><value><string>none</string></value></member><member><name>environment</name><value><struct></struct></value></member><member><name>yumopts</name><value><struct></struct></value></member><member><name>rsyncopts</name><value><struct></struct></value></member><member><name>mirror_type</name><value><string>baseurl</string></value></member><member><name>apt_components</name><value><array><data></data></array></value></member><member><name>apt_dists</name><value><array><data></data></array></value></member><member><name>createrepo_flags</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>keep_updated</name><value><boolean>0</boolean></value></member><member><name>mirror</name><value><string></string></value></member><member><name>mirror_locally</name><value><boolean>0</boolean></value></member><member><name>priority</name><value><int>0</int></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>rpm_list</name><value><array><data></data></array></value></member><member><name>os_version</name><value><string></string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    service.find_repo(undefined, true, false, '').subscribe((value) => {
      expect(value.length).toEqual(1);
      expect(value[0].name).toEqual('testrepo');
      expect('ks_meta' in value[0]).toBeFalsy();
      expect(value[0].yumopts).toEqual({});
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_image action on the Cobbler Server with expand=false', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>testimage</string></value></data></array></value></param></params></methodResponse>`;
    service.find_image(undefined, false, false, '').subscribe((value) => {
      expect(value).toEqual(['testimage']);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_image action on the Cobbler Server with expand=true', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480441.493743</double></value></member><member><name>mtime</name><value><double>1721480441.493743</double></value></member><member><name>uid</name><value><string>911577c3691b4294acdf017e7f15f4cf</string></value></member><member><name>name</name><value><string>testimage</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>fetchable_files</name><value><struct></struct></value></member><member><name>boot_files</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>arch</name><value><string>x86_64</string></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>breed</name><value><string></string></value></member><member><name>file</name><value><string></string></value></member><member><name>image_type</name><value><string>direct</string></value></member><member><name>network_count</name><value><int>0</int></value></member><member><name>os_version</name><value><string></string></value></member><member><name>boot_loaders</name><value><array><data></data></array></value></member><member><name>menu</name><value><string></string></value></member><member><name>virt_auto_boot</name><value><boolean>0</boolean></value></member><member><name>virt_bridge</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_cpus</name><value><int>1</int></value></member><member><name>virt_disk_driver</name><value><string>raw</string></value></member><member><name>virt_file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_path</name><value><string></string></value></member><member><name>virt_ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_type</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>kickstart</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    service.find_image(undefined, true, false, '').subscribe((value) => {
      expect(value.length).toEqual(1);
      expect(value[0].name).toEqual('testimage');
      expect('ks_meta' in value[0]).toBeFalsy();
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_menu action on the Cobbler Server with expand=false', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>testmenu</string></value></data></array></value></param></params></methodResponse>`;
    service.find_menu(undefined, false, false, '').subscribe((value) => {
      expect(value).toEqual(['testmenu']);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_menu action on the Cobbler Server with expand=true', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>ctime</name><value><double>1716132890.5260634</double></value></member><member><name>mtime</name><value><double>1716132890.5260634</double></value></member><member><name>uid</name><value><string>ecfb2f9cb717495988bee1d9d1c79504</string></value></member><member><name>name</name><value><string>testmenu</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options</name><value><string></string></value></member><member><name>kernel_options_post</name><value><string></string></value></member><member><name>autoinstall_meta</name><value><string></string></value></member><member><name>fetchable_files</name><value><string></string></value></member><member><name>boot_files</name><value><string></string></value></member><member><name>template_files</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>display_name</name><value><string></string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    service.find_menu(undefined, true, false, '').subscribe((value) => {
      expect(value.length).toEqual(1);
      expect(value[0].name).toEqual('testmenu');
      expect('ks_meta' in value[0]).toBeFalsy();
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the set_item_resolved_value action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service
      .set_item_resolved_value(
        '12f034d6781946d1af0783e20684cbd4',
        ['comment'],
        'a comment',
        '',
      )
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_distro_group action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480439.039089</double></value></member><member><name>mtime</name><value><double>1721480439.039089</double></value></member><member><name>uid</name><value><string>7a76d90d5ad04eab9772a12df67c1f1a</string></value></member><member><name>name</name><value><string>testdistrogroup</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>members</name><value><array><data><value><string>test</string></value></data></array></value></member></struct></value></param></params></methodResponse>`;
    const result = {
      ctime: 1721480439.039089,
      mtime: 1721480439.039089,
      uid: '7a76d90d5ad04eab9772a12df67c1f1a',
      name: 'testdistrogroup',
      depth: 0,
      comment: '',
      owners: '<<inherit>>',
      parent: '',
      is_subobject: false,
      children: [],
      members: ['test'],
    };
    service
      .get_distro_group('7a76d90d5ad04eab9772a12df67c1f1a', false, false, '')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_distro_groups action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480439.039089</double></value></member><member><name>mtime</name><value><double>1721480439.039089</double></value></member><member><name>uid</name><value><string>7a76d90d5ad04eab9772a12df67c1f1a</string></value></member><member><name>name</name><value><string>testdistrogroup</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>members</name><value><array><data><value><string>test</string></value></data></array></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1721480439.039089,
        mtime: 1721480439.039089,
        uid: '7a76d90d5ad04eab9772a12df67c1f1a',
        name: 'testdistrogroup',
        depth: 0,
        comment: '',
        owners: '<<inherit>>',
        parent: '',
        is_subobject: false,
        children: [],
        members: ['test'],
      },
    ];
    service.get_distro_groups().subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_distro_group action on the Cobbler Server with expand=false', async () => {
    // With expand=false the server only returns the matching item names, not
    // full objects (verified against a live Cobbler 4.0.0 dev instance).
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>testdistrogroup</string></value></data></array></value></param></params></methodResponse>`;
    const result = ['testdistrogroup'];
    service
      .find_distro_group(
        { members: [{ name: 'name', value: 'testdistrogroup' }] },
        false,
        false,
        '',
      )
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_distro_group action on the Cobbler Server with expand=true', async () => {
    // With expand=true the server returns full item structs (verified against a live Cobbler 4.0.0 dev instance).
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480439.309001</double></value></member><member><name>mtime</name><value><double>1721480439.309001</double></value></member><member><name>uid</name><value><string>5f01667614244fcd9c7ca7fa59c7def2</string></value></member><member><name>name</name><value><string>testdistrogroup</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>members</name><value><array><data><value><string>testdistro</string></value></data></array></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1721480439.309001,
        mtime: 1721480439.309001,
        uid: '5f01667614244fcd9c7ca7fa59c7def2',
        name: 'testdistrogroup',
        depth: 0,
        comment: '',
        owners: '<<inherit>>',
        parent: '',
        is_subobject: false,
        children: [],
        members: ['testdistro'],
      },
    ];
    service
      .find_distro_group(
        { members: [{ name: 'name', value: 'testdistrogroup' }] },
        true,
        false,
        '',
      )
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_profile_group action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480439.309001</double></value></member><member><name>mtime</name><value><double>1721480439.309001</double></value></member><member><name>uid</name><value><string>5f01667614244fcd9c7ca7fa59c7def2</string></value></member><member><name>name</name><value><string>testprofilegroup</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>members</name><value><array><data><value><string>testprof</string></value></data></array></value></member></struct></value></param></params></methodResponse>`;
    const result = {
      ctime: 1721480439.309001,
      mtime: 1721480439.309001,
      uid: '5f01667614244fcd9c7ca7fa59c7def2',
      name: 'testprofilegroup',
      depth: 0,
      comment: '',
      owners: '<<inherit>>',
      parent: '',
      is_subobject: false,
      children: [],
      members: ['testprof'],
    };
    service
      .get_profile_group('5f01667614244fcd9c7ca7fa59c7def2', false, false, '')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_profile_groups action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480439.309001</double></value></member><member><name>mtime</name><value><double>1721480439.309001</double></value></member><member><name>uid</name><value><string>5f01667614244fcd9c7ca7fa59c7def2</string></value></member><member><name>name</name><value><string>testprofilegroup</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>members</name><value><array><data><value><string>testprof</string></value></data></array></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1721480439.309001,
        mtime: 1721480439.309001,
        uid: '5f01667614244fcd9c7ca7fa59c7def2',
        name: 'testprofilegroup',
        depth: 0,
        comment: '',
        owners: '<<inherit>>',
        parent: '',
        is_subobject: false,
        children: [],
        members: ['testprof'],
      },
    ];
    service.get_profile_groups().subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_profile_group action on the Cobbler Server with expand=false', async () => {
    // With expand=false the server only returns the matching item names, not
    // full objects (verified against a live Cobbler 4.0.0 dev instance).
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>testprofilegroup</string></value></data></array></value></param></params></methodResponse>`;
    const result = ['testprofilegroup'];
    service
      .find_profile_group(
        { members: [{ name: 'name', value: 'testprofilegroup' }] },
        false,
        false,
        '',
      )
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_profile_group action on the Cobbler Server with expand=true', async () => {
    // With expand=true the server returns full item structs (verified against a live Cobbler 4.0.0 dev instance).
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480439.309001</double></value></member><member><name>mtime</name><value><double>1721480439.309001</double></value></member><member><name>uid</name><value><string>5f01667614244fcd9c7ca7fa59c7def2</string></value></member><member><name>name</name><value><string>testprofilegroup</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>members</name><value><array><data><value><string>testprof</string></value></data></array></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1721480439.309001,
        mtime: 1721480439.309001,
        uid: '5f01667614244fcd9c7ca7fa59c7def2',
        name: 'testprofilegroup',
        depth: 0,
        comment: '',
        owners: '<<inherit>>',
        parent: '',
        is_subobject: false,
        children: [],
        members: ['testprof'],
      },
    ];
    service
      .find_profile_group(
        { members: [{ name: 'name', value: 'testprofilegroup' }] },
        true,
        false,
        '',
      )
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_system_group action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480439.593203</double></value></member><member><name>mtime</name><value><double>1721480439.593203</double></value></member><member><name>uid</name><value><string>a3320bc9105c44f1b92ab1743d460ed9</string></value></member><member><name>name</name><value><string>testsystemgroup</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>members</name><value><array><data><value><string>testsys</string></value></data></array></value></member></struct></value></param></params></methodResponse>`;
    const result = {
      ctime: 1721480439.593203,
      mtime: 1721480439.593203,
      uid: 'a3320bc9105c44f1b92ab1743d460ed9',
      name: 'testsystemgroup',
      depth: 0,
      comment: '',
      owners: '<<inherit>>',
      parent: '',
      is_subobject: false,
      children: [],
      members: ['testsys'],
    };
    service
      .get_system_group('a3320bc9105c44f1b92ab1743d460ed9', false, false, '')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_system_groups action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480439.593203</double></value></member><member><name>mtime</name><value><double>1721480439.593203</double></value></member><member><name>uid</name><value><string>a3320bc9105c44f1b92ab1743d460ed9</string></value></member><member><name>name</name><value><string>testsystemgroup</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>members</name><value><array><data><value><string>testsys</string></value></data></array></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1721480439.593203,
        mtime: 1721480439.593203,
        uid: 'a3320bc9105c44f1b92ab1743d460ed9',
        name: 'testsystemgroup',
        depth: 0,
        comment: '',
        owners: '<<inherit>>',
        parent: '',
        is_subobject: false,
        children: [],
        members: ['testsys'],
      },
    ];
    service.get_system_groups().subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_system_group action on the Cobbler Server with expand=false', async () => {
    // With expand=false the server only returns the matching item names, not
    // full objects (verified against a live Cobbler 4.0.0 dev instance).
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>testsystemgroup</string></value></data></array></value></param></params></methodResponse>`;
    const result = ['testsystemgroup'];
    service
      .find_system_group(
        { members: [{ name: 'name', value: 'testsystemgroup' }] },
        false,
        false,
        '',
      )
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_system_group action on the Cobbler Server with expand=true', async () => {
    // With expand=true the server returns full item structs (verified against a live Cobbler 4.0.0 dev instance).
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1721480439.593203</double></value></member><member><name>mtime</name><value><double>1721480439.593203</double></value></member><member><name>uid</name><value><string>a3320bc9105c44f1b92ab1743d460ed9</string></value></member><member><name>name</name><value><string>testsystemgroup</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>members</name><value><array><data><value><string>testsys</string></value></data></array></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1721480439.593203,
        mtime: 1721480439.593203,
        uid: 'a3320bc9105c44f1b92ab1743d460ed9',
        name: 'testsystemgroup',
        depth: 0,
        comment: '',
        owners: '<<inherit>>',
        parent: '',
        is_subobject: false,
        children: [],
        members: ['testsys'],
      },
    ];
    service
      .find_system_group(
        { members: [{ name: 'name', value: 'testsystemgroup' }] },
        true,
        false,
        '',
      )
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the find_items_paged action on the Cobbler Server', () => {
    service.find_items_paged('', undefined, '', 0, 0, '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the has_item action on the Cobbler Server', () => {
    service.has_item('', '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_item_handle action on the Cobbler Server', () => {
    service.get_item_handle('', '', '');
    expect(service).toBeFalsy();
  });

  it('should execute the get_distro_handle action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>distro::test</string></value></param></params></methodResponse>`;
    const result = 'distro::test';
    service.get_distro_handle('').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_profile_handle action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>profile::testprof</string></value></param></params></methodResponse>`;
    const result = 'profile::testprof';
    service.get_profile_handle('').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_system_handle action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>distro::testdistro</string></value></param></params></methodResponse>`;
    const result = 'distro::testdistro';
    service.get_system_handle('').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_repo_handle action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>repo::testrepo</string></value></param></params></methodResponse>`;
    const result = 'repo::testrepo';
    service.get_repo_handle('').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_image_handle action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>image::testimage</string></value></param></params></methodResponse>`;
    const result = 'image::testimage';
    service.get_image_handle('').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_menu_handle action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>menu::testmenu</string></value></param></params></methodResponse>`;
    const result = 'menu::testmenu';
    service.get_menu_handle('').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the remove_item action on the Cobbler Server', () => {
    service.remove_item('', '', '', true);
    expect(service).toBeFalsy();
  });

  it('should execute the remove_distro action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.remove_distro('', '', false).subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the remove_profile action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.remove_profile('', '', false).subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the remove_system action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.remove_system('', '', false).subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the remove_repo action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.remove_repo('', '', false).subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the remove_image action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.remove_image('', '', false).subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the remove_menu action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.remove_menu('', '', false).subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the copy_item action on the Cobbler Server', () => {
    service.copy_item('', '', '', '');
    expect(service).toBeFalsy();
  });

  it('should execute the copy_distro action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.copy_distro('', '', '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the copy_profile action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.copy_profile('', '', '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the copy_system action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.copy_system('', '', '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the copy_repo action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.copy_repo('', '', '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the copy_image action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.copy_image('', '', '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the copy_menu action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.copy_menu('', '', '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the rename_item action on the Cobbler Server', () => {
    service.rename_item('', '', '', '');
    expect(service).toBeFalsy();
  });

  it('should execute the rename_distro action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.rename_distro('', '', '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the rename_profile action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.rename_profile('', '', '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the rename_system action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.rename_system('', '', '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the rename_repo action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.rename_repo('', '', '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the rename_image action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.rename_image('', '', '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the rename_menu action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = true;
    service.rename_menu('', '', '').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the new_item action on the Cobbler Server', () => {
    service.new_item('', '', false);
    expect(service).toBeFalsy();
  });

  it.skip('should execute the new_distro action on the Cobbler Server', () => {
    service.new_distro('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the new_profile action on the Cobbler Server', () => {
    service.new_profile('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the new_subprofile action on the Cobbler Server', () => {
    service.new_subprofile('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the new_system action on the Cobbler Server', () => {
    service.new_system('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the new_repo action on the Cobbler Server', () => {
    service.new_repo('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the new_image action on the Cobbler Server', () => {
    service.new_image('');
    expect(service).toBeFalsy();
  });
  it.skip('should execute the new_menu action on the Cobbler Server', () => {
    service.new_menu('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the modify_item action on the Cobbler Server', () => {
    service.modify_item('', '', [''], '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the modify_distro action on the Cobbler Server', () => {
    service.modify_distro('', [''], '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the modify_profile action on the Cobbler Server', () => {
    service.modify_profile('', [''], '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the modify_system action on the Cobbler Server', () => {
    service.modify_system('', [''], '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the modify_image action on the Cobbler Server', () => {
    service.modify_image('', [''], '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the modify_repo action on the Cobbler Server', () => {
    service.modify_repo('', [''], '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the modify_menu action on the Cobbler Server', () => {
    service.modify_menu('', [''], '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the modify_setting action on the Cobbler Server', () => {
    service.modify_setting('', '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the auto_add_repos action on the Cobbler Server', () => {
    service.auto_add_repos('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the save_item action on the Cobbler Server', () => {
    service.save_item('', '', true, true, '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the save_distro action on the Cobbler Server', () => {
    service.save_distro('', true, true, '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the save_profile action on the Cobbler Server', () => {
    service.save_profile('', true, true, '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the save_system action on the Cobbler Server', () => {
    service.save_system('', true, true, '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the save_image action on the Cobbler Server', () => {
    service.save_image('', true, true, '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the save_repo action on the Cobbler Server', () => {
    service.save_repo('', true, true, '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the save_menu action on the Cobbler Server', () => {
    service.save_menu('', true, true, '', '');
    expect(service).toBeFalsy();
  });

  it('should execute the get_template action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>ctime</name><value><double>1716132890.5260634</double></value></member><member><name>mtime</name><value><double>1716132890.5260634</double></value></member><member><name>uid</name><value><string>ecfb2f9cb717495988bee1d9d1c79504</string></value></member><member><name>name</name><value><string>legacy.ks</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>in_memory</name><value><boolean>1</boolean></value></member><member><name>in_transaction</name><value><boolean>0</boolean></value></member><member><name>template_type</name><value><string>cheetah</string></value></member><member><name>built_in</name><value><boolean>0</boolean></value></member><member><name>tags</name><value><array><data></data></array></value></member><member><name>content</name><value><string>sample content</string></value></member><member><name>uri</name><value><struct><member><name>schema</name><value><string>file</string></value></member><member><name>authority</name><value><string></string></value></member><member><name>path</name><value><string>legacy.ks</string></value></member><member><name>query</name><value><string></string></value></member><member><name>fragment</name><value><string></string></value></member></struct></value></member></struct></value></param></params></methodResponse>`;
    const result = {
      ctime: 1716132890.5260634,
      mtime: 1716132890.5260634,
      uid: 'ecfb2f9cb717495988bee1d9d1c79504',
      name: 'legacy.ks',
      comment: '',
      owners: '<<inherit>>',
      in_memory: true,
      in_transaction: false,
      template_type: 'cheetah',
      built_in: false,
      tags: [],
      content: 'sample content',
      uri: {
        schema: 'file',
        authority: '',
        path: 'legacy.ks',
        query: '',
        fragment: '',
      },
    };
    service
      .get_template('ecfb2f9cb717495988bee1d9d1c79504', false, false, '')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_template_content action on the Cobbler Server', async () => {
    // Response shape (a plain string) and the general structure of a
    // Cheetah kickstart template verified against a live Cobbler 4.0.0
    // dev instance's "built-in-legacy.ks" template.
    // eslint-disable-next-line max-len
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>#platform=x86, AMD64, or Intel EM64T\n# System authorization information\nauth  --useshadow  --enablemd5\n# Use network installation\nurl --url=$tree\n$SNIPPET('built-in-network_config')\n</string></value></param></params></methodResponse>`;
    // eslint-disable-next-line max-len
    const result = `#platform=x86, AMD64, or Intel EM64T
# System authorization information
auth  --useshadow  --enablemd5
# Use network installation
url --url=$tree
$SNIPPET('built-in-network_config')
`;
    service
      .get_template_content('ecfb2f9cb717495988bee1d9d1c79504', '')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_templates action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>ctime</name><value><double>1716132890.5260634</double></value></member><member><name>mtime</name><value><double>1716132890.5260634</double></value></member><member><name>uid</name><value><string>ecfb2f9cb717495988bee1d9d1c79504</string></value></member><member><name>name</name><value><string>legacy.ks</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>in_memory</name><value><boolean>1</boolean></value></member><member><name>in_transaction</name><value><boolean>0</boolean></value></member><member><name>template_type</name><value><string>cheetah</string></value></member><member><name>built_in</name><value><boolean>0</boolean></value></member><member><name>tags</name><value><array><data></data></array></value></member><member><name>content</name><value><string>sample content</string></value></member><member><name>uri</name><value><struct><member><name>schema</name><value><string>file</string></value></member><member><name>authority</name><value><string></string></value></member><member><name>path</name><value><string>legacy.ks</string></value></member><member><name>query</name><value><string></string></value></member><member><name>fragment</name><value><string></string></value></member></struct></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1716132890.5260634,
        mtime: 1716132890.5260634,
        uid: 'ecfb2f9cb717495988bee1d9d1c79504',
        name: 'legacy.ks',
        comment: '',
        owners: '<<inherit>>',
        in_memory: true,
        in_transaction: false,
        template_type: 'cheetah',
        built_in: false,
        tags: [],
        content: 'sample content',
        uri: {
          schema: 'file',
          authority: '',
          path: 'legacy.ks',
          query: '',
          fragment: '',
        },
      },
    ];
    service.get_templates().subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_template action on the Cobbler Server with expand=false', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>legacy.ks</string></value></data></array></value></param></params></methodResponse>`;
    service.find_template(undefined, false, false, '').subscribe((value) => {
      expect(value).toEqual(['legacy.ks']);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_template action on the Cobbler Server with expand=true', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>ctime</name><value><double>1716132890.5260634</double></value></member><member><name>mtime</name><value><double>1716132890.5260634</double></value></member><member><name>uid</name><value><string>ecfb2f9cb717495988bee1d9d1c79504</string></value></member><member><name>name</name><value><string>legacy.ks</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>in_memory</name><value><boolean>1</boolean></value></member><member><name>in_transaction</name><value><boolean>0</boolean></value></member><member><name>template_type</name><value><string>cheetah</string></value></member><member><name>built_in</name><value><boolean>0</boolean></value></member><member><name>tags</name><value><array><data></data></array></value></member><member><name>content</name><value><string>sample content</string></value></member><member><name>uri</name><value><struct><member><name>schema</name><value><string>file</string></value></member><member><name>authority</name><value><string></string></value></member><member><name>path</name><value><string>legacy.ks</string></value></member><member><name>query</name><value><string></string></value></member><member><name>fragment</name><value><string></string></value></member></struct></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    const result = [
      {
        ctime: 1716132890.5260634,
        mtime: 1716132890.5260634,
        uid: 'ecfb2f9cb717495988bee1d9d1c79504',
        name: 'legacy.ks',
        comment: '',
        owners: '<<inherit>>',
        in_memory: true,
        in_transaction: false,
        template_type: 'cheetah',
        built_in: false,
        tags: [],
        content: 'sample content',
        uri: {
          schema: 'file',
          authority: '',
          path: 'legacy.ks',
          query: '',
          fragment: '',
        },
      },
    ];
    service.find_template(undefined, true, false, '').subscribe((value) => {
      expect(value).toEqual(result);
      expect(value[0].uri instanceof Map).toBeFalsy();
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  // No pre-existing test covered find_network_interface; captured live from a Cobbler 4.0.0b1 dev instance for a
  // network interface with populated nested dns/ipv4/ipv6 structs.
  it('should execute the find_network_interface action on the Cobbler Server with expand=false', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>eth0</string></value></data></array></value></param></params></methodResponse>`;
    service
      .find_network_interface(undefined, false, false, '')
      .subscribe((value) => {
        expect(value).toEqual(['eth0']);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the find_network_interface action on the Cobbler Server with expand=true', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>ctime</name><value><double>1787515096.9201949</double></value></member><member><name>mtime</name><value><double>1787515096.9201949</double></value></member><member><name>uid</name><value><string>c5ce98962116423b8e7b68a32dfcd553</string></value></member><member><name>name</name><value><string>eth0</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>bonding_opts</name><value><string></string></value></member><member><name>bridge_opts</name><value><string></string></value></member><member><name>connected_mode</name><value><boolean>0</boolean></value></member><member><name>dhcp_tag</name><value><string></string></value></member><member><name>dns</name><value><struct><member><name>name</name><value><string></string></value></member><member><name>common_names</name><value><array><data></data></array></value></member></struct></value></member><member><name>if_gateway</name><value><string></string></value></member><member><name>interface_master</name><value><string></string></value></member><member><name>interface_type</name><value><string>na</string></value></member><member><name>ipv4</name><value><struct><member><name>address</name><value><string></string></value></member><member><name>static_routes</name><value><array><data></data></array></value></member><member><name>mtu</name><value><string></string></value></member><member><name>netmask</name><value><string></string></value></member></struct></value></member><member><name>ipv6</name><value><struct><member><name>address</name><value><string></string></value></member><member><name>static_routes</name><value><array><data></data></array></value></member><member><name>mtu</name><value><string></string></value></member><member><name>default_gateway</name><value><string></string></value></member><member><name>prefix</name><value><string></string></value></member><member><name>secondaries</name><value><array><data></data></array></value></member></struct></value></member><member><name>ipv6_default_gateway</name><value><string></string></value></member><member><name>ipv6_static_routes</name><value><array><data></data></array></value></member><member><name>mac_address</name><value><string></string></value></member><member><name>management</name><value><boolean>0</boolean></value></member><member><name>static</name><value><boolean>0</boolean></value></member><member><name>virt_bridge</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>system_uid</name><value><string>8d0c1f3753214e59a2b3fdab7548435f</string></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    service
      .find_network_interface(undefined, true, false, '')
      .subscribe((value) => {
        expect(value.length).toEqual(1);
        expect(value[0].name).toEqual('eth0');
        expect((value[0] as any).dns instanceof Map).toBeFalsy();
        expect((value[0] as any).ipv4).toEqual({
          address: '',
          static_routes: [],
          mtu: '',
          netmask: '',
        });
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the get_template_handle action on the Cobbler Server', () => {
    service.get_template_handle('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the new_template action on the Cobbler Server', () => {
    service.new_template('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the modify_template action on the Cobbler Server', () => {
    service.modify_template('', [''], '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the save_template action on the Cobbler Server', () => {
    service.save_template('', true, true, 'bypass', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the remove_template action on the Cobbler Server', () => {
    service.remove_template('', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the copy_template action on the Cobbler Server', () => {
    service.copy_template('', '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the rename_template action on the Cobbler Server', () => {
    service.rename_template('', '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the is_autoinstall_in_use action on the Cobbler Server', () => {
    service.is_autoinstall_in_use('', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the generate_autoinstall action on the Cobbler Server', () => {
    service.generate_autoinstall('', 'profile', 'name', '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the generate_autoinstall action for a profile on the Cobbler Server', () => {
    service.generate_autoinstall('', 'profile', 'name', '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the generate_autoinstall action for a system on the Cobbler Server', () => {
    service.generate_autoinstall('', 'system', 'name', '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the generate_ipxe action on the Cobbler Server', () => {
    service.generate_ipxe('', '', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the generate_bootcfg action on the Cobbler Server', () => {
    service.generate_bootcfg('', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the generate_script action on the Cobbler Server', () => {
    service.generate_script('', '', '');
    expect(service).toBeFalsy();
  });

  // Trimmed from a live capture against a Cobbler 4.0.0b1 dev instance (get_blended_data("task5profile", "")):
  // the full response blends the entire settings struct into the profile's values and is several thousand lines
  // long, so only a representative slice - a top-level scalar, the blended kernel_options string and the nested
  // bootloaders_formats struct (copied verbatim from the live response) - is kept here.
  it('should execute the get_blended_data action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>obj_type</name><value><string>profile</string></value></member><member><name>kernel_options</name><value><string>a=b c=d </string></value></member><member><name>bootloaders_formats</name><value><struct><member><name>aarch64</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member></struct></value></member><member><name>arm64-efi</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>efinet</string></value></data></array></value></member></struct></value></member></struct></value></member></struct></value></param></params></methodResponse>`;
    service.get_blended_data('task5profile', '').subscribe((value) => {
      expect(value.obj_type).toEqual('profile');
      expect(value.kernel_options).toEqual('a=b c=d ');
      expect(value.bootloaders_formats).toEqual({
        aarch64: { binary_name: 'grubaa64.efi' },
        'arm64-efi': {
          binary_name: 'grubaa64.efi',
          extra_modules: ['efinet'],
        },
      });
      // The nested struct must be a plain object, not a Map, at every depth.
      expect(value.bootloaders_formats instanceof Map).toBeFalsy();
      expect(value.bootloaders_formats.aarch64 instanceof Map).toBeFalsy();
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_settings action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>auto_migrate_settings</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_hostnames</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_ips</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_macs</name><value><boolean>0</boolean></value></member><member><name>allow_dynamic_settings</name><value><boolean>0</boolean></value></member><member><name>always_write_dhcp_entries</name><value><boolean>0</boolean></value></member><member><name>anamon_enabled</name><value><boolean>0</boolean></value></member><member><name>auth_token_expiration</name><value><int>3600</int></value></member><member><name>authn_pam_service</name><value><string>login</string></value></member><member><name>autoinstall_snippets_dir</name><value><string>/var/lib/cobbler/snippets</string></value></member><member><name>autoinstall_templates_dir</name><value><string>/var/lib/cobbler/templates</string></value></member><member><name>bind_chroot_path</name><value><string></string></value></member><member><name>bind_zonefile_path</name><value><string>/var/lib/named</string></value></member><member><name>bind_master</name><value><string>127.0.0.1</string></value></member><member><name>boot_loader_conf_template_dir</name><value><string>/etc/cobbler/boot_loader_conf</string></value></member><member><name>bootloaders_dir</name><value><string>/var/lib/cobbler/loaders</string></value></member><member><name>bootloaders_shim_folder</name><value><string>/usr/share/efi/*/</string></value></member><member><name>bootloaders_shim_file</name><value><string>shim\\.efi$</string></value></member><member><name>bootloaders_ipxe_folder</name><value><string>/usr/share/ipxe/</string></value></member><member><name>bootloaders_formats</name><value><struct><member><name>aarch64</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member></struct></value></member><member><name>arm</name><value><struct><member><name>binary_name</name><value><string>bootarm.efi</string></value></member></struct></value></member><member><name>arm64-efi</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>efinet</string></value></data></array></value></member></struct></value></member><member><name>i386-efi</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>i386-pc-pxe</name><value><struct><member><name>binary_name</name><value><string>grub.0</string></value></member><member><name>mod_dir</name><value><string>i386-pc</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>pxe</string></value><value><string>biosdisk</string></value></data></array></value></member></struct></value></member><member><name>i686</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>IA64</name><value><struct><member><name>binary_name</name><value><string>bootia64.efi</string></value></member></struct></value></member><member><name>powerpc-ieee1275</name><value><struct><member><name>binary_name</name><value><string>grub.ppc64le</string></value></member><member><name>extra_modules</name><value><array><data><value><string>net</string></value><value><string>ofnet</string></value></data></array></value></member></struct></value></member><member><name>x86_64-efi</name><value><struct><member><name>binary_name</name><value><string>grubx86.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>efinet</string></value></data></array></value></member></struct></value></member></struct></value></member><member><name>bootloaders_modules</name><value><array><data><value><string>btrfs</string></value><value><string>ext2</string></value><value><string>xfs</string></value><value><string>jfs</string></value><value><string>reiserfs</string></value><value><string>all_video</string></value><value><string>boot</string></value><value><string>cat</string></value><value><string>configfile</string></value><value><string>echo</string></value><value><string>fat</string></value><value><string>font</string></value><value><string>gfxmenu</string></value><value><string>gfxterm</string></value><value><string>gzio</string></value><value><string>halt</string></value><value><string>iso9660</string></value><value><string>jpeg</string></value><value><string>linux</string></value><value><string>loadenv</string></value><value><string>minicmd</string></value><value><string>normal</string></value><value><string>part_apple</string></value><value><string>part_gpt</string></value><value><string>part_msdos</string></value><value><string>password_pbkdf2</string></value><value><string>png</string></value><value><string>reboot</string></value><value><string>search</string></value><value><string>search_fs_file</string></value><value><string>search_fs_uuid</string></value><value><string>search_label</string></value><value><string>sleep</string></value><value><string>test</string></value><value><string>true</string></value><value><string>video</string></value><value><string>mdraid09</string></value><value><string>mdraid1x</string></value><value><string>lvm</string></value><value><string>serial</string></value><value><string>regexp</string></value><value><string>tr</string></value><value><string>tftp</string></value><value><string>http</string></value><value><string>luks</string></value><value><string>gcry_rijndael</string></value><value><string>gcry_sha1</string></value><value><string>gcry_sha256</string></value></data></array></value></member><member><name>grubconfig_dir</name><value><string>/var/lib/cobbler/grub_config</string></value></member><member><name>build_reporting_enabled</name><value><boolean>0</boolean></value></member><member><name>build_reporting_email</name><value><array><data></data></array></value></member><member><name>build_reporting_ignorelist</name><value><array><data></data></array></value></member><member><name>build_reporting_sender</name><value><string></string></value></member><member><name>build_reporting_smtp_server</name><value><string>localhost</string></value></member><member><name>build_reporting_subject</name><value><string></string></value></member><member><name>buildisodir</name><value><string>/var/cache/cobbler/buildiso</string></value></member><member><name>cheetah_import_whitelist</name><value><array><data><value><string>re</string></value><value><string>random</string></value><value><string>time</string></value></data></array></value></member><member><name>client_use_https</name><value><boolean>0</boolean></value></member><member><name>client_use_localhost</name><value><boolean>0</boolean></value></member><member><name>cobbler_master</name><value><string></string></value></member><member><name>convert_server_to_ip</name><value><boolean>0</boolean></value></member><member><name>createrepo_flags</name><value><string>-ccache-ssha</string></value></member><member><name>autoinstall</name><value><string>default.ks</string></value></member><member><name>default_name_servers</name><value><array><data></data></array></value></member><member><name>default_name_servers_search</name><value><array><data></data></array></value></member><member><name>default_ownership</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>default_password_crypted</name><value><string>\\$1\\$mF86/UHC\\$WvcIcX2t6crBz2onWxyac.</string></value></member><member><name>default_template_type</name><value><string>cheetah</string></value></member><member><name>default_virt_bridge</name><value><string>xenbr0</string></value></member><member><name>default_virt_disk_driver</name><value><string>raw</string></value></member><member><name>default_virt_file_size</name><value><double>5.0</double></value></member><member><name>default_virt_ram</name><value><int>512</int></value></member><member><name>default_virt_type</name><value><string>xenpv</string></value></member><member><name>enable_ipxe</name><value><boolean>0</boolean></value></member><member><name>enable_menu</name><value><boolean>1</boolean></value></member><member><name>grub2_mod_dir</name><value><string>/usr/share/grub2/</string></value></member><member><name>http_port</name><value><int>80</int></value></member><member><name>iso_template_dir</name><value><string>/etc/cobbler/iso</string></value></member><member><name>jinja2_includedir</name><value><string>/var/lib/cobbler/jinja2</string></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>ldap_anonymous_bind</name><value><boolean>1</boolean></value></member><member><name>ldap_base_dn</name><value><string>DC=devel,DC=redhat,DC=com</string></value></member><member><name>ldap_port</name><value><int>389</int></value></member><member><name>ldap_search_bind_dn</name><value><string></string></value></member><member><name>ldap_search_passwd</name><value><string></string></value></member><member><name>ldap_search_prefix</name><value><string>uid=</string></value></member><member><name>ldap_server</name><value><string>grimlock.devel.redhat.com</string></value></member><member><name>ldap_tls</name><value><boolean>1</boolean></value></member><member><name>ldap_tls_cacertdir</name><value><string></string></value></member><member><name>ldap_tls_cacertfile</name><value><string></string></value></member><member><name>ldap_tls_certfile</name><value><string></string></value></member><member><name>ldap_tls_keyfile</name><value><string></string></value></member><member><name>ldap_tls_reqcert</name><value><string>hard</string></value></member><member><name>ldap_tls_cipher_suite</name><value><string></string></value></member><member><name>bind_manage_ipmi</name><value><boolean>0</boolean></value></member><member><name>manage_dhcp</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp_v6</name><value><boolean>0</boolean></value></member><member><name>manage_dhcp_v4</name><value><boolean>1</boolean></value></member><member><name>manage_dns</name><value><boolean>0</boolean></value></member><member><name>manage_forward_zones</name><value><array><data></data></array></value></member><member><name>manage_reverse_zones</name><value><array><data></data></array></value></member><member><name>manage_genders</name><value><boolean>0</boolean></value></member><member><name>manage_rsync</name><value><boolean>0</boolean></value></member><member><name>manage_tftpd</name><value><boolean>1</boolean></value></member><member><name>next_server_v4</name><value><string>192.168.1.1</string></value></member><member><name>next_server_v6</name><value><string>::1</string></value></member><member><name>nsupdate_enabled</name><value><boolean>0</boolean></value></member><member><name>nsupdate_log</name><value><string>/var/log/cobbler/nsupdate.log</string></value></member><member><name>nsupdate_tsig_algorithm</name><value><string>hmac-sha512</string></value></member><member><name>nsupdate_tsig_key</name><value><array><data></data></array></value></member><member><name>power_management_default_type</name><value><string>ipmilan</string></value></member><member><name>proxies</name><value><array><data></data></array></value></member><member><name>proxy_url_ext</name><value><string></string></value></member><member><name>proxy_url_int</name><value><string></string></value></member><member><name>puppet_auto_setup</name><value><boolean>0</boolean></value></member><member><name>puppet_parameterized_classes</name><value><boolean>1</boolean></value></member><member><name>puppet_server</name><value><string>puppet</string></value></member><member><name>puppet_version</name><value><int>2</int></value></member><member><name>puppetca_path</name><value><string>/usr/bin/puppet</string></value></member><member><name>pxe_just_once</name><value><boolean>1</boolean></value></member><member><name>nopxe_with_triggers</name><value><boolean>1</boolean></value></member><member><name>redhat_management_permissive</name><value><boolean>0</boolean></value></member><member><name>redhat_management_server</name><value><string>xmlrpc.rhn.redhat.com</string></value></member><member><name>redhat_management_key</name><value><string></string></value></member><member><name>register_new_installs</name><value><boolean>0</boolean></value></member><member><name>remove_old_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>replicate_repo_rsync_options</name><value><string>-avzH</string></value></member><member><name>replicate_rsync_options</name><value><string>-avzH</string></value></member><member><name>reposync_flags</name><value><string>-l-m-d</string></value></member><member><name>reposync_rsync_flags</name><value><string></string></value></member><member><name>restart_dhcp</name><value><boolean>1</boolean></value></member><member><name>restart_dns</name><value><boolean>1</boolean></value></member><member><name>run_install_triggers</name><value><boolean>1</boolean></value></member><member><name>scm_track_enabled</name><value><boolean>0</boolean></value></member><member><name>scm_track_mode</name><value><string>git</string></value></member><member><name>scm_track_author</name><value><string>cobbler&lt;cobbler@localhost&gt;</string></value></member><member><name>scm_push_script</name><value><string>/bin/true</string></value></member><member><name>serializer_pretty_json</name><value><boolean>0</boolean></value></member><member><name>server</name><value><string>192.168.1.1</string></value></member><member><name>sign_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>signature_path</name><value><string>/var/lib/cobbler/distro_signatures.json</string></value></member><member><name>signature_url</name><value><string>https://cobbler.github.io/signatures/3.0.x/latest.json</string></value></member><member><name>syslinux_dir</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_memdisk_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_pxelinux_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>tftpboot_location</name><value><string>/srv/tftpboot</string></value></member><member><name>virt_auto_boot</name><value><boolean>1</boolean></value></member><member><name>webdir</name><value><string>/var/www/cobbler</string></value></member><member><name>webdir_whitelist</name><value><array><data><value><string>.link_cache</string></value><value><string>misc</string></value><value><string>distro_mirror</string></value><value><string>images</string></value><value><string>links</string></value><value><string>localmirror</string></value><value><string>pub</string></value><value><string>rendered</string></value><value><string>repo_mirror</string></value><value><string>repo_profile</string></value><value><string>repo_system</string></value><value><string>svc</string></value><value><string>web</string></value><value><string>webui</string></value></data></array></value></member><member><name>xmlrpc_port</name><value><int>25151</int></value></member><member><name>yum_distro_priority</name><value><int>1</int></value></member><member><name>yum_post_install_mirror</name><value><boolean>1</boolean></value></member><member><name>yumdownloader_flags</name><value><string>--resolve</string></value></member><member><name>windows_enabled</name><value><boolean>0</boolean></value></member><member><name>windows_template_dir</name><value><string>/etc/cobbler/windows</string></value></member><member><name>samba_distro_share</name><value><string>DISTRO</string></value></member></struct></value></param></params></methodResponse>`;
    const result = 129;
    service.get_settings('').subscribe((data) => {
      // Let's not compare the content as this is taken care of by the deserializer tests
      expect(Object.keys(data).length).toEqual(result);
      // bootloaders_formats is a nested XML-RPC struct (itself containing further nested structs, e.g.
      // "arm64-efi") and must be recursively converted into plain objects, not left as a Map at any depth.
      expect(data.bootloaders_formats).toBeDefined();
      expect(data.bootloaders_formats instanceof Map).toBeFalsy();
      const bootloadersFormats = data.bootloaders_formats as Record<
        string,
        any
      >;
      expect(bootloadersFormats['aarch64'] instanceof Map).toBeFalsy();
      expect(bootloadersFormats['aarch64']).toEqual({
        binary_name: 'grubaa64.efi',
      });
      expect(bootloadersFormats['arm64-efi']).toEqual({
        binary_name: 'grubaa64.efi',
        extra_modules: ['efinet'],
      });
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_signatures action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>breeds</name><value><struct><member><name>redhat</name><value><struct><member><name>rhel4</name><value><struct><member><name>signatures</name><value><array><data><value><string>RedHat/RPMS</string></value><value><string>CentOS/RPMS</string></value></data></array></value></member><member><name>version_file</name><value><string>(redhat|sl|centos)-release-4(AS|WS|ES)[\\.-]+(.*)\\.rpm</string></value></member><member><name>version_file_regex</name><value><string>~</string></value></member><member><name>kernel_arch</name><value><string>kernel-(.*).rpm</string></value></member><member><name>kernel_arch_regex</name><value><string>~</string></value></member><member><name>supported_arches</name><value><array><data><value><string>i386</string></value><value><string>ia64</string></value><value><string>ppc</string></value><value><string>s390</string></value><value><string>s390x</string></value><value><string>x86_64</string></value></data></array></value></member><member><name>supported_repo_breeds</name><value><array><data><value><string>rsync</string></value><value><string>rhn</string></value><value><string>yum</string></value></data></array></value></member><member><name>kernel_file</name><value><string>vmlinuz(.*)</string></value></member><member><name>initrd_file</name><value><string>initrd(.*)\\.img</string></value></member><member><name>isolinux_ok</name><value><boolean>0</boolean></value></member><member><name>default_autoinstall</name><value><string>sample_legacy.ks</string></value></member><member><name>kernel_options</name><value><string></string></value></member><member><name>kernel_options_post</name><value><string></string></value></member><member><name>boot_files</name><value><array><data></data></array></value></member></struct></value></member></struct></value></member></struct></value></member></struct></value></param></params></methodResponse>`;
    const result: DistroSignatures = {
      breeds: {
        redhat: {
          rhel4: {
            signatures: ['RedHat/RPMS', 'CentOS/RPMS'],
            version_file:
              '(redhat|sl|centos)-release-4(AS|WS|ES)[\\.-]+(.*)\\.rpm',
            version_file_regex: '~',
            kernel_arch: 'kernel-(.*).rpm',
            kernel_arch_regex: '~',
            supported_arches: [
              'i386',
              'ia64',
              'ppc',
              's390',
              's390x',
              'x86_64',
            ],
            supported_repo_breeds: ['rsync', 'rhn', 'yum'],
            kernel_file: 'vmlinuz(.*)',
            initrd_file: 'initrd(.*)\\.img',
            isolinux_ok: false,
            default_autoinstall: 'sample_legacy.ks',
            kernel_options: '',
            kernel_options_post: '',
            boot_files: [],
          },
        },
      },
    };
    service.get_signatures('').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the get_valid_breeds action on the Cobbler Server', () => {
    service.get_valid_breeds('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_valid_os_versions_for_breed action on the Cobbler Server', () => {
    service.get_valid_os_versions_for_breed('', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_valid_os_versions action on the Cobbler Server', () => {
    service.get_valid_os_versions('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_valid_archs action on the Cobbler Server', () => {
    service.get_valid_archs('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_repo_config_for_profile action on the Cobbler Server', () => {
    service.get_repo_config_for_profile('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_repo_config_for_system action on the Cobbler Server', () => {
    service.get_repo_config_for_system('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_template_file_for_profile action on the Cobbler Server', () => {
    service.get_template_file_for_profile('', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_template_file_for_system action on the Cobbler Server', () => {
    service.get_template_file_for_system('', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the register_new_system action on the Cobbler Server', () => {
    service.register_new_system(undefined, '');
    expect(service).toBeFalsy();
  });

  it('should execute the disable_netboot action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    service.disable_netboot('', '').subscribe((value) => {
      expect(value).toBe(true);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the upload_log_data action on the Cobbler Server', () => {
    service.upload_log_data('', undefined, undefined, undefined, undefined, '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the run_install_triggers action on the Cobbler Server', () => {
    service.run_install_triggers('', '', '', undefined, '');
    expect(service).toBeFalsy();
  });

  it('should execute the version action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><double>3.4</double></value></param></params></methodResponse>`;
    const result = 3.4;
    service.version().subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the extended_version action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>gitdate</name><value><string>Mon Jun 13 16:13:33 2022 +0200</string></value></member><member><name>gitstamp</name><value><string>0e20f01b</string></value></member><member><name>builddate</name><value><string>Mon Jun 27 06:34:23 2022</string></value></member><member><name>version</name><value><string>3.4.0</string></value></member><member><name>version_tuple</name><value><array><data><value><int>3</int></value><value><int>4</int></value><value><int>0</int></value></data></array></value></member></struct></value></param></params></methodResponse>`;
    const result: ExtendedVersion = {
      gitdate: 'Mon Jun 13 16:13:33 2022 +0200',
      gitstamp: '0e20f01b',
      builddate: 'Mon Jun 27 06:34:23 2022',
      version: '3.4.0',
      versionTuple: {
        major: 3,
        minor: 4,
        patch: 0,
      },
    };

    service.extended_version().subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the get_distros_since action on the Cobbler Server', () => {
    service.get_distros_since(0);
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_profiles_since action on the Cobbler Server', () => {
    service.get_profiles_since(0);
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_systems_since action on the Cobbler Server', () => {
    service.get_systems_since(0);
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_repos_since action on the Cobbler Server', () => {
    service.get_repos_since(0);
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_images_since action on the Cobbler Server', () => {
    service.get_images_since(0);
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_menus_since action on the Cobbler Server', () => {
    service.get_menus_since(0);
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_repos_compatible_with_profile action on the Cobbler Server', () => {
    service.get_repos_compatible_with_profile('', '');
    expect(service).toBeFalsy();
  });

  // Captured live from a Cobbler 4.0.0b1 dev instance. The server-side implementation
  // (cobbler/remote.py: find_system_by_dns_name) looks up the dns_name on a system's *network interface*, not on
  // the System item itself; in this Cobbler 4.0.0b1 build that index isn't wired up, so a real system with the
  // requested dns_name set on its interface still comes back as the documented "empty dict" not-found sentinel.
  // This still exercises the fix: the raw value is an XML-RPC struct (deserialized as a Map) that must arrive as a
  // plain object, not a Map instance.
  it('should execute the find_system_by_dns_name action on the Cobbler Server', async () => {
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct></struct></value></param></params></methodResponse>`;
    service
      .find_system_by_dns_name('task5system.example.com')
      .subscribe((value) => {
        expect(value).toEqual({});
        expect(value instanceof Map).toBeFalsy();
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  // Since find_system_by_dns_name() delegates server-side to get_system_as_rendered() (see remote.py), a match
  // returns the same rendered-system shape already verified live for get_system_as_rendered: a struct with nested
  // structs like kernel_options. This confirms the conversion path handles that non-empty case too.
  it('should convert a non-empty find_system_by_dns_name response into a plain object', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>name</name><value><string>task5system</string></value></member><member><name>kernel_options</name><value><struct><member><name>rd.debug</name><value><string>~</string></value></member><member><name>ip</name><value><string>dhcp</string></value></member></struct></value></member></struct></value></param></params></methodResponse>`;
    service
      .find_system_by_dns_name('task5system.example.com')
      .subscribe((value) => {
        expect(value).toEqual({
          name: 'task5system',
          kernel_options: { 'rd.debug': '~', ip: 'dhcp' },
        });
        expect(value['kernel_options'] instanceof Map).toBeFalsy();
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  // Captured live from a Cobbler 4.0.0b1 dev instance: the resolved kernel_options of a system whose profile and
  // system both contribute entries. The top-level value is an XML-RPC struct and must arrive as a plain object.
  it('should execute the get_item_resolved_value action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>quiet</name><value><string>~</string></value></member><member><name>console</name><value><string>ttyS0,115200</string></value></member><member><name>log_level</name><value><int>3</int></value></member><member><name>rd.debug</name><value><string>~</string></value></member><member><name>ip</name><value><string>dhcp</string></value></member></struct></value></param></params></methodResponse>`;
    const result = {
      console: 'ttyS0,115200',
      ip: 'dhcp',
      log_level: 3,
      quiet: '~',
      'rd.debug': '~',
    };
    service
      .get_item_resolved_value('5a1d7b47cd424c5aa4b5b63853df4fc7', [
        'kernel_options',
      ])
      .subscribe((value) => {
        expect(value).toEqual(result);
        expect(value instanceof Map).toBeFalsy();
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should turn struct members named like Object.prototype properties into own properties', async () => {
    // Struct member names of the free-form dictionaries (kernel_options, autoinstall_meta, template_files, ...) are
    // chosen by the Cobbler administrator, so they may collide with the special Object.prototype property names. A
    // naive `result[key] = value` would run into the `__proto__` setter: the member would silently disappear and the
    // prototype chain of the result would be mutated (prototype pollution). This must not happen at any depth.
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>__proto__</name><value><string>polluted</string></value></member><member><name>constructor</name><value><string>hijacked</string></value></member><member><name>prototype</name><value><string>shadowed</string></value></member><member><name>ip</name><value><string>dhcp</string></value></member><member><name>nested</name><value><struct><member><name>__proto__</name><value><struct><member><name>polluted_marker</name><value><string>yes</string></value></member></struct></value></member><member><name>harmless</name><value><string>value</string></value></member></struct></value></member></struct></value></param></params></methodResponse>`;
    service
      .get_item_resolved_value('5a1d7b47cd424c5aa4b5b63853df4fc7', [
        'kernel_options',
      ])
      .subscribe((value) => {
        const resolved = value as Record<string, any>;

        // The prototype of the produced object is untouched.
        expect(Object.getPrototypeOf(resolved)).toBe(Object.prototype);
        // Object.prototype itself was not polluted.
        expect((Object.prototype as any).polluted_marker).toBeUndefined();
        expect(({} as any).polluted_marker).toBeUndefined();

        // Every struct member exists as an own, enumerable property.
        expect(Object.keys(resolved).sort()).toEqual([
          '__proto__',
          'constructor',
          'ip',
          'nested',
          'prototype',
        ]);
        expect(Object.getOwnPropertyDescriptor(resolved, '__proto__')).toEqual({
          value: 'polluted',
          enumerable: true,
          writable: true,
          configurable: true,
        });
        expect(
          Object.prototype.hasOwnProperty.call(resolved, '__proto__'),
        ).toBe(true);
        expect(resolved['constructor']).toBe('hijacked');
        expect(resolved['prototype']).toBe('shadowed');
        expect(resolved['ip']).toBe('dhcp');

        // The same holds for a struct nested one level deeper.
        const nested = resolved['nested'];
        expect(Object.getPrototypeOf(nested)).toBe(Object.prototype);
        expect(Object.keys(nested).sort()).toEqual(['__proto__', 'harmless']);
        expect(
          Object.getOwnPropertyDescriptor(nested, '__proto__')?.value,
        ).toEqual({ polluted_marker: 'yes' });
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should turn item struct members named like Object.prototype properties into own properties', async () => {
    // Same guarantee as above, but for the `rebuildItem()` code path that every `get_<item>` method uses.
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>name</name><value><string>test</string></value></member><member><name>__proto__</name><value><string>polluted</string></value></member><member><name>kernel_options</name><value><struct><member><name>__proto__</name><value><string>nested-pollution</string></value></member><member><name>ip</name><value><string>dhcp</string></value></member></struct></value></member></struct></value></param></params></methodResponse>`;
    service.get_distro('', false, false, '').subscribe((value) => {
      const distro = value as unknown as Record<string, any>;

      expect(Object.getPrototypeOf(distro)).toBe(Object.prototype);
      expect(Object.keys(distro).sort()).toEqual([
        '__proto__',
        'kernel_options',
        'name',
      ]);
      expect(Object.getOwnPropertyDescriptor(distro, '__proto__')?.value).toBe(
        'polluted',
      );
      expect(
        Object.getOwnPropertyDescriptor(distro['kernel_options'], '__proto__')
          ?.value,
      ).toBe('nested-pollution');
      expect(distro['kernel_options']['ip']).toBe('dhcp');
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_distro_as_rendered action on the Cobbler Server', async () => {
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>allow_duplicate_hostnames</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_ips</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_macs</name><value><boolean>0</boolean></value></member><member><name>allow_dynamic_settings</name><value><boolean>0</boolean></value></member><member><name>always_write_dhcp_entries</name><value><boolean>0</boolean></value></member><member><name>anamon_enabled</name><value><boolean>0</boolean></value></member><member><name>auth_token_expiration</name><value><int>3600</int></value></member><member><name>authn_pam_service</name><value><string>login</string></value></member><member><name>autoinstall_snippets_dir</name><value><string>/var/lib/cobbler/snippets</string></value></member><member><name>autoinstall_templates_dir</name><value><string>/var/lib/cobbler/templates</string></value></member><member><name>bind_chroot_path</name><value><string></string></value></member><member><name>bind_zonefile_path</name><value><string>/var/lib/named</string></value></member><member><name>bind_master</name><value><string>127.0.0.1</string></value></member><member><name>boot_loader_conf_template_dir</name><value><string>/etc/cobbler/boot_loader_conf</string></value></member><member><name>bootloaders_dir</name><value><string>/var/lib/cobbler/loaders</string></value></member><member><name>bootloaders_shim_folder</name><value><string>/usr/share/efi/*/</string></value></member><member><name>bootloaders_shim_file</name><value><string>shim\\.efi</string></value></member><member><name>bootloaders_ipxe_folder</name><value><string>/usr/share/ipxe/</string></value></member><member><name>grubconfig_dir</name><value><string>/var/lib/cobbler/grub_config</string></value></member><member><name>build_reporting_enabled</name><value><boolean>0</boolean></value></member><member><name>build_reporting_email</name><value><array><data><value><string>root@localhost</string></value></data></array></value></member><member><name>build_reporting_ignorelist</name><value><array><data></data></array></value></member><member><name>build_reporting_sender</name><value><string></string></value></member><member><name>build_reporting_smtp_server</name><value><string>localhost</string></value></member><member><name>build_reporting_subject</name><value><string></string></value></member><member><name>buildisodir</name><value><string>/var/cache/cobbler/buildiso</string></value></member><member><name>cheetah_import_whitelist</name><value><array><data><value><string>random</string></value><value><string>re</string></value><value><string>time</string></value><value><string>netaddr</string></value></data></array></value></member><member><name>client_use_https</name><value><boolean>0</boolean></value></member><member><name>client_use_localhost</name><value><boolean>0</boolean></value></member><member><name>cobbler_master</name><value><string></string></value></member><member><name>convert_server_to_ip</name><value><boolean>0</boolean></value></member><member><name>createrepo_flags</name><value><string>-c cache -s sha</string></value></member><member><name>autoinstall</name><value><string>default.ks</string></value></member><member><name>default_name_servers</name><value><array><data></data></array></value></member><member><name>default_name_servers_search</name><value><array><data></data></array></value></member><member><name>default_ownership</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>default_password_crypted</name><value><string>$1$mF86/UHC$WvcIcX2t6crBz2onWxyac.</string></value></member><member><name>default_template_type</name><value><string>cheetah</string></value></member><member><name>default_virt_bridge</name><value><string>xenbr0</string></value></member><member><name>default_virt_disk_driver</name><value><string>raw</string></value></member><member><name>default_virt_file_size</name><value><double>5.0</double></value></member><member><name>default_virt_ram</name><value><int>512</int></value></member><member><name>default_virt_type</name><value><string>xenpv</string></value></member><member><name>enable_ipxe</name><value><boolean>0</boolean></value></member><member><name>enable_menu</name><value><boolean>1</boolean></value></member><member><name>extra_settings_list</name><value><array><data></data></array></value></member><member><name>http_port</name><value><int>80</int></value></member><member><name>include</name><value><array><data><value><string>/etc/cobbler/settings.d/*.settings</string></value></data></array></value></member><member><name>iso_template_dir</name><value><string>/etc/cobbler/iso</string></value></member><member><name>jinja2_includedir</name><value><string>/var/lib/cobbler/jinja2</string></value></member><member><name>kernel_options</name><value><string></string></value></member><member><name>ldap_anonymous_bind</name><value><boolean>1</boolean></value></member><member><name>ldap_base_dn</name><value><string>DC=example,DC=com</string></value></member><member><name>ldap_port</name><value><int>389</int></value></member><member><name>ldap_search_bind_dn</name><value><string></string></value></member><member><name>ldap_search_passwd</name><value><string></string></value></member><member><name>ldap_search_prefix</name><value><string>uid=</string></value></member><member><name>ldap_server</name><value><string>ldap.example.com</string></value></member><member><name>ldap_tls</name><value><boolean>1</boolean></value></member><member><name>ldap_tls_cacertdir</name><value><string></string></value></member><member><name>ldap_tls_cacertfile</name><value><string></string></value></member><member><name>ldap_tls_certfile</name><value><string></string></value></member><member><name>ldap_tls_keyfile</name><value><string></string></value></member><member><name>ldap_tls_reqcert</name><value><string></string></value></member><member><name>ldap_tls_cipher_suite</name><value><string></string></value></member><member><name>bind_manage_ipmi</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp_v6</name><value><boolean>0</boolean></value></member><member><name>manage_dhcp_v4</name><value><boolean>1</boolean></value></member><member><name>manage_dns</name><value><boolean>0</boolean></value></member><member><name>manage_forward_zones</name><value><array><data></data></array></value></member><member><name>manage_reverse_zones</name><value><array><data></data></array></value></member><member><name>manage_genders</name><value><boolean>0</boolean></value></member><member><name>manage_rsync</name><value><boolean>0</boolean></value></member><member><name>manage_tftpd</name><value><boolean>1</boolean></value></member><member><name>next_server_v4</name><value><string>192.168.1.1</string></value></member><member><name>next_server_v6</name><value><string>::1</string></value></member><member><name>nsupdate_enabled</name><value><boolean>0</boolean></value></member><member><name>nsupdate_log</name><value><string>/var/log/cobbler/nsupdate.log</string></value></member><member><name>nsupdate_tsig_algorithm</name><value><string>hmac-sha512</string></value></member><member><name>nsupdate_tsig_key</name><value><array><data><value><string>cobbler_update_key.</string></value><value><string>hvnK54HFJXFasHjzjEn09ASIkCOGYSnofRq4ejsiBHz3udVyGiuebFGAswSjKUxNuhmllPrkI0HRSSmM2qvZug==</string></value></data></array></value></member><member><name>power_management_default_type</name><value><string>ipmilan</string></value></member><member><name>proxies</name><value><array><data></data></array></value></member><member><name>proxy_url_ext</name><value><string></string></value></member><member><name>proxy_url_int</name><value><string></string></value></member><member><name>puppet_auto_setup</name><value><boolean>0</boolean></value></member><member><name>puppet_parameterized_classes</name><value><boolean>1</boolean></value></member><member><name>puppet_server</name><value><string></string></value></member><member><name>puppet_version</name><value><int>2</int></value></member><member><name>puppetca_path</name><value><string>/usr/bin/puppet</string></value></member><member><name>pxe_just_once</name><value><boolean>1</boolean></value></member><member><name>nopxe_with_triggers</name><value><boolean>1</boolean></value></member><member><name>redhat_management_permissive</name><value><boolean>0</boolean></value></member><member><name>redhat_management_server</name><value><string>xmlrpc.rhn.redhat.com</string></value></member><member><name>redhat_management_key</name><value><string></string></value></member><member><name>register_new_installs</name><value><boolean>0</boolean></value></member><member><name>remove_old_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>replicate_repo_rsync_options</name><value><string>-avzH</string></value></member><member><name>replicate_rsync_options</name><value><string>-avzH</string></value></member><member><name>reposync_flags</name><value><string>--newest-only --delete --refresh --remote-time</string></value></member><member><name>reposync_rsync_flags</name><value><string>-rltDv --copy-unsafe-links</string></value></member><member><name>restart_dhcp</name><value><boolean>1</boolean></value></member><member><name>restart_dns</name><value><boolean>1</boolean></value></member><member><name>run_install_triggers</name><value><boolean>1</boolean></value></member><member><name>scm_track_enabled</name><value><boolean>0</boolean></value></member><member><name>scm_track_mode</name><value><string>git</string></value></member><member><name>scm_track_author</name><value><string>cobbler &lt;cobbler@localhost&gt;</string></value></member><member><name>scm_push_script</name><value><string>/bin/true</string></value></member><member><name>serializer_pretty_json</name><value><boolean>0</boolean></value></member><member><name>server</name><value><string>192.168.1.1</string></value></member><member><name>sign_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>signature_path</name><value><string>/var/lib/cobbler/distro_signatures.json</string></value></member><member><name>signature_url</name><value><string>https://cobbler.github.io/signatures/3.0.x/latest.json</string></value></member><member><name>syslinux_dir</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_memdisk_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_pxelinux_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>tftpboot_location</name><value><string>/srv/tftpboot</string></value></member><member><name>virt_auto_boot</name><value><boolean>1</boolean></value></member><member><name>webdir</name><value><string>/srv/www/cobbler</string></value></member><member><name>webdir_whitelist</name><value><array><data><value><string>misc</string></value><value><string>web</string></value><value><string>webui</string></value><value><string>localmirror</string></value><value><string>repo_mirror</string></value><value><string>distro_mirror</string></value><value><string>images</string></value><value><string>links</string></value><value><string>pub</string></value><value><string>repo_profile</string></value><value><string>repo_system</string></value><value><string>svc</string></value><value><string>rendered</string></value><value><string>.link_cache</string></value></data></array></value></member><member><name>xmlrpc_port</name><value><int>25151</int></value></member><member><name>yum_distro_priority</name><value><int>1</int></value></member><member><name>yum_post_install_mirror</name><value><boolean>1</boolean></value></member><member><name>yumdownloader_flags</name><value><string>--resolve</string></value></member><member><name>windows_enabled</name><value><boolean>0</boolean></value></member><member><name>windows_template_dir</name><value><string>/etc/cobbler/windows</string></value></member><member><name>samba_distro_share</name><value><string>DISTRO</string></value></member><member><name>cache_enabled</name><value><boolean>1</boolean></value></member><member><name>auto_migrate_settings</name><value><boolean>0</boolean></value></member><member><name>bootloaders_formats</name><value><struct><member><name>aarch64</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member></struct></value></member><member><name>arm</name><value><struct><member><name>binary_name</name><value><string>bootarm.efi</string></value></member></struct></value></member><member><name>arm64-efi</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>efinet</string></value></data></array></value></member></struct></value></member><member><name>i386-efi</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>i386-pc-pxe</name><value><struct><member><name>binary_name</name><value><string>grub.0</string></value></member><member><name>mod_dir</name><value><string>i386-pc</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>pxe</string></value><value><string>biosdisk</string></value></data></array></value></member></struct></value></member><member><name>i686</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>IA64</name><value><struct><member><name>binary_name</name><value><string>bootia64.efi</string></value></member></struct></value></member><member><name>powerpc-ieee1275</name><value><struct><member><name>binary_name</name><value><string>grub.ppc64le</string></value></member><member><name>extra_modules</name><value><array><data><value><string>net</string></value><value><string>ofnet</string></value></data></array></value></member></struct></value></member><member><name>x86_64-efi</name><value><struct><member><name>binary_name</name><value><string>grubx64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>efinet</string></value></data></array></value></member></struct></value></member></struct></value></member><member><name>bootloaders_modules</name><value><array><data><value><string>btrfs</string></value><value><string>ext2</string></value><value><string>xfs</string></value><value><string>jfs</string></value><value><string>reiserfs</string></value><value><string>all_video</string></value><value><string>boot</string></value><value><string>cat</string></value><value><string>configfile</string></value><value><string>echo</string></value><value><string>fat</string></value><value><string>font</string></value><value><string>gfxmenu</string></value><value><string>gfxterm</string></value><value><string>gzio</string></value><value><string>halt</string></value><value><string>iso9660</string></value><value><string>jpeg</string></value><value><string>linux</string></value><value><string>loadenv</string></value><value><string>minicmd</string></value><value><string>normal</string></value><value><string>part_apple</string></value><value><string>part_gpt</string></value><value><string>part_msdos</string></value><value><string>password_pbkdf2</string></value><value><string>png</string></value><value><string>reboot</string></value><value><string>search</string></value><value><string>search_fs_file</string></value><value><string>search_fs_uuid</string></value><value><string>search_label</string></value><value><string>sleep</string></value><value><string>test</string></value><value><string>true</string></value><value><string>video</string></value><value><string>mdraid09</string></value><value><string>mdraid1x</string></value><value><string>lvm</string></value><value><string>serial</string></value><value><string>regexp</string></value><value><string>tr</string></value><value><string>tftp</string></value><value><string>http</string></value><value><string>luks</string></value><value><string>gcry_rijndael</string></value><value><string>gcry_sha1</string></value><value><string>gcry_sha256</string></value></data></array></value></member><member><name>grub2_mod_dir</name><value><string>/usr/share/grub2</string></value></member><member><name>lazy_start</name><value><boolean>0</boolean></value></member><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1738747399.7999327</double></value></member><member><name>mtime</name><value><double>1738747399.7999327</double></value></member><member><name>uid</name><value><string>8a8f89dd76964c068e71d6a0dc3160a0</string></value></member><member><name>name</name><value><string>test</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options_post</name><value><string></string></value></member><member><name>autoinstall_meta</name><value><string></string></value></member><member><name>fetchable_files</name><value><string></string></value></member><member><name>boot_files</name><value><string></string></value></member><member><name>template_files</name><value><string></string></value></member><member><name>owners</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>tree_build_time</name><value><double>0.0</double></value></member><member><name>arch</name><value><string>x86_64</string></value></member><member><name>boot_loaders</name><value><array><data><value><string>grub</string></value><value><string>pxe</string></value><value><string>ipxe</string></value></data></array></value></member><member><name>breed</name><value><string></string></value></member><member><name>initrd</name><value><string>/root/initrd</string></value></member><member><name>kernel</name><value><string>/root/kernel</string></value></member><member><name>os_version</name><value><string></string></value></member><member><name>source_repos</name><value><array><data></data></array></value></member><member><name>remote_boot_kernel</name><value><string></string></value></member><member><name>remote_boot_initrd</name><value><string></string></value></member><member><name>http_server</name><value><string>192.168.1.1</string></value></member><member><name>distro_name</name><value><string>test</string></value></member></struct></value></param></params></methodResponse>`;
    service.get_distro_as_rendered('', '').subscribe((value) => {
      const rendered = value as Record<string, any>;
      expect(Object.keys(rendered).length).toEqual(159);
      expect(rendered['name']).toBe('test');
      expect(rendered['build_reporting_smtp_server']).toBe('localhost');
      // A struct nested two levels deep is recursively converted into a plain object as well.
      expect(rendered['bootloaders_formats']['arm64-efi']).toEqual({
        binary_name: 'grubaa64.efi',
        extra_modules: ['efinet'],
      });
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_profile_as_rendered action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>allow_duplicate_hostnames</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_ips</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_macs</name><value><boolean>0</boolean></value></member><member><name>allow_dynamic_settings</name><value><boolean>0</boolean></value></member><member><name>always_write_dhcp_entries</name><value><boolean>0</boolean></value></member><member><name>anamon_enabled</name><value><boolean>0</boolean></value></member><member><name>auth_token_expiration</name><value><int>3600</int></value></member><member><name>authn_pam_service</name><value><string>login</string></value></member><member><name>autoinstall_snippets_dir</name><value><string>/var/lib/cobbler/snippets</string></value></member><member><name>autoinstall_templates_dir</name><value><string>/var/lib/cobbler/templates</string></value></member><member><name>bind_chroot_path</name><value><string></string></value></member><member><name>bind_zonefile_path</name><value><string>/var/lib/named</string></value></member><member><name>bind_master</name><value><string>127.0.0.1</string></value></member><member><name>boot_loader_conf_template_dir</name><value><string>/etc/cobbler/boot_loader_conf</string></value></member><member><name>bootloaders_dir</name><value><string>/var/lib/cobbler/loaders</string></value></member><member><name>bootloaders_shim_folder</name><value><string>/usr/share/efi/*/</string></value></member><member><name>bootloaders_shim_file</name><value><string>shim\\.efi</string></value></member><member><name>bootloaders_ipxe_folder</name><value><string>/usr/share/ipxe/</string></value></member><member><name>grubconfig_dir</name><value><string>/var/lib/cobbler/grub_config</string></value></member><member><name>build_reporting_enabled</name><value><boolean>0</boolean></value></member><member><name>build_reporting_email</name><value><array><data><value><string>root@localhost</string></value></data></array></value></member><member><name>build_reporting_ignorelist</name><value><array><data></data></array></value></member><member><name>build_reporting_sender</name><value><string></string></value></member><member><name>build_reporting_smtp_server</name><value><string>localhost</string></value></member><member><name>build_reporting_subject</name><value><string></string></value></member><member><name>buildisodir</name><value><string>/var/cache/cobbler/buildiso</string></value></member><member><name>cheetah_import_whitelist</name><value><array><data><value><string>random</string></value><value><string>re</string></value><value><string>time</string></value><value><string>netaddr</string></value></data></array></value></member><member><name>client_use_https</name><value><boolean>0</boolean></value></member><member><name>client_use_localhost</name><value><boolean>0</boolean></value></member><member><name>cobbler_master</name><value><string></string></value></member><member><name>convert_server_to_ip</name><value><boolean>0</boolean></value></member><member><name>createrepo_flags</name><value><string>-c cache -s sha</string></value></member><member><name>autoinstall</name><value><string>default.ks</string></value></member><member><name>default_name_servers</name><value><array><data></data></array></value></member><member><name>default_name_servers_search</name><value><array><data></data></array></value></member><member><name>default_ownership</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>default_password_crypted</name><value><string>$1$mF86/UHC$WvcIcX2t6crBz2onWxyac.</string></value></member><member><name>default_template_type</name><value><string>cheetah</string></value></member><member><name>default_virt_bridge</name><value><string>xenbr0</string></value></member><member><name>default_virt_disk_driver</name><value><string>raw</string></value></member><member><name>default_virt_file_size</name><value><double>5.0</double></value></member><member><name>default_virt_ram</name><value><int>512</int></value></member><member><name>default_virt_type</name><value><string>xenpv</string></value></member><member><name>enable_ipxe</name><value><boolean>0</boolean></value></member><member><name>enable_menu</name><value><boolean>1</boolean></value></member><member><name>extra_settings_list</name><value><array><data></data></array></value></member><member><name>http_port</name><value><int>80</int></value></member><member><name>include</name><value><array><data><value><string>/etc/cobbler/settings.d/*.settings</string></value></data></array></value></member><member><name>iso_template_dir</name><value><string>/etc/cobbler/iso</string></value></member><member><name>jinja2_includedir</name><value><string>/var/lib/cobbler/jinja2</string></value></member><member><name>kernel_options</name><value><string></string></value></member><member><name>ldap_anonymous_bind</name><value><boolean>1</boolean></value></member><member><name>ldap_base_dn</name><value><string>DC=example,DC=com</string></value></member><member><name>ldap_port</name><value><int>389</int></value></member><member><name>ldap_search_bind_dn</name><value><string></string></value></member><member><name>ldap_search_passwd</name><value><string></string></value></member><member><name>ldap_search_prefix</name><value><string>uid=</string></value></member><member><name>ldap_server</name><value><string>ldap.example.com</string></value></member><member><name>ldap_tls</name><value><boolean>1</boolean></value></member><member><name>ldap_tls_cacertdir</name><value><string></string></value></member><member><name>ldap_tls_cacertfile</name><value><string></string></value></member><member><name>ldap_tls_certfile</name><value><string></string></value></member><member><name>ldap_tls_keyfile</name><value><string></string></value></member><member><name>ldap_tls_reqcert</name><value><string></string></value></member><member><name>ldap_tls_cipher_suite</name><value><string></string></value></member><member><name>bind_manage_ipmi</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp_v6</name><value><boolean>0</boolean></value></member><member><name>manage_dhcp_v4</name><value><boolean>1</boolean></value></member><member><name>manage_dns</name><value><boolean>0</boolean></value></member><member><name>manage_forward_zones</name><value><array><data></data></array></value></member><member><name>manage_reverse_zones</name><value><array><data></data></array></value></member><member><name>manage_genders</name><value><boolean>0</boolean></value></member><member><name>manage_rsync</name><value><boolean>0</boolean></value></member><member><name>manage_tftpd</name><value><boolean>1</boolean></value></member><member><name>next_server_v4</name><value><string>192.168.1.1</string></value></member><member><name>next_server_v6</name><value><string>::1</string></value></member><member><name>nsupdate_enabled</name><value><boolean>0</boolean></value></member><member><name>nsupdate_log</name><value><string>/var/log/cobbler/nsupdate.log</string></value></member><member><name>nsupdate_tsig_algorithm</name><value><string>hmac-sha512</string></value></member><member><name>nsupdate_tsig_key</name><value><array><data><value><string>cobbler_update_key.</string></value><value><string>hvnK54HFJXFasHjzjEn09ASIkCOGYSnofRq4ejsiBHz3udVyGiuebFGAswSjKUxNuhmllPrkI0HRSSmM2qvZug==</string></value></data></array></value></member><member><name>power_management_default_type</name><value><string>ipmilan</string></value></member><member><name>proxies</name><value><array><data></data></array></value></member><member><name>proxy_url_ext</name><value><string></string></value></member><member><name>proxy_url_int</name><value><string></string></value></member><member><name>puppet_auto_setup</name><value><boolean>0</boolean></value></member><member><name>puppet_parameterized_classes</name><value><boolean>1</boolean></value></member><member><name>puppet_server</name><value><string></string></value></member><member><name>puppet_version</name><value><int>2</int></value></member><member><name>puppetca_path</name><value><string>/usr/bin/puppet</string></value></member><member><name>pxe_just_once</name><value><boolean>1</boolean></value></member><member><name>nopxe_with_triggers</name><value><boolean>1</boolean></value></member><member><name>redhat_management_permissive</name><value><boolean>0</boolean></value></member><member><name>redhat_management_server</name><value><string>xmlrpc.rhn.redhat.com</string></value></member><member><name>redhat_management_key</name><value><string></string></value></member><member><name>register_new_installs</name><value><boolean>0</boolean></value></member><member><name>remove_old_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>replicate_repo_rsync_options</name><value><string>-avzH</string></value></member><member><name>replicate_rsync_options</name><value><string>-avzH</string></value></member><member><name>reposync_flags</name><value><string>--newest-only --delete --refresh --remote-time</string></value></member><member><name>reposync_rsync_flags</name><value><string>-rltDv --copy-unsafe-links</string></value></member><member><name>restart_dhcp</name><value><boolean>1</boolean></value></member><member><name>restart_dns</name><value><boolean>1</boolean></value></member><member><name>run_install_triggers</name><value><boolean>1</boolean></value></member><member><name>scm_track_enabled</name><value><boolean>0</boolean></value></member><member><name>scm_track_mode</name><value><string>git</string></value></member><member><name>scm_track_author</name><value><string>cobbler &lt;cobbler@localhost&gt;</string></value></member><member><name>scm_push_script</name><value><string>/bin/true</string></value></member><member><name>serializer_pretty_json</name><value><boolean>0</boolean></value></member><member><name>server</name><value><string>192.168.1.1</string></value></member><member><name>sign_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>signature_path</name><value><string>/var/lib/cobbler/distro_signatures.json</string></value></member><member><name>signature_url</name><value><string>https://cobbler.github.io/signatures/3.0.x/latest.json</string></value></member><member><name>syslinux_dir</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_memdisk_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_pxelinux_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>tftpboot_location</name><value><string>/srv/tftpboot</string></value></member><member><name>virt_auto_boot</name><value><boolean>1</boolean></value></member><member><name>webdir</name><value><string>/srv/www/cobbler</string></value></member><member><name>webdir_whitelist</name><value><array><data><value><string>misc</string></value><value><string>web</string></value><value><string>webui</string></value><value><string>localmirror</string></value><value><string>repo_mirror</string></value><value><string>distro_mirror</string></value><value><string>images</string></value><value><string>links</string></value><value><string>pub</string></value><value><string>repo_profile</string></value><value><string>repo_system</string></value><value><string>svc</string></value><value><string>rendered</string></value><value><string>.link_cache</string></value></data></array></value></member><member><name>xmlrpc_port</name><value><int>25151</int></value></member><member><name>yum_distro_priority</name><value><int>1</int></value></member><member><name>yum_post_install_mirror</name><value><boolean>1</boolean></value></member><member><name>yumdownloader_flags</name><value><string>--resolve</string></value></member><member><name>windows_enabled</name><value><boolean>0</boolean></value></member><member><name>windows_template_dir</name><value><string>/etc/cobbler/windows</string></value></member><member><name>samba_distro_share</name><value><string>DISTRO</string></value></member><member><name>cache_enabled</name><value><boolean>1</boolean></value></member><member><name>auto_migrate_settings</name><value><boolean>0</boolean></value></member><member><name>bootloaders_formats</name><value><struct><member><name>aarch64</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member></struct></value></member><member><name>arm</name><value><struct><member><name>binary_name</name><value><string>bootarm.efi</string></value></member></struct></value></member><member><name>arm64-efi</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>efinet</string></value></data></array></value></member></struct></value></member><member><name>i386-efi</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>i386-pc-pxe</name><value><struct><member><name>binary_name</name><value><string>grub.0</string></value></member><member><name>mod_dir</name><value><string>i386-pc</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>pxe</string></value><value><string>biosdisk</string></value></data></array></value></member></struct></value></member><member><name>i686</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>IA64</name><value><struct><member><name>binary_name</name><value><string>bootia64.efi</string></value></member></struct></value></member><member><name>powerpc-ieee1275</name><value><struct><member><name>binary_name</name><value><string>grub.ppc64le</string></value></member><member><name>extra_modules</name><value><array><data><value><string>net</string></value><value><string>ofnet</string></value></data></array></value></member></struct></value></member><member><name>x86_64-efi</name><value><struct><member><name>binary_name</name><value><string>grubx64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>efinet</string></value></data></array></value></member></struct></value></member></struct></value></member><member><name>bootloaders_modules</name><value><array><data><value><string>btrfs</string></value><value><string>ext2</string></value><value><string>xfs</string></value><value><string>jfs</string></value><value><string>reiserfs</string></value><value><string>all_video</string></value><value><string>boot</string></value><value><string>cat</string></value><value><string>configfile</string></value><value><string>echo</string></value><value><string>fat</string></value><value><string>font</string></value><value><string>gfxmenu</string></value><value><string>gfxterm</string></value><value><string>gzio</string></value><value><string>halt</string></value><value><string>iso9660</string></value><value><string>jpeg</string></value><value><string>linux</string></value><value><string>loadenv</string></value><value><string>minicmd</string></value><value><string>normal</string></value><value><string>part_apple</string></value><value><string>part_gpt</string></value><value><string>part_msdos</string></value><value><string>password_pbkdf2</string></value><value><string>png</string></value><value><string>reboot</string></value><value><string>search</string></value><value><string>search_fs_file</string></value><value><string>search_fs_uuid</string></value><value><string>search_label</string></value><value><string>sleep</string></value><value><string>test</string></value><value><string>true</string></value><value><string>video</string></value><value><string>mdraid09</string></value><value><string>mdraid1x</string></value><value><string>lvm</string></value><value><string>serial</string></value><value><string>regexp</string></value><value><string>tr</string></value><value><string>tftp</string></value><value><string>http</string></value><value><string>luks</string></value><value><string>gcry_rijndael</string></value><value><string>gcry_sha1</string></value><value><string>gcry_sha256</string></value></data></array></value></member><member><name>grub2_mod_dir</name><value><string>/usr/share/grub2</string></value></member><member><name>lazy_start</name><value><boolean>0</boolean></value></member><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>1</int></value></member><member><name>ctime</name><value><double>1738747400.079115</double></value></member><member><name>mtime</name><value><double>1738747400.079115</double></value></member><member><name>uid</name><value><string>ea6b5127c3c04ab6a2a0e4819a2a88de</string></value></member><member><name>name</name><value><string>testprof</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options_post</name><value><string></string></value></member><member><name>autoinstall_meta</name><value><string></string></value></member><member><name>fetchable_files</name><value><string></string></value></member><member><name>boot_files</name><value><string></string></value></member><member><name>template_files</name><value><string></string></value></member><member><name>owners</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>tree_build_time</name><value><double>0.0</double></value></member><member><name>arch</name><value><string>x86_64</string></value></member><member><name>boot_loaders</name><value><array><data><value><string>grub</string></value><value><string>pxe</string></value><value><string>ipxe</string></value></data></array></value></member><member><name>breed</name><value><string></string></value></member><member><name>initrd</name><value><string>/root/initrd</string></value></member><member><name>kernel</name><value><string>/root/kernel</string></value></member><member><name>os_version</name><value><string></string></value></member><member><name>source_repos</name><value><array><data></data></array></value></member><member><name>remote_boot_kernel</name><value><string></string></value></member><member><name>remote_boot_initrd</name><value><string></string></value></member><member><name>dhcp_tag</name><value><string></string></value></member><member><name>distro</name><value><string>test</string></value></member><member><name>name_servers</name><value><array><data></data></array></value></member><member><name>name_servers_search</name><value><array><data></data></array></value></member><member><name>filename</name><value><string></string></value></member><member><name>proxy</name><value><string></string></value></member><member><name>repos</name><value><string></string></value></member><member><name>menu</name><value><string></string></value></member><member><name>virt_bridge</name><value><string>xenbr0</string></value></member><member><name>virt_cpus</name><value><int>1</int></value></member><member><name>virt_disk_driver</name><value><string>raw</string></value></member><member><name>virt_file_size</name><value><double>5.0</double></value></member><member><name>virt_path</name><value><string></string></value></member><member><name>virt_ram</name><value><int>512</int></value></member><member><name>virt_type</name><value><string>xenpv</string></value></member><member><name>repo_data</name><value><array><data></data></array></value></member><member><name>http_server</name><value><string>192.168.1.1</string></value></member><member><name>profile_name</name><value><string>testprof</string></value></member><member><name>distro_name</name><value><string>test</string></value></member></struct></value></param></params></methodResponse>`;
    service.get_profile_as_rendered('', '').subscribe((value) => {
      const rendered = value as Record<string, any>;
      expect(Object.keys(rendered).length).toEqual(176);
      expect(rendered['name']).toBe('testprof');
      expect(rendered['build_reporting_smtp_server']).toBe('localhost');
      // A struct nested two levels deep is recursively converted into a plain object as well.
      expect(rendered['bootloaders_formats']['arm64-efi']).toEqual({
        binary_name: 'grubaa64.efi',
        extra_modules: ['efinet'],
      });
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_system_as_rendered action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>allow_duplicate_hostnames</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_ips</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_macs</name><value><boolean>0</boolean></value></member><member><name>allow_dynamic_settings</name><value><boolean>0</boolean></value></member><member><name>always_write_dhcp_entries</name><value><boolean>0</boolean></value></member><member><name>anamon_enabled</name><value><boolean>0</boolean></value></member><member><name>auth_token_expiration</name><value><int>3600</int></value></member><member><name>authn_pam_service</name><value><string>login</string></value></member><member><name>autoinstall_snippets_dir</name><value><string>/var/lib/cobbler/snippets</string></value></member><member><name>autoinstall_templates_dir</name><value><string>/var/lib/cobbler/templates</string></value></member><member><name>bind_chroot_path</name><value><string></string></value></member><member><name>bind_zonefile_path</name><value><string>/var/lib/named</string></value></member><member><name>bind_master</name><value><string>127.0.0.1</string></value></member><member><name>boot_loader_conf_template_dir</name><value><string>/etc/cobbler/boot_loader_conf</string></value></member><member><name>bootloaders_dir</name><value><string>/var/lib/cobbler/loaders</string></value></member><member><name>bootloaders_shim_folder</name><value><string>/usr/share/efi/*/</string></value></member><member><name>bootloaders_shim_file</name><value><string>shim\\.efi</string></value></member><member><name>bootloaders_ipxe_folder</name><value><string>/usr/share/ipxe/</string></value></member><member><name>grubconfig_dir</name><value><string>/var/lib/cobbler/grub_config</string></value></member><member><name>build_reporting_enabled</name><value><boolean>0</boolean></value></member><member><name>build_reporting_email</name><value><array><data><value><string>root@localhost</string></value></data></array></value></member><member><name>build_reporting_ignorelist</name><value><array><data></data></array></value></member><member><name>build_reporting_sender</name><value><string></string></value></member><member><name>build_reporting_smtp_server</name><value><string>localhost</string></value></member><member><name>build_reporting_subject</name><value><string></string></value></member><member><name>buildisodir</name><value><string>/var/cache/cobbler/buildiso</string></value></member><member><name>cheetah_import_whitelist</name><value><array><data><value><string>random</string></value><value><string>re</string></value><value><string>time</string></value><value><string>netaddr</string></value></data></array></value></member><member><name>client_use_https</name><value><boolean>0</boolean></value></member><member><name>client_use_localhost</name><value><boolean>0</boolean></value></member><member><name>cobbler_master</name><value><string></string></value></member><member><name>convert_server_to_ip</name><value><boolean>0</boolean></value></member><member><name>createrepo_flags</name><value><string>-c cache -s sha</string></value></member><member><name>autoinstall</name><value><string>default.ks</string></value></member><member><name>default_name_servers</name><value><array><data></data></array></value></member><member><name>default_name_servers_search</name><value><array><data></data></array></value></member><member><name>default_ownership</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>default_password_crypted</name><value><string>$1$mF86/UHC$WvcIcX2t6crBz2onWxyac.</string></value></member><member><name>default_template_type</name><value><string>cheetah</string></value></member><member><name>default_virt_bridge</name><value><string>xenbr0</string></value></member><member><name>default_virt_disk_driver</name><value><string>raw</string></value></member><member><name>default_virt_file_size</name><value><double>5.0</double></value></member><member><name>default_virt_ram</name><value><int>512</int></value></member><member><name>default_virt_type</name><value><string>xenpv</string></value></member><member><name>enable_ipxe</name><value><boolean>0</boolean></value></member><member><name>enable_menu</name><value><boolean>1</boolean></value></member><member><name>extra_settings_list</name><value><array><data></data></array></value></member><member><name>http_port</name><value><int>80</int></value></member><member><name>include</name><value><array><data><value><string>/etc/cobbler/settings.d/*.settings</string></value></data></array></value></member><member><name>iso_template_dir</name><value><string>/etc/cobbler/iso</string></value></member><member><name>jinja2_includedir</name><value><string>/var/lib/cobbler/jinja2</string></value></member><member><name>kernel_options</name><value><string></string></value></member><member><name>ldap_anonymous_bind</name><value><boolean>1</boolean></value></member><member><name>ldap_base_dn</name><value><string>DC=example,DC=com</string></value></member><member><name>ldap_port</name><value><int>389</int></value></member><member><name>ldap_search_bind_dn</name><value><string></string></value></member><member><name>ldap_search_passwd</name><value><string></string></value></member><member><name>ldap_search_prefix</name><value><string>uid=</string></value></member><member><name>ldap_server</name><value><string>ldap.example.com</string></value></member><member><name>ldap_tls</name><value><boolean>1</boolean></value></member><member><name>ldap_tls_cacertdir</name><value><string></string></value></member><member><name>ldap_tls_cacertfile</name><value><string></string></value></member><member><name>ldap_tls_certfile</name><value><string></string></value></member><member><name>ldap_tls_keyfile</name><value><string></string></value></member><member><name>ldap_tls_reqcert</name><value><string></string></value></member><member><name>ldap_tls_cipher_suite</name><value><string></string></value></member><member><name>bind_manage_ipmi</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp_v6</name><value><boolean>0</boolean></value></member><member><name>manage_dhcp_v4</name><value><boolean>1</boolean></value></member><member><name>manage_dns</name><value><boolean>0</boolean></value></member><member><name>manage_forward_zones</name><value><array><data></data></array></value></member><member><name>manage_reverse_zones</name><value><array><data></data></array></value></member><member><name>manage_genders</name><value><boolean>0</boolean></value></member><member><name>manage_rsync</name><value><boolean>0</boolean></value></member><member><name>manage_tftpd</name><value><boolean>1</boolean></value></member><member><name>next_server_v4</name><value><string>192.168.1.1</string></value></member><member><name>next_server_v6</name><value><string>::1</string></value></member><member><name>nsupdate_enabled</name><value><boolean>0</boolean></value></member><member><name>nsupdate_log</name><value><string>/var/log/cobbler/nsupdate.log</string></value></member><member><name>nsupdate_tsig_algorithm</name><value><string>hmac-sha512</string></value></member><member><name>nsupdate_tsig_key</name><value><array><data><value><string>cobbler_update_key.</string></value><value><string>hvnK54HFJXFasHjzjEn09ASIkCOGYSnofRq4ejsiBHz3udVyGiuebFGAswSjKUxNuhmllPrkI0HRSSmM2qvZug==</string></value></data></array></value></member><member><name>power_management_default_type</name><value><string>ipmilan</string></value></member><member><name>proxies</name><value><array><data></data></array></value></member><member><name>proxy_url_ext</name><value><string></string></value></member><member><name>proxy_url_int</name><value><string></string></value></member><member><name>puppet_auto_setup</name><value><boolean>0</boolean></value></member><member><name>puppet_parameterized_classes</name><value><boolean>1</boolean></value></member><member><name>puppet_server</name><value><string></string></value></member><member><name>puppet_version</name><value><int>2</int></value></member><member><name>puppetca_path</name><value><string>/usr/bin/puppet</string></value></member><member><name>pxe_just_once</name><value><boolean>1</boolean></value></member><member><name>nopxe_with_triggers</name><value><boolean>1</boolean></value></member><member><name>redhat_management_permissive</name><value><boolean>0</boolean></value></member><member><name>redhat_management_server</name><value><string>xmlrpc.rhn.redhat.com</string></value></member><member><name>redhat_management_key</name><value><string></string></value></member><member><name>register_new_installs</name><value><boolean>0</boolean></value></member><member><name>remove_old_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>replicate_repo_rsync_options</name><value><string>-avzH</string></value></member><member><name>replicate_rsync_options</name><value><string>-avzH</string></value></member><member><name>reposync_flags</name><value><string>--newest-only --delete --refresh --remote-time</string></value></member><member><name>reposync_rsync_flags</name><value><string>-rltDv --copy-unsafe-links</string></value></member><member><name>restart_dhcp</name><value><boolean>1</boolean></value></member><member><name>restart_dns</name><value><boolean>1</boolean></value></member><member><name>run_install_triggers</name><value><boolean>1</boolean></value></member><member><name>scm_track_enabled</name><value><boolean>0</boolean></value></member><member><name>scm_track_mode</name><value><string>git</string></value></member><member><name>scm_track_author</name><value><string>cobbler &lt;cobbler@localhost&gt;</string></value></member><member><name>scm_push_script</name><value><string>/bin/true</string></value></member><member><name>serializer_pretty_json</name><value><boolean>0</boolean></value></member><member><name>server</name><value><string>192.168.1.1</string></value></member><member><name>sign_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>signature_path</name><value><string>/var/lib/cobbler/distro_signatures.json</string></value></member><member><name>signature_url</name><value><string>https://cobbler.github.io/signatures/3.0.x/latest.json</string></value></member><member><name>syslinux_dir</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_memdisk_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_pxelinux_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>tftpboot_location</name><value><string>/srv/tftpboot</string></value></member><member><name>virt_auto_boot</name><value><boolean>1</boolean></value></member><member><name>webdir</name><value><string>/srv/www/cobbler</string></value></member><member><name>webdir_whitelist</name><value><array><data><value><string>misc</string></value><value><string>web</string></value><value><string>webui</string></value><value><string>localmirror</string></value><value><string>repo_mirror</string></value><value><string>distro_mirror</string></value><value><string>images</string></value><value><string>links</string></value><value><string>pub</string></value><value><string>repo_profile</string></value><value><string>repo_system</string></value><value><string>svc</string></value><value><string>rendered</string></value><value><string>.link_cache</string></value></data></array></value></member><member><name>xmlrpc_port</name><value><int>25151</int></value></member><member><name>yum_distro_priority</name><value><int>1</int></value></member><member><name>yum_post_install_mirror</name><value><boolean>1</boolean></value></member><member><name>yumdownloader_flags</name><value><string>--resolve</string></value></member><member><name>windows_enabled</name><value><boolean>0</boolean></value></member><member><name>windows_template_dir</name><value><string>/etc/cobbler/windows</string></value></member><member><name>samba_distro_share</name><value><string>DISTRO</string></value></member><member><name>cache_enabled</name><value><boolean>1</boolean></value></member><member><name>auto_migrate_settings</name><value><boolean>0</boolean></value></member><member><name>bootloaders_formats</name><value><struct><member><name>aarch64</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member></struct></value></member><member><name>arm</name><value><struct><member><name>binary_name</name><value><string>bootarm.efi</string></value></member></struct></value></member><member><name>arm64-efi</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>efinet</string></value></data></array></value></member></struct></value></member><member><name>i386-efi</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>i386-pc-pxe</name><value><struct><member><name>binary_name</name><value><string>grub.0</string></value></member><member><name>mod_dir</name><value><string>i386-pc</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>pxe</string></value><value><string>biosdisk</string></value></data></array></value></member></struct></value></member><member><name>i686</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>IA64</name><value><struct><member><name>binary_name</name><value><string>bootia64.efi</string></value></member></struct></value></member><member><name>powerpc-ieee1275</name><value><struct><member><name>binary_name</name><value><string>grub.ppc64le</string></value></member><member><name>extra_modules</name><value><array><data><value><string>net</string></value><value><string>ofnet</string></value></data></array></value></member></struct></value></member><member><name>x86_64-efi</name><value><struct><member><name>binary_name</name><value><string>grubx64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>efinet</string></value></data></array></value></member></struct></value></member></struct></value></member><member><name>bootloaders_modules</name><value><array><data><value><string>btrfs</string></value><value><string>ext2</string></value><value><string>xfs</string></value><value><string>jfs</string></value><value><string>reiserfs</string></value><value><string>all_video</string></value><value><string>boot</string></value><value><string>cat</string></value><value><string>configfile</string></value><value><string>echo</string></value><value><string>fat</string></value><value><string>font</string></value><value><string>gfxmenu</string></value><value><string>gfxterm</string></value><value><string>gzio</string></value><value><string>halt</string></value><value><string>iso9660</string></value><value><string>jpeg</string></value><value><string>linux</string></value><value><string>loadenv</string></value><value><string>minicmd</string></value><value><string>normal</string></value><value><string>part_apple</string></value><value><string>part_gpt</string></value><value><string>part_msdos</string></value><value><string>password_pbkdf2</string></value><value><string>png</string></value><value><string>reboot</string></value><value><string>search</string></value><value><string>search_fs_file</string></value><value><string>search_fs_uuid</string></value><value><string>search_label</string></value><value><string>sleep</string></value><value><string>test</string></value><value><string>true</string></value><value><string>video</string></value><value><string>mdraid09</string></value><value><string>mdraid1x</string></value><value><string>lvm</string></value><value><string>serial</string></value><value><string>regexp</string></value><value><string>tr</string></value><value><string>tftp</string></value><value><string>http</string></value><value><string>luks</string></value><value><string>gcry_rijndael</string></value><value><string>gcry_sha1</string></value><value><string>gcry_sha256</string></value></data></array></value></member><member><name>grub2_mod_dir</name><value><string>/usr/share/grub2</string></value></member><member><name>lazy_start</name><value><boolean>0</boolean></value></member><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>2</int></value></member><member><name>ctime</name><value><double>1738747400.3610568</double></value></member><member><name>mtime</name><value><double>1738747400.3610568</double></value></member><member><name>uid</name><value><string>398b0b07578c46fabb23fd7dc1a9aa58</string></value></member><member><name>name</name><value><string>testsys</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options_post</name><value><string></string></value></member><member><name>autoinstall_meta</name><value><string></string></value></member><member><name>fetchable_files</name><value><string></string></value></member><member><name>boot_files</name><value><string></string></value></member><member><name>template_files</name><value><string></string></value></member><member><name>owners</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>tree_build_time</name><value><double>0.0</double></value></member><member><name>arch</name><value><string>x86_64</string></value></member><member><name>boot_loaders</name><value><array><data><value><string>grub</string></value><value><string>pxe</string></value><value><string>ipxe</string></value></data></array></value></member><member><name>breed</name><value><string></string></value></member><member><name>initrd</name><value><string>/root/initrd</string></value></member><member><name>kernel</name><value><string>/root/kernel</string></value></member><member><name>os_version</name><value><string></string></value></member><member><name>source_repos</name><value><array><data></data></array></value></member><member><name>remote_boot_kernel</name><value><string></string></value></member><member><name>remote_boot_initrd</name><value><string></string></value></member><member><name>dhcp_tag</name><value><string></string></value></member><member><name>distro</name><value><string>test</string></value></member><member><name>name_servers</name><value><array><data></data></array></value></member><member><name>name_servers_search</name><value><array><data></data></array></value></member><member><name>filename</name><value><string></string></value></member><member><name>proxy</name><value><string></string></value></member><member><name>repos</name><value><string></string></value></member><member><name>menu</name><value><string></string></value></member><member><name>virt_bridge</name><value><string>xenbr0</string></value></member><member><name>virt_cpus</name><value><int>1</int></value></member><member><name>virt_disk_driver</name><value><string>raw</string></value></member><member><name>virt_file_size</name><value><double>5.0</double></value></member><member><name>virt_path</name><value><string></string></value></member><member><name>virt_ram</name><value><int>512</int></value></member><member><name>virt_type</name><value><string>xenpv</string></value></member><member><name>interfaces</name><value><struct><member><name>default</name><value><struct><member><name>bonding_opts</name><value><string></string></value></member><member><name>bridge_opts</name><value><string></string></value></member><member><name>cnames</name><value><array><data></data></array></value></member><member><name>connected_mode</name><value><boolean>0</boolean></value></member><member><name>dhcp_tag</name><value><string></string></value></member><member><name>dns_name</name><value><string></string></value></member><member><name>if_gateway</name><value><string></string></value></member><member><name>interface_master</name><value><string></string></value></member><member><name>interface_type</name><value><string>na</string></value></member><member><name>ip_address</name><value><string></string></value></member><member><name>ipv6_address</name><value><string></string></value></member><member><name>ipv6_default_gateway</name><value><string></string></value></member><member><name>ipv6_mtu</name><value><string></string></value></member><member><name>ipv6_prefix</name><value><string></string></value></member><member><name>ipv6_secondaries</name><value><array><data></data></array></value></member><member><name>ipv6_static_routes</name><value><array><data></data></array></value></member><member><name>mac_address</name><value><string></string></value></member><member><name>management</name><value><boolean>0</boolean></value></member><member><name>mtu</name><value><string></string></value></member><member><name>netmask</name><value><string></string></value></member><member><name>static</name><value><boolean>0</boolean></value></member><member><name>static_routes</name><value><array><data></data></array></value></member><member><name>virt_bridge</name><value><string></string></value></member></struct></value></member></struct></value></member><member><name>ipv6_autoconfiguration</name><value><boolean>0</boolean></value></member><member><name>repos_enabled</name><value><boolean>0</boolean></value></member><member><name>gateway</name><value><string></string></value></member><member><name>hostname</name><value><string></string></value></member><member><name>image</name><value><string></string></value></member><member><name>ipv6_default_device</name><value><string></string></value></member><member><name>netboot_enabled</name><value><boolean>0</boolean></value></member><member><name>power_address</name><value><string></string></value></member><member><name>power_id</name><value><string></string></value></member><member><name>power_pass</name><value><string></string></value></member><member><name>power_type</name><value><string></string></value></member><member><name>power_user</name><value><string></string></value></member><member><name>power_options</name><value><string></string></value></member><member><name>power_identity_file</name><value><string></string></value></member><member><name>profile</name><value><string>testprof</string></value></member><member><name>status</name><value><string></string></value></member><member><name>virt_pxe_boot</name><value><boolean>0</boolean></value></member><member><name>serial_device</name><value><int>-1</int></value></member><member><name>serial_baud_rate</name><value><int>-1</int></value></member><member><name>bonding_opts_default</name><value><string></string></value></member><member><name>bridge_opts_default</name><value><string></string></value></member><member><name>cnames_default</name><value><array><data></data></array></value></member><member><name>connected_mode_default</name><value><boolean>0</boolean></value></member><member><name>dhcp_tag_default</name><value><string></string></value></member><member><name>dns_name_default</name><value><string></string></value></member><member><name>if_gateway_default</name><value><string></string></value></member><member><name>interface_master_default</name><value><string></string></value></member><member><name>interface_type_default</name><value><string>na</string></value></member><member><name>ip_address_default</name><value><string></string></value></member><member><name>ipv6_address_default</name><value><string></string></value></member><member><name>ipv6_default_gateway_default</name><value><string></string></value></member><member><name>ipv6_mtu_default</name><value><string></string></value></member><member><name>ipv6_prefix_default</name><value><string></string></value></member><member><name>ipv6_secondaries_default</name><value><array><data></data></array></value></member><member><name>ipv6_static_routes_default</name><value><array><data></data></array></value></member><member><name>mac_address_default</name><value><string></string></value></member><member><name>management_default</name><value><boolean>0</boolean></value></member><member><name>mtu_default</name><value><string></string></value></member><member><name>netmask_default</name><value><string></string></value></member><member><name>static_default</name><value><boolean>0</boolean></value></member><member><name>static_routes_default</name><value><array><data></data></array></value></member><member><name>virt_bridge_default</name><value><string></string></value></member><member><name>repo_data</name><value><array><data></data></array></value></member><member><name>http_server</name><value><string>192.168.1.1</string></value></member><member><name>system_name</name><value><string>testsys</string></value></member><member><name>profile_name</name><value><string>testprof</string></value></member><member><name>distro_name</name><value><string>test</string></value></member></struct></value></param></params></methodResponse>`;
    service.get_system_as_rendered('', '').subscribe((value) => {
      const rendered = value as Record<string, any>;
      expect(Object.keys(rendered).length).toEqual(220);
      expect(rendered['name']).toBe('testsys');
      expect(rendered['build_reporting_smtp_server']).toBe('localhost');
      // A struct nested two levels deep is recursively converted into a plain object as well.
      expect(rendered['bootloaders_formats']['arm64-efi']).toEqual({
        binary_name: 'grubaa64.efi',
        extra_modules: ['efinet'],
      });
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_repo_as_rendered action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>allow_duplicate_hostnames</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_ips</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_macs</name><value><boolean>0</boolean></value></member><member><name>allow_dynamic_settings</name><value><boolean>0</boolean></value></member><member><name>always_write_dhcp_entries</name><value><boolean>0</boolean></value></member><member><name>anamon_enabled</name><value><boolean>0</boolean></value></member><member><name>auth_token_expiration</name><value><int>3600</int></value></member><member><name>authn_pam_service</name><value><string>login</string></value></member><member><name>autoinstall_snippets_dir</name><value><string>/var/lib/cobbler/snippets</string></value></member><member><name>autoinstall_templates_dir</name><value><string>/var/lib/cobbler/templates</string></value></member><member><name>bind_chroot_path</name><value><string></string></value></member><member><name>bind_zonefile_path</name><value><string>/var/lib/named</string></value></member><member><name>bind_master</name><value><string>127.0.0.1</string></value></member><member><name>boot_loader_conf_template_dir</name><value><string>/etc/cobbler/boot_loader_conf</string></value></member><member><name>bootloaders_dir</name><value><string>/var/lib/cobbler/loaders</string></value></member><member><name>bootloaders_shim_folder</name><value><string>/usr/share/efi/*/</string></value></member><member><name>bootloaders_shim_file</name><value><string>shim\\.efi</string></value></member><member><name>bootloaders_ipxe_folder</name><value><string>/usr/share/ipxe/</string></value></member><member><name>grubconfig_dir</name><value><string>/var/lib/cobbler/grub_config</string></value></member><member><name>build_reporting_enabled</name><value><boolean>0</boolean></value></member><member><name>build_reporting_email</name><value><array><data><value><string>root@localhost</string></value></data></array></value></member><member><name>build_reporting_ignorelist</name><value><array><data></data></array></value></member><member><name>build_reporting_sender</name><value><string></string></value></member><member><name>build_reporting_smtp_server</name><value><string>localhost</string></value></member><member><name>build_reporting_subject</name><value><string></string></value></member><member><name>buildisodir</name><value><string>/var/cache/cobbler/buildiso</string></value></member><member><name>cheetah_import_whitelist</name><value><array><data><value><string>random</string></value><value><string>re</string></value><value><string>time</string></value><value><string>netaddr</string></value></data></array></value></member><member><name>client_use_https</name><value><boolean>0</boolean></value></member><member><name>client_use_localhost</name><value><boolean>0</boolean></value></member><member><name>cobbler_master</name><value><string></string></value></member><member><name>convert_server_to_ip</name><value><boolean>0</boolean></value></member><member><name>createrepo_flags</name><value><string>-c cache -s sha</string></value></member><member><name>autoinstall</name><value><string>default.ks</string></value></member><member><name>default_name_servers</name><value><array><data></data></array></value></member><member><name>default_name_servers_search</name><value><array><data></data></array></value></member><member><name>default_ownership</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>default_password_crypted</name><value><string>$1$mF86/UHC$WvcIcX2t6crBz2onWxyac.</string></value></member><member><name>default_template_type</name><value><string>cheetah</string></value></member><member><name>default_virt_bridge</name><value><string>xenbr0</string></value></member><member><name>default_virt_disk_driver</name><value><string>raw</string></value></member><member><name>default_virt_file_size</name><value><double>5.0</double></value></member><member><name>default_virt_ram</name><value><int>512</int></value></member><member><name>default_virt_type</name><value><string>xenpv</string></value></member><member><name>enable_ipxe</name><value><boolean>0</boolean></value></member><member><name>enable_menu</name><value><boolean>1</boolean></value></member><member><name>extra_settings_list</name><value><array><data></data></array></value></member><member><name>http_port</name><value><int>80</int></value></member><member><name>include</name><value><array><data><value><string>/etc/cobbler/settings.d/*.settings</string></value></data></array></value></member><member><name>iso_template_dir</name><value><string>/etc/cobbler/iso</string></value></member><member><name>jinja2_includedir</name><value><string>/var/lib/cobbler/jinja2</string></value></member><member><name>kernel_options</name><value><string></string></value></member><member><name>ldap_anonymous_bind</name><value><boolean>1</boolean></value></member><member><name>ldap_base_dn</name><value><string>DC=example,DC=com</string></value></member><member><name>ldap_port</name><value><int>389</int></value></member><member><name>ldap_search_bind_dn</name><value><string></string></value></member><member><name>ldap_search_passwd</name><value><string></string></value></member><member><name>ldap_search_prefix</name><value><string>uid=</string></value></member><member><name>ldap_server</name><value><string>ldap.example.com</string></value></member><member><name>ldap_tls</name><value><boolean>1</boolean></value></member><member><name>ldap_tls_cacertdir</name><value><string></string></value></member><member><name>ldap_tls_cacertfile</name><value><string></string></value></member><member><name>ldap_tls_certfile</name><value><string></string></value></member><member><name>ldap_tls_keyfile</name><value><string></string></value></member><member><name>ldap_tls_reqcert</name><value><string></string></value></member><member><name>ldap_tls_cipher_suite</name><value><string></string></value></member><member><name>bind_manage_ipmi</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp_v6</name><value><boolean>0</boolean></value></member><member><name>manage_dhcp_v4</name><value><boolean>1</boolean></value></member><member><name>manage_dns</name><value><boolean>0</boolean></value></member><member><name>manage_forward_zones</name><value><array><data></data></array></value></member><member><name>manage_reverse_zones</name><value><array><data></data></array></value></member><member><name>manage_genders</name><value><boolean>0</boolean></value></member><member><name>manage_rsync</name><value><boolean>0</boolean></value></member><member><name>manage_tftpd</name><value><boolean>1</boolean></value></member><member><name>next_server_v4</name><value><string>192.168.1.1</string></value></member><member><name>next_server_v6</name><value><string>::1</string></value></member><member><name>nsupdate_enabled</name><value><boolean>0</boolean></value></member><member><name>nsupdate_log</name><value><string>/var/log/cobbler/nsupdate.log</string></value></member><member><name>nsupdate_tsig_algorithm</name><value><string>hmac-sha512</string></value></member><member><name>nsupdate_tsig_key</name><value><array><data><value><string>cobbler_update_key.</string></value><value><string>hvnK54HFJXFasHjzjEn09ASIkCOGYSnofRq4ejsiBHz3udVyGiuebFGAswSjKUxNuhmllPrkI0HRSSmM2qvZug==</string></value></data></array></value></member><member><name>power_management_default_type</name><value><string>ipmilan</string></value></member><member><name>proxies</name><value><array><data></data></array></value></member><member><name>proxy_url_ext</name><value><string></string></value></member><member><name>proxy_url_int</name><value><string></string></value></member><member><name>puppet_auto_setup</name><value><boolean>0</boolean></value></member><member><name>puppet_parameterized_classes</name><value><boolean>1</boolean></value></member><member><name>puppet_server</name><value><string></string></value></member><member><name>puppet_version</name><value><int>2</int></value></member><member><name>puppetca_path</name><value><string>/usr/bin/puppet</string></value></member><member><name>pxe_just_once</name><value><boolean>1</boolean></value></member><member><name>nopxe_with_triggers</name><value><boolean>1</boolean></value></member><member><name>redhat_management_permissive</name><value><boolean>0</boolean></value></member><member><name>redhat_management_server</name><value><string>xmlrpc.rhn.redhat.com</string></value></member><member><name>redhat_management_key</name><value><string></string></value></member><member><name>register_new_installs</name><value><boolean>0</boolean></value></member><member><name>remove_old_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>replicate_repo_rsync_options</name><value><string>-avzH</string></value></member><member><name>replicate_rsync_options</name><value><string>-avzH</string></value></member><member><name>reposync_flags</name><value><string>--newest-only --delete --refresh --remote-time</string></value></member><member><name>reposync_rsync_flags</name><value><string>-rltDv --copy-unsafe-links</string></value></member><member><name>restart_dhcp</name><value><boolean>1</boolean></value></member><member><name>restart_dns</name><value><boolean>1</boolean></value></member><member><name>run_install_triggers</name><value><boolean>1</boolean></value></member><member><name>scm_track_enabled</name><value><boolean>0</boolean></value></member><member><name>scm_track_mode</name><value><string>git</string></value></member><member><name>scm_track_author</name><value><string>cobbler &lt;cobbler@localhost&gt;</string></value></member><member><name>scm_push_script</name><value><string>/bin/true</string></value></member><member><name>serializer_pretty_json</name><value><boolean>0</boolean></value></member><member><name>server</name><value><string>192.168.1.1</string></value></member><member><name>sign_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>signature_path</name><value><string>/var/lib/cobbler/distro_signatures.json</string></value></member><member><name>signature_url</name><value><string>https://cobbler.github.io/signatures/3.0.x/latest.json</string></value></member><member><name>syslinux_dir</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_memdisk_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_pxelinux_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>tftpboot_location</name><value><string>/srv/tftpboot</string></value></member><member><name>virt_auto_boot</name><value><boolean>1</boolean></value></member><member><name>webdir</name><value><string>/srv/www/cobbler</string></value></member><member><name>webdir_whitelist</name><value><array><data><value><string>misc</string></value><value><string>web</string></value><value><string>webui</string></value><value><string>localmirror</string></value><value><string>repo_mirror</string></value><value><string>distro_mirror</string></value><value><string>images</string></value><value><string>links</string></value><value><string>pub</string></value><value><string>repo_profile</string></value><value><string>repo_system</string></value><value><string>svc</string></value><value><string>rendered</string></value><value><string>.link_cache</string></value></data></array></value></member><member><name>xmlrpc_port</name><value><int>25151</int></value></member><member><name>yum_distro_priority</name><value><int>1</int></value></member><member><name>yum_post_install_mirror</name><value><boolean>1</boolean></value></member><member><name>yumdownloader_flags</name><value><string>--resolve</string></value></member><member><name>windows_enabled</name><value><boolean>0</boolean></value></member><member><name>windows_template_dir</name><value><string>/etc/cobbler/windows</string></value></member><member><name>samba_distro_share</name><value><string>DISTRO</string></value></member><member><name>cache_enabled</name><value><boolean>1</boolean></value></member><member><name>auto_migrate_settings</name><value><boolean>0</boolean></value></member><member><name>bootloaders_formats</name><value><struct><member><name>aarch64</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member></struct></value></member><member><name>arm</name><value><struct><member><name>binary_name</name><value><string>bootarm.efi</string></value></member></struct></value></member><member><name>arm64-efi</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>efinet</string></value></data></array></value></member></struct></value></member><member><name>i386-efi</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>i386-pc-pxe</name><value><struct><member><name>binary_name</name><value><string>grub.0</string></value></member><member><name>mod_dir</name><value><string>i386-pc</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>pxe</string></value><value><string>biosdisk</string></value></data></array></value></member></struct></value></member><member><name>i686</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>IA64</name><value><struct><member><name>binary_name</name><value><string>bootia64.efi</string></value></member></struct></value></member><member><name>powerpc-ieee1275</name><value><struct><member><name>binary_name</name><value><string>grub.ppc64le</string></value></member><member><name>extra_modules</name><value><array><data><value><string>net</string></value><value><string>ofnet</string></value></data></array></value></member></struct></value></member><member><name>x86_64-efi</name><value><struct><member><name>binary_name</name><value><string>grubx64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>efinet</string></value></data></array></value></member></struct></value></member></struct></value></member><member><name>bootloaders_modules</name><value><array><data><value><string>btrfs</string></value><value><string>ext2</string></value><value><string>xfs</string></value><value><string>jfs</string></value><value><string>reiserfs</string></value><value><string>all_video</string></value><value><string>boot</string></value><value><string>cat</string></value><value><string>configfile</string></value><value><string>echo</string></value><value><string>fat</string></value><value><string>font</string></value><value><string>gfxmenu</string></value><value><string>gfxterm</string></value><value><string>gzio</string></value><value><string>halt</string></value><value><string>iso9660</string></value><value><string>jpeg</string></value><value><string>linux</string></value><value><string>loadenv</string></value><value><string>minicmd</string></value><value><string>normal</string></value><value><string>part_apple</string></value><value><string>part_gpt</string></value><value><string>part_msdos</string></value><value><string>password_pbkdf2</string></value><value><string>png</string></value><value><string>reboot</string></value><value><string>search</string></value><value><string>search_fs_file</string></value><value><string>search_fs_uuid</string></value><value><string>search_label</string></value><value><string>sleep</string></value><value><string>test</string></value><value><string>true</string></value><value><string>video</string></value><value><string>mdraid09</string></value><value><string>mdraid1x</string></value><value><string>lvm</string></value><value><string>serial</string></value><value><string>regexp</string></value><value><string>tr</string></value><value><string>tftp</string></value><value><string>http</string></value><value><string>luks</string></value><value><string>gcry_rijndael</string></value><value><string>gcry_sha1</string></value><value><string>gcry_sha256</string></value></data></array></value></member><member><name>grub2_mod_dir</name><value><string>/usr/share/grub2</string></value></member><member><name>lazy_start</name><value><boolean>0</boolean></value></member><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1738747401.9789753</double></value></member><member><name>mtime</name><value><double>1738747401.9789753</double></value></member><member><name>uid</name><value><string>f95bb8c8925240ec9111bfba378b3a41</string></value></member><member><name>name</name><value><string>testrepo</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options_post</name><value><string></string></value></member><member><name>autoinstall_meta</name><value><string></string></value></member><member><name>fetchable_files</name><value><string></string></value></member><member><name>boot_files</name><value><string></string></value></member><member><name>template_files</name><value><string></string></value></member><member><name>owners</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>breed</name><value><string>none</string></value></member><member><name>arch</name><value><string>none</string></value></member><member><name>environment</name><value><string></string></value></member><member><name>yumopts</name><value><string></string></value></member><member><name>rsyncopts</name><value><struct></struct></value></member><member><name>mirror_type</name><value><string>baseurl</string></value></member><member><name>apt_components</name><value><array><data></data></array></value></member><member><name>apt_dists</name><value><array><data></data></array></value></member><member><name>keep_updated</name><value><boolean>0</boolean></value></member><member><name>mirror</name><value><string></string></value></member><member><name>mirror_locally</name><value><boolean>0</boolean></value></member><member><name>priority</name><value><int>0</int></value></member><member><name>proxy</name><value><string></string></value></member><member><name>rpm_list</name><value><string></string></value></member><member><name>os_version</name><value><string></string></value></member><member><name>http_server</name><value><string>192.168.1.1</string></value></member></struct></value></param></params></methodResponse>`;
    service.get_repo_as_rendered('', '').subscribe((value) => {
      const rendered = value as Record<string, any>;
      expect(Object.keys(rendered).length).toEqual(163);
      expect(rendered['name']).toBe('testrepo');
      expect(rendered['build_reporting_smtp_server']).toBe('localhost');
      // A struct nested two levels deep is recursively converted into a plain object as well.
      expect(rendered['bootloaders_formats']['arm64-efi']).toEqual({
        binary_name: 'grubaa64.efi',
        extra_modules: ['efinet'],
      });
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_image_as_rendered action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>allow_duplicate_hostnames</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_ips</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_macs</name><value><boolean>0</boolean></value></member><member><name>allow_dynamic_settings</name><value><boolean>0</boolean></value></member><member><name>always_write_dhcp_entries</name><value><boolean>0</boolean></value></member><member><name>anamon_enabled</name><value><boolean>0</boolean></value></member><member><name>auth_token_expiration</name><value><int>3600</int></value></member><member><name>authn_pam_service</name><value><string>login</string></value></member><member><name>autoinstall_snippets_dir</name><value><string>/var/lib/cobbler/snippets</string></value></member><member><name>autoinstall_templates_dir</name><value><string>/var/lib/cobbler/templates</string></value></member><member><name>bind_chroot_path</name><value><string></string></value></member><member><name>bind_zonefile_path</name><value><string>/var/lib/named</string></value></member><member><name>bind_master</name><value><string>127.0.0.1</string></value></member><member><name>boot_loader_conf_template_dir</name><value><string>/etc/cobbler/boot_loader_conf</string></value></member><member><name>bootloaders_dir</name><value><string>/var/lib/cobbler/loaders</string></value></member><member><name>bootloaders_shim_folder</name><value><string>/usr/share/efi/*/</string></value></member><member><name>bootloaders_shim_file</name><value><string>shim\\.efi</string></value></member><member><name>bootloaders_ipxe_folder</name><value><string>/usr/share/ipxe/</string></value></member><member><name>grubconfig_dir</name><value><string>/var/lib/cobbler/grub_config</string></value></member><member><name>build_reporting_enabled</name><value><boolean>0</boolean></value></member><member><name>build_reporting_email</name><value><array><data><value><string>root@localhost</string></value></data></array></value></member><member><name>build_reporting_ignorelist</name><value><array><data></data></array></value></member><member><name>build_reporting_sender</name><value><string></string></value></member><member><name>build_reporting_smtp_server</name><value><string>localhost</string></value></member><member><name>build_reporting_subject</name><value><string></string></value></member><member><name>buildisodir</name><value><string>/var/cache/cobbler/buildiso</string></value></member><member><name>cheetah_import_whitelist</name><value><array><data><value><string>random</string></value><value><string>re</string></value><value><string>time</string></value><value><string>netaddr</string></value></data></array></value></member><member><name>client_use_https</name><value><boolean>0</boolean></value></member><member><name>client_use_localhost</name><value><boolean>0</boolean></value></member><member><name>cobbler_master</name><value><string></string></value></member><member><name>convert_server_to_ip</name><value><boolean>0</boolean></value></member><member><name>createrepo_flags</name><value><string>-c cache -s sha</string></value></member><member><name>autoinstall</name><value><string>default.ks</string></value></member><member><name>default_name_servers</name><value><array><data></data></array></value></member><member><name>default_name_servers_search</name><value><array><data></data></array></value></member><member><name>default_ownership</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>default_password_crypted</name><value><string>$1$mF86/UHC$WvcIcX2t6crBz2onWxyac.</string></value></member><member><name>default_template_type</name><value><string>cheetah</string></value></member><member><name>default_virt_bridge</name><value><string>xenbr0</string></value></member><member><name>default_virt_disk_driver</name><value><string>raw</string></value></member><member><name>default_virt_file_size</name><value><double>5.0</double></value></member><member><name>default_virt_ram</name><value><int>512</int></value></member><member><name>default_virt_type</name><value><string>xenpv</string></value></member><member><name>enable_ipxe</name><value><boolean>0</boolean></value></member><member><name>enable_menu</name><value><boolean>1</boolean></value></member><member><name>extra_settings_list</name><value><array><data></data></array></value></member><member><name>http_port</name><value><int>80</int></value></member><member><name>include</name><value><array><data><value><string>/etc/cobbler/settings.d/*.settings</string></value></data></array></value></member><member><name>iso_template_dir</name><value><string>/etc/cobbler/iso</string></value></member><member><name>jinja2_includedir</name><value><string>/var/lib/cobbler/jinja2</string></value></member><member><name>kernel_options</name><value><string></string></value></member><member><name>ldap_anonymous_bind</name><value><boolean>1</boolean></value></member><member><name>ldap_base_dn</name><value><string>DC=example,DC=com</string></value></member><member><name>ldap_port</name><value><int>389</int></value></member><member><name>ldap_search_bind_dn</name><value><string></string></value></member><member><name>ldap_search_passwd</name><value><string></string></value></member><member><name>ldap_search_prefix</name><value><string>uid=</string></value></member><member><name>ldap_server</name><value><string>ldap.example.com</string></value></member><member><name>ldap_tls</name><value><boolean>1</boolean></value></member><member><name>ldap_tls_cacertdir</name><value><string></string></value></member><member><name>ldap_tls_cacertfile</name><value><string></string></value></member><member><name>ldap_tls_certfile</name><value><string></string></value></member><member><name>ldap_tls_keyfile</name><value><string></string></value></member><member><name>ldap_tls_reqcert</name><value><string></string></value></member><member><name>ldap_tls_cipher_suite</name><value><string></string></value></member><member><name>bind_manage_ipmi</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp_v6</name><value><boolean>0</boolean></value></member><member><name>manage_dhcp_v4</name><value><boolean>1</boolean></value></member><member><name>manage_dns</name><value><boolean>0</boolean></value></member><member><name>manage_forward_zones</name><value><array><data></data></array></value></member><member><name>manage_reverse_zones</name><value><array><data></data></array></value></member><member><name>manage_genders</name><value><boolean>0</boolean></value></member><member><name>manage_rsync</name><value><boolean>0</boolean></value></member><member><name>manage_tftpd</name><value><boolean>1</boolean></value></member><member><name>next_server_v4</name><value><string>192.168.1.1</string></value></member><member><name>next_server_v6</name><value><string>::1</string></value></member><member><name>nsupdate_enabled</name><value><boolean>0</boolean></value></member><member><name>nsupdate_log</name><value><string>/var/log/cobbler/nsupdate.log</string></value></member><member><name>nsupdate_tsig_algorithm</name><value><string>hmac-sha512</string></value></member><member><name>nsupdate_tsig_key</name><value><array><data><value><string>cobbler_update_key.</string></value><value><string>hvnK54HFJXFasHjzjEn09ASIkCOGYSnofRq4ejsiBHz3udVyGiuebFGAswSjKUxNuhmllPrkI0HRSSmM2qvZug==</string></value></data></array></value></member><member><name>power_management_default_type</name><value><string>ipmilan</string></value></member><member><name>proxies</name><value><array><data></data></array></value></member><member><name>proxy_url_ext</name><value><string></string></value></member><member><name>proxy_url_int</name><value><string></string></value></member><member><name>puppet_auto_setup</name><value><boolean>0</boolean></value></member><member><name>puppet_parameterized_classes</name><value><boolean>1</boolean></value></member><member><name>puppet_server</name><value><string></string></value></member><member><name>puppet_version</name><value><int>2</int></value></member><member><name>puppetca_path</name><value><string>/usr/bin/puppet</string></value></member><member><name>pxe_just_once</name><value><boolean>1</boolean></value></member><member><name>nopxe_with_triggers</name><value><boolean>1</boolean></value></member><member><name>redhat_management_permissive</name><value><boolean>0</boolean></value></member><member><name>redhat_management_server</name><value><string>xmlrpc.rhn.redhat.com</string></value></member><member><name>redhat_management_key</name><value><string></string></value></member><member><name>register_new_installs</name><value><boolean>0</boolean></value></member><member><name>remove_old_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>replicate_repo_rsync_options</name><value><string>-avzH</string></value></member><member><name>replicate_rsync_options</name><value><string>-avzH</string></value></member><member><name>reposync_flags</name><value><string>--newest-only --delete --refresh --remote-time</string></value></member><member><name>reposync_rsync_flags</name><value><string>-rltDv --copy-unsafe-links</string></value></member><member><name>restart_dhcp</name><value><boolean>1</boolean></value></member><member><name>restart_dns</name><value><boolean>1</boolean></value></member><member><name>run_install_triggers</name><value><boolean>1</boolean></value></member><member><name>scm_track_enabled</name><value><boolean>0</boolean></value></member><member><name>scm_track_mode</name><value><string>git</string></value></member><member><name>scm_track_author</name><value><string>cobbler &lt;cobbler@localhost&gt;</string></value></member><member><name>scm_push_script</name><value><string>/bin/true</string></value></member><member><name>serializer_pretty_json</name><value><boolean>0</boolean></value></member><member><name>server</name><value><string>192.168.1.1</string></value></member><member><name>sign_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>signature_path</name><value><string>/var/lib/cobbler/distro_signatures.json</string></value></member><member><name>signature_url</name><value><string>https://cobbler.github.io/signatures/3.0.x/latest.json</string></value></member><member><name>syslinux_dir</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_memdisk_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_pxelinux_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>tftpboot_location</name><value><string>/srv/tftpboot</string></value></member><member><name>virt_auto_boot</name><value><boolean>0</boolean></value></member><member><name>webdir</name><value><string>/srv/www/cobbler</string></value></member><member><name>webdir_whitelist</name><value><array><data><value><string>misc</string></value><value><string>web</string></value><value><string>webui</string></value><value><string>localmirror</string></value><value><string>repo_mirror</string></value><value><string>distro_mirror</string></value><value><string>images</string></value><value><string>links</string></value><value><string>pub</string></value><value><string>repo_profile</string></value><value><string>repo_system</string></value><value><string>svc</string></value><value><string>rendered</string></value><value><string>.link_cache</string></value></data></array></value></member><member><name>xmlrpc_port</name><value><int>25151</int></value></member><member><name>yum_distro_priority</name><value><int>1</int></value></member><member><name>yum_post_install_mirror</name><value><boolean>1</boolean></value></member><member><name>yumdownloader_flags</name><value><string>--resolve</string></value></member><member><name>windows_enabled</name><value><boolean>0</boolean></value></member><member><name>windows_template_dir</name><value><string>/etc/cobbler/windows</string></value></member><member><name>samba_distro_share</name><value><string>DISTRO</string></value></member><member><name>cache_enabled</name><value><boolean>1</boolean></value></member><member><name>auto_migrate_settings</name><value><boolean>0</boolean></value></member><member><name>bootloaders_formats</name><value><struct><member><name>aarch64</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member></struct></value></member><member><name>arm</name><value><struct><member><name>binary_name</name><value><string>bootarm.efi</string></value></member></struct></value></member><member><name>arm64-efi</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>efinet</string></value></data></array></value></member></struct></value></member><member><name>i386-efi</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>i386-pc-pxe</name><value><struct><member><name>binary_name</name><value><string>grub.0</string></value></member><member><name>mod_dir</name><value><string>i386-pc</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>pxe</string></value><value><string>biosdisk</string></value></data></array></value></member></struct></value></member><member><name>i686</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>IA64</name><value><struct><member><name>binary_name</name><value><string>bootia64.efi</string></value></member></struct></value></member><member><name>powerpc-ieee1275</name><value><struct><member><name>binary_name</name><value><string>grub.ppc64le</string></value></member><member><name>extra_modules</name><value><array><data><value><string>net</string></value><value><string>ofnet</string></value></data></array></value></member></struct></value></member><member><name>x86_64-efi</name><value><struct><member><name>binary_name</name><value><string>grubx64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>efinet</string></value></data></array></value></member></struct></value></member></struct></value></member><member><name>bootloaders_modules</name><value><array><data><value><string>btrfs</string></value><value><string>ext2</string></value><value><string>xfs</string></value><value><string>jfs</string></value><value><string>reiserfs</string></value><value><string>all_video</string></value><value><string>boot</string></value><value><string>cat</string></value><value><string>configfile</string></value><value><string>echo</string></value><value><string>fat</string></value><value><string>font</string></value><value><string>gfxmenu</string></value><value><string>gfxterm</string></value><value><string>gzio</string></value><value><string>halt</string></value><value><string>iso9660</string></value><value><string>jpeg</string></value><value><string>linux</string></value><value><string>loadenv</string></value><value><string>minicmd</string></value><value><string>normal</string></value><value><string>part_apple</string></value><value><string>part_gpt</string></value><value><string>part_msdos</string></value><value><string>password_pbkdf2</string></value><value><string>png</string></value><value><string>reboot</string></value><value><string>search</string></value><value><string>search_fs_file</string></value><value><string>search_fs_uuid</string></value><value><string>search_label</string></value><value><string>sleep</string></value><value><string>test</string></value><value><string>true</string></value><value><string>video</string></value><value><string>mdraid09</string></value><value><string>mdraid1x</string></value><value><string>lvm</string></value><value><string>serial</string></value><value><string>regexp</string></value><value><string>tr</string></value><value><string>tftp</string></value><value><string>http</string></value><value><string>luks</string></value><value><string>gcry_rijndael</string></value><value><string>gcry_sha1</string></value><value><string>gcry_sha256</string></value></data></array></value></member><member><name>grub2_mod_dir</name><value><string>/usr/share/grub2</string></value></member><member><name>lazy_start</name><value><boolean>0</boolean></value></member><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1738747402.5126426</double></value></member><member><name>mtime</name><value><double>1738757739.703153</double></value></member><member><name>uid</name><value><string>f78f7e42401543b5a52d403a09314a70</string></value></member><member><name>name</name><value><string>testimage</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options_post</name><value><string></string></value></member><member><name>autoinstall_meta</name><value><string></string></value></member><member><name>fetchable_files</name><value><string></string></value></member><member><name>boot_files</name><value><string></string></value></member><member><name>template_files</name><value><string></string></value></member><member><name>owners</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>arch</name><value><string>x86_64</string></value></member><member><name>breed</name><value><string></string></value></member><member><name>file</name><value><string></string></value></member><member><name>image_type</name><value><string>direct</string></value></member><member><name>network_count</name><value><int>0</int></value></member><member><name>os_version</name><value><string></string></value></member><member><name>boot_loaders</name><value><array><data></data></array></value></member><member><name>menu</name><value><string></string></value></member><member><name>virt_bridge</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>virt_cpus</name><value><int>1</int></value></member><member><name>virt_disk_driver</name><value><string>raw</string></value></member><member><name>virt_file_size</name><value><double>5.0</double></value></member><member><name>virt_path</name><value><string></string></value></member><member><name>virt_ram</name><value><int>512</int></value></member><member><name>virt_type</name><value><string>qemu</string></value></member><member><name>http_server</name><value><string>192.168.1.1</string></value></member><member><name>distro_name</name><value><string>N/A</string></value></member><member><name>image_name</name><value><string>testimage</string></value></member></struct></value></param></params></methodResponse>`;
    service.get_image_as_rendered('', '').subscribe((value) => {
      const rendered = value as Record<string, any>;
      expect(Object.keys(rendered).length).toEqual(165);
      expect(rendered['name']).toBe('testimage');
      expect(rendered['build_reporting_smtp_server']).toBe('localhost');
      // A struct nested two levels deep is recursively converted into a plain object as well.
      expect(rendered['bootloaders_formats']['arm64-efi']).toEqual({
        binary_name: 'grubaa64.efi',
        extra_modules: ['efinet'],
      });
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the get_menu_as_rendered action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>allow_duplicate_hostnames</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_ips</name><value><boolean>0</boolean></value></member><member><name>allow_duplicate_macs</name><value><boolean>0</boolean></value></member><member><name>allow_dynamic_settings</name><value><boolean>0</boolean></value></member><member><name>always_write_dhcp_entries</name><value><boolean>0</boolean></value></member><member><name>anamon_enabled</name><value><boolean>0</boolean></value></member><member><name>auth_token_expiration</name><value><int>3600</int></value></member><member><name>authn_pam_service</name><value><string>login</string></value></member><member><name>autoinstall_snippets_dir</name><value><string>/var/lib/cobbler/snippets</string></value></member><member><name>autoinstall_templates_dir</name><value><string>/var/lib/cobbler/templates</string></value></member><member><name>bind_chroot_path</name><value><string></string></value></member><member><name>bind_zonefile_path</name><value><string>/var/lib/named</string></value></member><member><name>bind_master</name><value><string>127.0.0.1</string></value></member><member><name>boot_loader_conf_template_dir</name><value><string>/etc/cobbler/boot_loader_conf</string></value></member><member><name>bootloaders_dir</name><value><string>/var/lib/cobbler/loaders</string></value></member><member><name>bootloaders_shim_folder</name><value><string>/usr/share/efi/*/</string></value></member><member><name>bootloaders_shim_file</name><value><string>shim\\.efi</string></value></member><member><name>bootloaders_ipxe_folder</name><value><string>/usr/share/ipxe/</string></value></member><member><name>grubconfig_dir</name><value><string>/var/lib/cobbler/grub_config</string></value></member><member><name>build_reporting_enabled</name><value><boolean>0</boolean></value></member><member><name>build_reporting_email</name><value><array><data><value><string>root@localhost</string></value></data></array></value></member><member><name>build_reporting_ignorelist</name><value><array><data></data></array></value></member><member><name>build_reporting_sender</name><value><string></string></value></member><member><name>build_reporting_smtp_server</name><value><string>localhost</string></value></member><member><name>build_reporting_subject</name><value><string></string></value></member><member><name>buildisodir</name><value><string>/var/cache/cobbler/buildiso</string></value></member><member><name>cheetah_import_whitelist</name><value><array><data><value><string>random</string></value><value><string>re</string></value><value><string>time</string></value><value><string>netaddr</string></value></data></array></value></member><member><name>client_use_https</name><value><boolean>0</boolean></value></member><member><name>client_use_localhost</name><value><boolean>0</boolean></value></member><member><name>cobbler_master</name><value><string></string></value></member><member><name>convert_server_to_ip</name><value><boolean>0</boolean></value></member><member><name>createrepo_flags</name><value><string>-c cache -s sha</string></value></member><member><name>autoinstall</name><value><string>default.ks</string></value></member><member><name>default_name_servers</name><value><array><data></data></array></value></member><member><name>default_name_servers_search</name><value><array><data></data></array></value></member><member><name>default_ownership</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>default_password_crypted</name><value><string>$1$mF86/UHC$WvcIcX2t6crBz2onWxyac.</string></value></member><member><name>default_template_type</name><value><string>cheetah</string></value></member><member><name>default_virt_bridge</name><value><string>xenbr0</string></value></member><member><name>default_virt_disk_driver</name><value><string>raw</string></value></member><member><name>default_virt_file_size</name><value><double>5.0</double></value></member><member><name>default_virt_ram</name><value><int>512</int></value></member><member><name>default_virt_type</name><value><string>xenpv</string></value></member><member><name>enable_ipxe</name><value><boolean>0</boolean></value></member><member><name>enable_menu</name><value><boolean>1</boolean></value></member><member><name>extra_settings_list</name><value><array><data></data></array></value></member><member><name>http_port</name><value><int>80</int></value></member><member><name>include</name><value><array><data><value><string>/etc/cobbler/settings.d/*.settings</string></value></data></array></value></member><member><name>iso_template_dir</name><value><string>/etc/cobbler/iso</string></value></member><member><name>jinja2_includedir</name><value><string>/var/lib/cobbler/jinja2</string></value></member><member><name>kernel_options</name><value><string></string></value></member><member><name>ldap_anonymous_bind</name><value><boolean>1</boolean></value></member><member><name>ldap_base_dn</name><value><string>DC=example,DC=com</string></value></member><member><name>ldap_port</name><value><int>389</int></value></member><member><name>ldap_search_bind_dn</name><value><string></string></value></member><member><name>ldap_search_passwd</name><value><string></string></value></member><member><name>ldap_search_prefix</name><value><string>uid=</string></value></member><member><name>ldap_server</name><value><string>ldap.example.com</string></value></member><member><name>ldap_tls</name><value><boolean>1</boolean></value></member><member><name>ldap_tls_cacertdir</name><value><string></string></value></member><member><name>ldap_tls_cacertfile</name><value><string></string></value></member><member><name>ldap_tls_certfile</name><value><string></string></value></member><member><name>ldap_tls_keyfile</name><value><string></string></value></member><member><name>ldap_tls_reqcert</name><value><string></string></value></member><member><name>ldap_tls_cipher_suite</name><value><string></string></value></member><member><name>bind_manage_ipmi</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp</name><value><boolean>1</boolean></value></member><member><name>manage_dhcp_v6</name><value><boolean>0</boolean></value></member><member><name>manage_dhcp_v4</name><value><boolean>1</boolean></value></member><member><name>manage_dns</name><value><boolean>0</boolean></value></member><member><name>manage_forward_zones</name><value><array><data></data></array></value></member><member><name>manage_reverse_zones</name><value><array><data></data></array></value></member><member><name>manage_genders</name><value><boolean>0</boolean></value></member><member><name>manage_rsync</name><value><boolean>0</boolean></value></member><member><name>manage_tftpd</name><value><boolean>1</boolean></value></member><member><name>next_server_v4</name><value><string>192.168.1.1</string></value></member><member><name>next_server_v6</name><value><string>::1</string></value></member><member><name>nsupdate_enabled</name><value><boolean>0</boolean></value></member><member><name>nsupdate_log</name><value><string>/var/log/cobbler/nsupdate.log</string></value></member><member><name>nsupdate_tsig_algorithm</name><value><string>hmac-sha512</string></value></member><member><name>nsupdate_tsig_key</name><value><array><data><value><string>cobbler_update_key.</string></value><value><string>hvnK54HFJXFasHjzjEn09ASIkCOGYSnofRq4ejsiBHz3udVyGiuebFGAswSjKUxNuhmllPrkI0HRSSmM2qvZug==</string></value></data></array></value></member><member><name>power_management_default_type</name><value><string>ipmilan</string></value></member><member><name>proxies</name><value><array><data></data></array></value></member><member><name>proxy_url_ext</name><value><string></string></value></member><member><name>proxy_url_int</name><value><string></string></value></member><member><name>puppet_auto_setup</name><value><boolean>0</boolean></value></member><member><name>puppet_parameterized_classes</name><value><boolean>1</boolean></value></member><member><name>puppet_server</name><value><string></string></value></member><member><name>puppet_version</name><value><int>2</int></value></member><member><name>puppetca_path</name><value><string>/usr/bin/puppet</string></value></member><member><name>pxe_just_once</name><value><boolean>1</boolean></value></member><member><name>nopxe_with_triggers</name><value><boolean>1</boolean></value></member><member><name>redhat_management_permissive</name><value><boolean>0</boolean></value></member><member><name>redhat_management_server</name><value><string>xmlrpc.rhn.redhat.com</string></value></member><member><name>redhat_management_key</name><value><string></string></value></member><member><name>register_new_installs</name><value><boolean>0</boolean></value></member><member><name>remove_old_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>replicate_repo_rsync_options</name><value><string>-avzH</string></value></member><member><name>replicate_rsync_options</name><value><string>-avzH</string></value></member><member><name>reposync_flags</name><value><string>--newest-only --delete --refresh --remote-time</string></value></member><member><name>reposync_rsync_flags</name><value><string>-rltDv --copy-unsafe-links</string></value></member><member><name>restart_dhcp</name><value><boolean>1</boolean></value></member><member><name>restart_dns</name><value><boolean>1</boolean></value></member><member><name>run_install_triggers</name><value><boolean>1</boolean></value></member><member><name>scm_track_enabled</name><value><boolean>0</boolean></value></member><member><name>scm_track_mode</name><value><string>git</string></value></member><member><name>scm_track_author</name><value><string>cobbler &lt;cobbler@localhost&gt;</string></value></member><member><name>scm_push_script</name><value><string>/bin/true</string></value></member><member><name>serializer_pretty_json</name><value><boolean>0</boolean></value></member><member><name>server</name><value><string>192.168.1.1</string></value></member><member><name>sign_puppet_certs_automatically</name><value><boolean>0</boolean></value></member><member><name>signature_path</name><value><string>/var/lib/cobbler/distro_signatures.json</string></value></member><member><name>signature_url</name><value><string>https://cobbler.github.io/signatures/3.0.x/latest.json</string></value></member><member><name>syslinux_dir</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_memdisk_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>syslinux_pxelinux_folder</name><value><string>/usr/share/syslinux</string></value></member><member><name>tftpboot_location</name><value><string>/srv/tftpboot</string></value></member><member><name>virt_auto_boot</name><value><boolean>1</boolean></value></member><member><name>webdir</name><value><string>/srv/www/cobbler</string></value></member><member><name>webdir_whitelist</name><value><array><data><value><string>misc</string></value><value><string>web</string></value><value><string>webui</string></value><value><string>localmirror</string></value><value><string>repo_mirror</string></value><value><string>distro_mirror</string></value><value><string>images</string></value><value><string>links</string></value><value><string>pub</string></value><value><string>repo_profile</string></value><value><string>repo_system</string></value><value><string>svc</string></value><value><string>rendered</string></value><value><string>.link_cache</string></value></data></array></value></member><member><name>xmlrpc_port</name><value><int>25151</int></value></member><member><name>yum_distro_priority</name><value><int>1</int></value></member><member><name>yum_post_install_mirror</name><value><boolean>1</boolean></value></member><member><name>yumdownloader_flags</name><value><string>--resolve</string></value></member><member><name>windows_enabled</name><value><boolean>0</boolean></value></member><member><name>windows_template_dir</name><value><string>/etc/cobbler/windows</string></value></member><member><name>samba_distro_share</name><value><string>DISTRO</string></value></member><member><name>cache_enabled</name><value><boolean>1</boolean></value></member><member><name>auto_migrate_settings</name><value><boolean>0</boolean></value></member><member><name>bootloaders_formats</name><value><struct><member><name>aarch64</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member></struct></value></member><member><name>arm</name><value><struct><member><name>binary_name</name><value><string>bootarm.efi</string></value></member></struct></value></member><member><name>arm64-efi</name><value><struct><member><name>binary_name</name><value><string>grubaa64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>efinet</string></value></data></array></value></member></struct></value></member><member><name>i386-efi</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>i386-pc-pxe</name><value><struct><member><name>binary_name</name><value><string>grub.0</string></value></member><member><name>mod_dir</name><value><string>i386-pc</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>pxe</string></value><value><string>biosdisk</string></value></data></array></value></member></struct></value></member><member><name>i686</name><value><struct><member><name>binary_name</name><value><string>bootia32.efi</string></value></member></struct></value></member><member><name>IA64</name><value><struct><member><name>binary_name</name><value><string>bootia64.efi</string></value></member></struct></value></member><member><name>powerpc-ieee1275</name><value><struct><member><name>binary_name</name><value><string>grub.ppc64le</string></value></member><member><name>extra_modules</name><value><array><data><value><string>net</string></value><value><string>ofnet</string></value></data></array></value></member></struct></value></member><member><name>x86_64-efi</name><value><struct><member><name>binary_name</name><value><string>grubx64.efi</string></value></member><member><name>extra_modules</name><value><array><data><value><string>chain</string></value><value><string>efinet</string></value></data></array></value></member></struct></value></member></struct></value></member><member><name>bootloaders_modules</name><value><array><data><value><string>btrfs</string></value><value><string>ext2</string></value><value><string>xfs</string></value><value><string>jfs</string></value><value><string>reiserfs</string></value><value><string>all_video</string></value><value><string>boot</string></value><value><string>cat</string></value><value><string>configfile</string></value><value><string>echo</string></value><value><string>fat</string></value><value><string>font</string></value><value><string>gfxmenu</string></value><value><string>gfxterm</string></value><value><string>gzio</string></value><value><string>halt</string></value><value><string>iso9660</string></value><value><string>jpeg</string></value><value><string>linux</string></value><value><string>loadenv</string></value><value><string>minicmd</string></value><value><string>normal</string></value><value><string>part_apple</string></value><value><string>part_gpt</string></value><value><string>part_msdos</string></value><value><string>password_pbkdf2</string></value><value><string>png</string></value><value><string>reboot</string></value><value><string>search</string></value><value><string>search_fs_file</string></value><value><string>search_fs_uuid</string></value><value><string>search_label</string></value><value><string>sleep</string></value><value><string>test</string></value><value><string>true</string></value><value><string>video</string></value><value><string>mdraid09</string></value><value><string>mdraid1x</string></value><value><string>lvm</string></value><value><string>serial</string></value><value><string>regexp</string></value><value><string>tr</string></value><value><string>tftp</string></value><value><string>http</string></value><value><string>luks</string></value><value><string>gcry_rijndael</string></value><value><string>gcry_sha1</string></value><value><string>gcry_sha256</string></value></data></array></value></member><member><name>grub2_mod_dir</name><value><string>/usr/share/grub2</string></value></member><member><name>lazy_start</name><value><boolean>0</boolean></value></member><member><name>parent</name><value><string></string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>ctime</name><value><double>1738747402.2400913</double></value></member><member><name>mtime</name><value><double>1738747402.2400913</double></value></member><member><name>uid</name><value><string>0efff3e820bc489bb7ad10cc37cd53a8</string></value></member><member><name>name</name><value><string>testmenu</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel_options_post</name><value><string></string></value></member><member><name>autoinstall_meta</name><value><string></string></value></member><member><name>fetchable_files</name><value><string></string></value></member><member><name>boot_files</name><value><string></string></value></member><member><name>template_files</name><value><string></string></value></member><member><name>owners</name><value><array><data><value><string>admin</string></value></data></array></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>display_name</name><value><string></string></value></member><member><name>ks_meta</name><value><struct></struct></value></member><member><name>http_server</name><value><string>192.168.1.1</string></value></member></struct></value></param></params></methodResponse>`;
    service.get_menu_as_rendered('', '').subscribe((value) => {
      const rendered = value as Record<string, any>;
      expect(Object.keys(rendered).length).toEqual(150);
      expect(rendered['name']).toBe('testmenu');
      expect(rendered['build_reporting_smtp_server']).toBe('localhost');
      // A struct nested two levels deep is recursively converted into a plain object as well.
      expect(rendered['bootloaders_formats']['arm64-efi']).toEqual({
        binary_name: 'grubaa64.efi',
        extra_modules: ['efinet'],
      });
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the get_random_mac action on the Cobbler Server', () => {
    service.get_random_mac('', '');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the xmlrpc_hacks action on the Cobbler Server', () => {
    service.xmlrpc_hacks(undefined);
    expect(service).toBeFalsy();
  });

  it('should execute the get_status action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>127.0.0.1</name><value><array><data><value><double>1720873663.7566895</double></value><value><double>1720873696.675196</double></value><value><string>system:testsys</string></value><value><int>1</int></value><value><int>2</int></value><value><string>finished</string></value></data></array></value></member></struct></value></param></params></methodResponse>`;

    const result: Array<InstallationStatus> = [
      {
        ip: '127.0.0.1',
        mostRecentStart: 1720873663.7566895,
        mostRecentStop: 1720873696.675196,
        mostRecentTarget: 'system:testsys',
        seenStart: 1,
        seenStop: 2,
        state: 'finished',
      },
    ];
    service
      .get_status('normal', 'alksjdbskjdbakljdbsaajkiuhgzulnbgtz')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the check_access_no_fail action on the Cobbler Server', () => {
    service.check_access_no_fail('', '', undefined, undefined);
    expect(service).toBeFalsy();
  });

  it.skip('should execute the check_access action on the Cobbler Server', () => {
    service.check_access('', '', undefined, undefined);
    expect(service).toBeFalsy();
  });

  it.skip('should execute the get_authn_module_name action on the Cobbler Server', () => {
    service.get_authn_module_name('');
    expect(service).toBeFalsy();
  });

  it('should execute the login action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>alksjdbskjdbakljdbsaajkiuhgzulnbgtz=</string></value></param></params></methodResponse>`;

    const result = 'alksjdbskjdbakljdbsaajkiuhgzulnbgtz=';
    service.login('cobbler', 'cobbler').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the logout action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

    const result = true;
    service
      .logout('alksjdbskjdbakljdbsaajkiuhgzulnbgtz=')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the token_check action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

    const result = true;
    service
      .token_check('alksjdbskjdbakljdbsaajkiuhgzulnbgtz=')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the sync_dhcp action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

    const result = true;
    service
      .sync_dhcp('alksjdbskjdbakljdbsaajkiuhgzulnbgtz=')
      .subscribe((value) => {
        expect(value).toEqual(result);
      });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it('should execute the sync action on the Cobbler Server', async () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

    const result = true;
    service.sync('alksjdbskjdbakljdbsaajkiuhgzulnbgtz=').subscribe((value) => {
      expect(value).toEqual(result);
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  });

  it.skip('should execute the get_config_data action on the Cobbler Server', () => {
    service.get_config_data('');
    expect(service).toBeFalsy();
  });

  it.skip('should execute the clear_system_logs action on the Cobbler Server', () => {
    service.clear_system_logs('', '');
    expect(service).toBeFalsy();
  });
});

/**
 * Regression tests for the outbound (request) direction of the XML-RPC bridge.
 *
 * These tests deliberately use the REAL ``AngularXmlrpcService`` (not a spy or a stub) together with
 * ``provideHttpClientTesting()``. ``AngularXmlrpcService.methodCall()`` calls ``serializeMethodCall()``
 * synchronously - before the ``HttpClient`` call and before the returned ``Observable`` is even created - so the real
 * serializer runs inside the ``service.<method>(...)`` invocation itself. A serialization failure therefore surfaces
 * as a synchronous ``throw`` out of the service method (and would also make ``httpTestingController.expectOne()``
 * fail, since no request would ever be issued). Only the HTTP transport is mocked; nothing between the caller and
 * ``serializeMethodCall()`` is.
 */
describe('CobblerApiService outbound XML-RPC serialization', () => {
  let service: CobblerApiService;
  let httpTestingController: HttpTestingController;

  const emptyArrayResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data></data></array></value></param></params></methodResponse>`;
  const trueResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
  const taskIdResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>2026-08-24_120000_Syncsystems</string></value></param></params></methodResponse>`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: AngularXmlrpcService,
          useClass: AngularXmlrpcService,
        },
        {
          provide: CobblerApiService,
          deps: [AngularXmlrpcService, COBBLER_URL],
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CobblerApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  /**
   * Parses the captured request body and asserts that it is well-formed XML.
   */
  function parseRequestBody(body: string): Document {
    expect(typeof body).toEqual('string');
    const document = new DOMParser().parseFromString(body, 'text/xml');
    expect(document.getElementsByTagName('parsererror').length).toEqual(0);
    return document;
  }

  /**
   * Returns the ``<value>`` element of the n-th ``<param>`` of a serialized ``<methodCall>``.
   */
  function paramValue(document: Document, index: number): Element {
    const params = document.getElementsByTagName('param');
    expect(params.length).toBeGreaterThan(index);
    const value = params[index].firstElementChild;
    expect(value).not.toBeNull();
    expect(value?.tagName).toEqual('value');
    return value as Element;
  }

  /**
   * Turns a serialized ``<struct>`` element back into a plain object so that the assertions stay readable. Only the
   * scalar types that the tests below use are supported.
   */
  function structToObject(struct: Element): Record<string, any> {
    expect(struct.tagName).toEqual('struct');
    const result: Record<string, any> = {};
    for (const member of Array.from(struct.children)) {
      expect(member.tagName).toEqual('member');
      const name = member.getElementsByTagName('name')[0].textContent as string;
      const value = member.getElementsByTagName('value')[0];
      result[name] = valueToJs(value);
    }
    return result;
  }

  function valueToJs(value: Element): any {
    const typed = value.firstElementChild as Element;
    switch (typed.tagName) {
      case 'string':
        return typed.textContent ?? '';
      case 'int':
        return Number(typed.textContent);
      case 'double':
        return Number(typed.textContent);
      case 'boolean':
        return typed.textContent === '1';
      case 'struct':
        return structToObject(typed);
      case 'array':
        return Array.from(typed.getElementsByTagName('data')[0].children).map(
          (element) => valueToJs(element),
        );
      default:
        throw new Error(`Unsupported value type "${typed.tagName}"`);
    }
  }

  it('serializes a plain object criteria of find_network_interface as an XML-RPC struct', () => {
    // This is exactly what network-interface-edit.component.ts and network-interface-overview.component.ts pass.
    let subscribed = false;
    service
      .find_network_interface({ system_uid: 'some-uid' }, true, false, 'token')
      .subscribe(() => {
        subscribed = true;
      });

    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    const document = parseRequestBody(mockRequest.request.body);
    expect(document.getElementsByTagName('methodName')[0].textContent).toEqual(
      'find_network_interface',
    );
    const criteria = paramValue(document, 0).firstElementChild as Element;
    expect(criteria.tagName).toEqual('struct');
    expect(structToObject(criteria)).toEqual({ system_uid: 'some-uid' });
    // The remaining parameters must be untouched.
    expect(valueToJs(paramValue(document, 1))).toEqual(true);
    expect(valueToJs(paramValue(document, 2))).toEqual(false);
    expect(valueToJs(paramValue(document, 3))).toEqual('token');

    mockRequest.flush(emptyArrayResponse);
    expect(subscribed).toEqual(true);
  });

  it('serializes a plain object arg of modify_profile as an XML-RPC struct', () => {
    // This is what KeyValueEditorComponent produces for kernel_options / autoinstall_meta / ... since Task 7.
    service
      .modify_profile(
        'profile-uid',
        ['kernel_options'],
        { kernel_option_key: 'value', another: 'second' },
        'token',
      )
      .subscribe();

    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    const document = parseRequestBody(mockRequest.request.body);
    expect(document.getElementsByTagName('methodName')[0].textContent).toEqual(
      'modify_profile',
    );
    expect(valueToJs(paramValue(document, 0))).toEqual('profile-uid');
    expect(valueToJs(paramValue(document, 1))).toEqual(['kernel_options']);
    expect(valueToJs(paramValue(document, 2))).toEqual({
      kernel_option_key: 'value',
      another: 'second',
    });
    expect(valueToJs(paramValue(document, 3))).toEqual('token');

    mockRequest.flush(trueResponse);
  });

  it('serializes nested plain objects, arrays and mixed scalars of a modify_item arg', () => {
    service
      .modify_item(
        'system',
        'system-uid',
        ['interfaces'],
        {
          eth0: {
            mac_address: 'aa:bb:cc:dd:ee:ff',
            static: true,
            ipv4: { address: '192.168.1.2', mtu: 1500 },
            static_routes: ['a', 'b'],
          },
        },
        'token',
      )
      .subscribe();

    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    const document = parseRequestBody(mockRequest.request.body);
    expect(valueToJs(paramValue(document, 3))).toEqual({
      eth0: {
        mac_address: 'aa:bb:cc:dd:ee:ff',
        static: true,
        ipv4: { address: '192.168.1.2', mtu: 1500 },
        static_routes: ['a', 'b'],
      },
    });

    mockRequest.flush(trueResponse);
  });

  it('keeps working for an argument that is already a Map (no double conversion)', () => {
    const criteria = new Map<string, any>([
      ['name', 'test-distro'],
      ['arch', 'x86_64'],
    ]);
    service.find_distro(criteria, false, false, 'token').subscribe();

    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    const document = parseRequestBody(mockRequest.request.body);
    const struct = paramValue(document, 0).firstElementChild as Element;
    expect(struct.tagName).toEqual('struct');
    expect(structToObject(struct)).toEqual({
      name: 'test-distro',
      arch: 'x86_64',
    });

    mockRequest.flush(emptyArrayResponse);
  });

  it('keeps hand-built XmlRpcStruct arguments working and converts plain objects nested inside them', () => {
    // register_new_system builds an XmlRpcStruct by hand but its "interfaces" member is a plain object.
    service
      .register_new_system(
        {
          name: 'testsystem',
          profile: 'testprofile',
          hostname: 'testsystem.example.org',
          interfaces: {
            eth0: { mac_address: 'aa:bb:cc:dd:ee:ff' },
          },
        },
        'token',
      )
      .subscribe();

    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    const document = parseRequestBody(mockRequest.request.body);
    const struct = paramValue(document, 0).firstElementChild as Element;
    expect(struct.tagName).toEqual('struct');
    expect(structToObject(struct)).toEqual({
      name: 'testsystem',
      profile: 'testprofile',
      hostname: 'testsystem.example.org',
      interfaces: { eth0: { mac_address: 'aa:bb:cc:dd:ee:ff' } },
    });

    mockRequest.flush(trueResponse);
  });

  /**
   * Returns the ``<value>`` child of the named member of a serialized ``<struct>``.
   */
  function structMemberValue(struct: Element, name: string): Element {
    expect(struct.tagName).toEqual('struct');
    const member = Array.from(struct.children).find(
      (candidate) =>
        candidate.getElementsByTagName('name')[0].textContent === name,
    );
    expect(member).toBeDefined();
    return (member as Element).getElementsByTagName('value')[0];
  }

  // The three background_* methods below used to wrap their list member into the `{data: [...]}` XmlRpcArray marker
  // of `typescript-xmlrpc`. Cobbler iterates over `options.get("systems", [])` / `options.get("repos", [])`, so
  // sending a `<struct>` there is not an error but silently makes the server act on a single item literally named
  // "data". These tests pin the member down to a real `<array>`.
  it('serializes the systems member of background_syncsystems as an array', () => {
    service
      .background_syncsystems(
        { systems: ['system1', 'system2'], verbose: true },
        'token',
      )
      .subscribe();

    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    const document = parseRequestBody(mockRequest.request.body);
    const options = paramValue(document, 0).firstElementChild as Element;
    expect(
      structMemberValue(options, 'systems').firstElementChild?.tagName,
    ).toEqual('array');
    expect(structToObject(options)).toEqual({
      systems: ['system1', 'system2'],
      verbose: true,
    });

    mockRequest.flush(taskIdResponse);
  });

  it('serializes the repos member of background_reposync as an array', () => {
    service
      .background_reposync(
        { repos: ['repo1', 'repo2'], only: '', nofail: false, tries: 3 },
        'token',
      )
      .subscribe();

    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    const document = parseRequestBody(mockRequest.request.body);
    const options = paramValue(document, 0).firstElementChild as Element;
    expect(
      structMemberValue(options, 'repos').firstElementChild?.tagName,
    ).toEqual('array');
    expect(structToObject(options)).toEqual({
      repos: ['repo1', 'repo2'],
      only: '',
      nofail: false,
      tries: 3,
    });

    mockRequest.flush(taskIdResponse);
  });

  it('serializes the systems member of background_power_system as an array', () => {
    service
      .background_power_system(
        { systems: ['system1', 'system2'], power: 'on' },
        'token',
      )
      .subscribe();

    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    const document = parseRequestBody(mockRequest.request.body);
    const options = paramValue(document, 0).firstElementChild as Element;
    expect(
      structMemberValue(options, 'systems').firstElementChild?.tagName,
    ).toEqual('array');
    expect(structToObject(options)).toEqual({
      systems: ['system1', 'system2'],
      power: 'on',
    });

    mockRequest.flush(taskIdResponse);
  });

  it('serializes an empty list member of background_syncsystems as an empty array', () => {
    service
      .background_syncsystems({ systems: [], verbose: false }, 'token')
      .subscribe();

    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    const document = parseRequestBody(mockRequest.request.body);
    const options = paramValue(document, 0).firstElementChild as Element;
    expect(
      structMemberValue(options, 'systems').firstElementChild?.tagName,
    ).toEqual('array');
    expect(structToObject(options)).toEqual({ systems: [], verbose: false });

    mockRequest.flush(taskIdResponse);
  });

  it('serializes an array of plain objects', () => {
    service
      .modify_item(
        'system',
        'system-uid',
        ['static_routes'],
        [{ a: 1 }, { b: 2 }],
        'token',
      )
      .subscribe();

    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    const document = parseRequestBody(mockRequest.request.body);
    expect(valueToJs(paramValue(document, 3))).toEqual([{ a: 1 }, { b: 2 }]);

    mockRequest.flush(trueResponse);
  });

  it('passes scalars, empty objects and empty arrays through unchanged', () => {
    service
      .modify_item('system', 'system-uid', ['kernel_options'], {}, 'token')
      .subscribe();

    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    const document = parseRequestBody(mockRequest.request.body);
    const struct = paramValue(document, 3).firstElementChild as Element;
    expect(struct.tagName).toEqual('struct');
    expect(struct.children.length).toEqual(0);

    mockRequest.flush(trueResponse);
  });
});

// Fault coverage for the auth/session methods and the generic, type-parametrised item methods
// (`what` is 'distro' / 'profile' / etc). These were originally written and run as live tests
// against a real Cobbler dev backend (http://localhost/cobbler_api) to find genuine, honest fault
// triggers for each method. The request/response XML seen in each test below was captured verbatim
// from that real backend (via an HTTP interceptor) and is now replayed through
// `HttpTestingController` so the suite runs without a live server.
describe('CobblerApiService (auth/session & generic item fault coverage)', () => {
  // Namespace prefix for every fixture/probe value sent while capturing the fixtures below, kept
  // here so the mocked calls line up exactly with what the real backend faulted/responded on.
  const NS = 'livetest-authitem';
  let service: CobblerApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: AngularXmlrpcService,
          useClass: AngularXmlrpcService,
        },
        {
          provide: CobblerApiService,
          deps: [AngularXmlrpcService, COBBLER_URL],
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CobblerApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('logs in against the real backend and receives a token', () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<params>\n<param>\n<value><string>aRjRswTzRBvtK/2JgBsJBVXwZSRfzb4wtg==</string></value>\n</param>\n</params>\n</methodResponse>\n`;
    let token = '';
    service.login('cobbler', 'cobbler').subscribe((value) => {
      token = value;
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('lists real distros from the backend', () => {
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>ctime</name><value><double>1786724735.5567143</double></value></member><member><name>mtime</name><value><double>1786724735.5567143</double></value></member><member><name>uid</name><value><string>8d6b61d0ad2646f487fdb27221b37b0d</string></value></member><member><name>name</name><value><string>koan-test-distro</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>parent</name><value><string></string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>tree_build_time</name><value><double>0.0</double></value></member><member><name>arch</name><value><string>x86_64</string></value></member><member><name>boot_loaders</name><value><array><data><value><string>&lt;&lt;inherit&gt;&gt;</string></value></data></array></value></member><member><name>breed</name><value><string>generic</string></value></member><member><name>initrd</name><value><string>/var/lib/cobbler/fixtures/initrd_test.img</string></value></member><member><name>kernel</name><value><string>/var/lib/cobbler/fixtures/vmlinuz_test</string></value></member><member><name>os_version</name><value><string></string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_org</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_user</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_password</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>source_repos</name><value><array><data></data></array></value></member><member><name>source_tree_path</name><value><string></string></value></member><member><name>remote_boot_kernel</name><value><string></string></value></member><member><name>remote_grub_kernel</name><value><string></string></value></member><member><name>remote_boot_initrd</name><value><string></string></value></member><member><name>remote_grub_initrd</name><value><string></string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value><value><struct><member><name>ctime</name><value><double>1786736990.1540127</double></value></member><member><name>mtime</name><value><double>1786743401.3651044</double></value></member><member><name>uid</name><value><string>b87f0f31bd6f4c90a3411f4ff8f79aeb</string></value></member><member><name>name</name><value><string>tumbleweed-dvd</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>depth</name><value><int>0</int></value></member><member><name>parent</name><value><string></string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>tree_build_time</name><value><double>0.0</double></value></member><member><name>arch</name><value><string>x86_64</string></value></member><member><name>boot_loaders</name><value><array><data><value><string>&lt;&lt;inherit&gt;&gt;</string></value></data></array></value></member><member><name>breed</name><value><string>suse</string></value></member><member><name>initrd</name><value><string>/var/lib/cobbler/fixtures/tumbleweed/initrd</string></value></member><member><name>kernel</name><value><string>/var/lib/cobbler/fixtures/tumbleweed/linux</string></value></member><member><name>os_version</name><value><string>suse</string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_org</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_user</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_password</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>source_repos</name><value><array><data></data></array></value></member><member><name>source_tree_path</name><value><string>/srv/distro-sources/tumbleweed-dvd</string></value></member><member><name>remote_boot_kernel</name><value><string></string></value></member><member><name>remote_grub_kernel</name><value><string></string></value></member><member><name>remote_boot_initrd</name><value><string></string></value></member><member><name>remote_grub_initrd</name><value><string></string></value></member><member><name>ks_meta</name><value><struct></struct></value></member></struct></value></data></array></value></param></params></methodResponse>`;
    let distros: unknown[] = [];
    service.get_distros().subscribe((value) => {
      distros = value;
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
    expect(Array.isArray(distros)).toBe(true);
  });

  // Fault coverage for the auth/session methods. All of these take a `token` and reject when the
  // real backend returns a genuine XML-RPC fault for it.
  describe('fault handling: auth/session methods', () => {
    // Deliberately not 36 chars long, which is the one and only format `__is_token()` checks for
    // server-side; any token failing that check makes the backend raise a real ValueError fault
    // before it even looks the token up in its token cache.
    const badFormatToken = `${NS}-bad-token`;

    it('check() surfaces a fault for a malformed token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.check(badFormatToken).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain('Check failed with code "1"');
          expect(err.message).toContain(
            '"token" did not have the correct format or type!',
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('login() surfaces a fault for a wrong password', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:login failed (cobbler)</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.login('cobbler', `${NS}-wrong-password`).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain('Login failed with code "1"');
          expect(err.message).toContain('login failed (cobbler)');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    // NOTE (verified live): logout() with any ordinary *string* token - even a wildly invalid one -
    // never faults. The backend implementation is `if token in self.token_cache: ... return True;
    // return False`, so an unrecognised string token just yields `false`, by design. The only
    // server-side exception that is genuinely reachable is a TypeError raised because the token
    // isn't hashable (e.g. an array), which is what was captured and is replayed here. The
    // `as unknown as string` cast is required to build a real, honest array-valued request despite
    // the TS signature saying `string`.
    it('logout() surfaces a fault for a non-hashable token value', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:unhashable type: 'list'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.logout([`${NS}-array-token`] as unknown as string).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain('Logout failed with code "1"');
          expect(err.message).toContain("unhashable type: 'list'");
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    // Same story as logout(): token_check() returns `false` for any invalid but well-typed string
    // token (verified live), and only genuinely faults for a non-hashable token value.
    it('token_check() surfaces a fault for a non-hashable token value', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:unhashable type: 'list'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .token_check([`${NS}-array-token`] as unknown as string)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err.message).toContain(
              'Check of the token failed with code "1"',
            );
            expect(err.message).toContain("unhashable type: 'list'");
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_user_from_token() surfaces a fault for a malformed token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_user_from_token(badFormatToken).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain(
            'Getting the user from the requested token failed with code "1"',
          );
          expect(err.message).toContain(
            '"token" did not have the correct format or type!',
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_authn_module_name() surfaces a fault for a malformed token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_authn_module_name(badFormatToken).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain(
            'Getting the authentication module name failed with code "1"',
          );
          expect(err.message).toContain(
            '"token" did not have the correct format or type!',
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('check_access() surfaces a fault for a malformed token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.check_access(badFormatToken, 'distro', '', '').subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain(
            'Checking the access failed with code "1"',
          );
          expect(err.message).toContain(
            '"token" did not have the correct format or type!',
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    // check_access_no_fail() is designed to swallow every exception raised while actually checking
    // access and return 0 instead - that's the whole point of the "no_fail" variant, and it's why an
    // ordinary invalid token can never make it fault. But when `resource` names an item type (e.g.
    // "distro") and `arg1` is given, the backend remaps `arg1` from a name to an object *before*
    // entering that try/except, via `self.__name_to_object(resource, arg1)`. Passing a non-string
    // `arg1` there crashes with an unhandled, un-caught TypeError - a genuine fault. (Verified live;
    // the token's value is irrelevant to this particular crash, so a bad-format one is fine here too.)
    it('check_access_no_fail() surfaces a fault when arg1 has an incompatible type for the resource remap', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:'int' object is not subscriptable</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .check_access_no_fail(
          badFormatToken,
          'distro',
          42 as unknown as string,
          '',
        )
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err.message).toContain(
              'Checking the access without failure failed with code "1"',
            );
            expect(err.message).toContain("'int' object is not subscriptable");
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });
  });

  // Fault coverage for the generic, type-parametrised item methods (`what` is 'distro' / 'profile' /
  // etc). None of the fault triggers below actually mutate or create anything on the (real) backend
  // they were captured against, so no fixtures needed to be created or cleaned up there either.
  describe('fault handling: generic item methods', () => {
    // Not a real Cobbler collection type - fails `validate_obj_type()`/`get_items()`'s lookup
    // immediately, regardless of token or item name.
    const bogusWhat = `${NS}-bogus-type`;
    const nonexistentUid = `${NS}-nonexistent-uid`;
    const anyToken = `${NS}-any-token`;

    it('get_item() surfaces a fault for an invalid object type', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object type'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_item(bogusWhat, 'anything').subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain(
            'Getting the requested item failed with code "1"',
          );
          expect(err.message).toContain('invalid object type');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_items() surfaces a fault for an invalid object type', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'internal error, collection name "livetest-authitem-bogus-type" not supported'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_items(bogusWhat).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain(
            'Getting the requested collection failed with code "1"',
          );
          expect(err.message).toContain(
            `collection name "${bogusWhat}" not supported`,
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_item_names() surfaces a fault for an invalid object type', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'internal error, collection name "livetest-authitem-bogus-type" not supported'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_item_names(bogusWhat).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain(
            'Getting the item names failed with code "1"',
          );
          expect(err.message).toContain(
            `collection name "${bogusWhat}" not supported`,
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('has_item() surfaces a fault for an invalid object type', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object type'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.has_item(bogusWhat, 'anything', anyToken).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain(
            'Checking if the item exists failed with code "1"',
          );
          expect(err.message).toContain('invalid object type');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_item_handle() surfaces a fault for an invalid object type', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object type'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_item_handle(bogusWhat, 'anything', anyToken).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain(
            'Getting the item handle failed with code "1"',
          );
          expect(err.message).toContain('invalid object type');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_item_resolved_value() surfaces a fault for a malformed uuid', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:The given uuid did not have the correct format!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_item_resolved_value(`${NS}-not-a-uuid`, ['name']).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain(
            'Getting the resolved item value failed with code "1"',
          );
          expect(err.message).toContain(
            'The given uuid did not have the correct format!',
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('set_item_resolved_value() surfaces a fault for a malformed uuid', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:The given uuid did not have the correct format!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .set_item_resolved_value(`${NS}-not-a-uuid`, ['name'], 'foo', anyToken)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err.message).toContain(
              'Setting the resolved item value failed with code "1"',
            );
            expect(err.message).toContain(
              'The given uuid did not have the correct format!',
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    // find_items()/find_items_paged() never call check_access() at all (verified in
    // cobbler/remote.py) - the empty-criteria ValueError from `CobblerAPI.find_items()` fires
    // regardless of the token's value, so any placeholder token is fine here.
    it('find_items() surfaces a fault for an empty criteria dict', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:The critera search dictionary cannot be empty!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.find_items('distro', {}, '', false, false, anyToken).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain(
            'Finding the requested items failed with code "1"',
          );
          expect(err.message).toContain(
            'The critera search dictionary cannot be empty!',
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('find_items_paged() surfaces a fault for an empty criteria dict', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:The critera search dictionary cannot be empty!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.find_items_paged('distro', {}, '', 1, 25, anyToken).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain(
            'Finding the requested items (paged) failed with code "1"',
          );
          expect(err.message).toContain(
            'The critera search dictionary cannot be empty!',
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    // modify_item()/save_item() both resolve `object_id` via the internal `__get_object()` helper
    // *before* ever calling check_access(), so a nonexistent object id faults regardless of token.
    it('modify_item() surfaces a fault for a nonexistent object id', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .modify_item('distro', nonexistentUid, ['comment'], 'foo', anyToken)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err.message).toContain(
              'Modifying the requested item failed with code "1"',
            );
            expect(err.message).toContain(
              'Object not found or ambigous match!',
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('save_item() surfaces a fault for a nonexistent object id', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .save_item('distro', nonexistentUid, true, true, 'bypass', anyToken)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err.message).toContain(
              'Saving the requested item failed with code "1"',
            );
            expect(err.message).toContain(
              'Object not found or ambigous match!',
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    // new_item() calls check_access() before ever touching `what`, so a malformed token faults
    // immediately without creating anything.
    it('new_item() surfaces a fault for a malformed token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.new_item('distro', `${NS}-bad-token`, false).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err.message).toContain(
            'Creating a new item failed with code "1"',
          );
          expect(err.message).toContain(
            '"token" did not have the correct format or type!',
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    // remove_item() resolves `object_id` via `__get_object()` first (swallowing a not-found there
    // and just returning `false` - no fault), and only calls check_access() *after* that succeeds.
    // So to genuinely fault we need a real, existing object id and an invalid token. Both requests
    // below (the `get_item_handle()` lookup for the read-only seed distro `koan-test-distro`, and
    // the `remove_item()` call itself) were captured verbatim from the real backend; on the real
    // backend this call is non-destructive since check_access() raises before `api.remove_item()` is
    // ever reached.
    it('remove_item() surfaces a fault for a malformed token given a real object id', () => {
      const getItemHandleResponse = `<?xml version='1.0'?>
<methodResponse>
<params>
<param>
<value><string>8d6b61d0ad2646f487fdb27221b37b0d</string></value>
</param>
</params>
</methodResponse>
`;
      // eslint-disable-next-line max-len
      const removeItemResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;

      let realUid = '';
      service
        .get_item_handle('distro', 'koan-test-distro', anyToken)
        .subscribe((value) => {
          realUid = value;
        });
      httpTestingController
        .expectOne('http://localhost/cobbler_api')
        .flush(getItemHandleResponse);

      service
        .remove_item('distro', realUid, `${NS}-bad-token`, true)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err.message).toContain(
              'Removing the requested item failed with code "1"',
            );
            expect(err.message).toContain(
              '"token" did not have the correct format or type!',
            );
          },
        });
      httpTestingController
        .expectOne('http://localhost/cobbler_api')
        .flush(removeItemResponse);
    });

    // copy_item()/rename_item() both call check_access() *before* resolving `object_id`, so unlike
    // modify_item()/save_item()/remove_item() above, these two genuinely needed a valid,
    // authenticated token (on the real backend) to get past that check and reach the "object id not
    // found" fault being exercised. Both the `login()` and the `copy_item()`/`rename_item()`
    // requests/responses below were captured verbatim from the real backend.
    it('copy_item() surfaces a fault for a nonexistent object id', () => {
      const loginResponse = `<?xml version='1.0'?>
<methodResponse>
<params>
<param>
<value><string>hlZvRZswSJ99ruJM8UxUm4g12oYVv+otLQ==</string></value>
</param>
</params>
</methodResponse>
`;
      // eslint-disable-next-line max-len
      const copyItemResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Item with id "livetest-authitem-nonexistent-uid" not found.</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;

      let token = '';
      service.login('cobbler', 'cobbler').subscribe((value) => {
        token = value;
      });
      httpTestingController
        .expectOne('http://localhost/cobbler_api')
        .flush(loginResponse);

      service
        .copy_item('distro', nonexistentUid, `${NS}-copy-target`, token)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err.message).toContain(
              'Copying the requested item failed with code "1"',
            );
            expect(err.message).toContain(
              `Item with id "${nonexistentUid}" not found.`,
            );
          },
        });
      httpTestingController
        .expectOne('http://localhost/cobbler_api')
        .flush(copyItemResponse);
    });

    it('rename_item() surfaces a fault for a nonexistent object id', () => {
      const loginResponse = `<?xml version='1.0'?>
<methodResponse>
<params>
<param>
<value><string>dkYghybXUSsAgI7JtfkuJsreAXnPRv3heg==</string></value>
</param>
</params>
</methodResponse>
`;
      // eslint-disable-next-line max-len
      const renameItemResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Item with id "livetest-authitem-nonexistent-uid" not found!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;

      let token = '';
      service.login('cobbler', 'cobbler').subscribe((value) => {
        token = value;
      });
      httpTestingController
        .expectOne('http://localhost/cobbler_api')
        .flush(loginResponse);

      service
        .rename_item('distro', nonexistentUid, `${NS}-rename-target`, token)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err.message).toContain(
              'Renaming the requested item failed with code "1"',
            );
            expect(err.message).toContain(
              `Item with id "${nonexistentUid}" not found!`,
            );
          },
        });
      httpTestingController
        .expectOne('http://localhost/cobbler_api')
        .flush(renameItemResponse);
    });
  });
});

// Fault-coverage tests for the `profile` and `repo` XML-RPC wrapper methods.
// Every `methodResponse` fixture below is a REAL XML-RPC fault response captured from a
// live `compose.dev.yml` dev stack while exercising the exact same wrapper call (not
// hand-written/guessed XML). Mocking follows the HttpTestingController convention already
// used throughout this file.
describe('CobblerApiService - profile & repo fault coverage', () => {
  // A placeholder token used where the call needs *some* string but, since the backend is
  // mocked, its value has no bearing on the (captured) response that gets flushed.
  const TOKEN = 'token';
  // Correct 36-char token *format* (see CobblerXMLRPCInterface.__is_token) but not a real,
  // logged-in token - this is the exact value used while capturing the real "invalid token"
  // fault fixtures below.
  const INVALID_TOKEN = '0'.repeat(36);

  /**
   * Re-types a service instance so it can be called with argument values that don't
   * satisfy the wrapper's compile-time TypeScript signature (e.g. a number where a
   * string is expected). This is used to reach fault paths in the real backend that a
   * strictly-typed call site could never trigger, while still invoking the exact same
   * runtime method (with correct `this` binding) that real callers use.
   */
  function withRawArgs(
    service: CobblerApiService,
  ): Record<string, (...args: unknown[]) => Observable<unknown>> {
    return service as unknown as Record<
      string,
      (...args: unknown[]) => Observable<unknown>
    >;
  }

  let service: CobblerApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: AngularXmlrpcService,
          useClass: AngularXmlrpcService,
        },
        {
          provide: CobblerApiService,
          deps: [AngularXmlrpcService, COBBLER_URL],
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CobblerApiService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('profile', () => {
    it('get_profile: non-existent object id faults', () => {
      // Not a fresh live capture: get_profile() became uid-based after this fixture's original
      // capture. The fault text mirrors modify_profile()/save_profile()'s independently-verified
      // "Object not found or ambigous match!" ValueError (same __get_object() resolution path).
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_profile('nonexistent-uid', false, false, TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toContain(
            'Getting the requested profile failed with code "1"',
          );
          expect(err.message).toContain('Object not found');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('find_profile: empty criteria faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:The critera search dictionary cannot be empty!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.find_profile({}, false, false, TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toContain(
            'Finding the requested profiles failed with code "1"',
          );
          expect(err.message).toContain(
            'The critera search dictionary cannot be empty!',
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_profile_handle: invalid object name faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object name'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_profile_handle('invalid name!').subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toContain(
            'Getting the profile handle failed with code "1"',
          );
          expect(err.message).toContain('invalid object name');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('remove_profile: invalid token faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .remove_profile('existing-profile-uid', INVALID_TOKEN, true)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Removing the requested profile failed with code "1"',
            );
            expect(err.message).toContain('invalid token');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('copy_profile: invalid token faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .copy_profile('nonexistent-uid', 'new-profile-name', INVALID_TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Copying the requested profile failed with code "1"',
            );
            expect(err.message).toContain('invalid token');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('rename_profile: invalid token faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .rename_profile('nonexistent-uid', 'renamed-profile', INVALID_TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Renaming the requested profile failed with code "1"',
            );
            expect(err.message).toContain('invalid token');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('new_profile: invalid token faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.new_profile(INVALID_TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toContain(
            'Creating a new profile failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('new_subprofile: invalid token faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.new_subprofile(INVALID_TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toContain(
            'Creating a new subprofile failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('modify_profile: nonexistent object id faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .modify_profile('nonexistent-uid', ['comment'], 'hi', TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Modifying the requested profile failed with code "1"',
            );
            expect(err.message).toContain(
              'Object not found or ambigous match!',
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('save_profile: nonexistent object id faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .save_profile('nonexistent-uid', true, false, 'bypass', TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Saving the requested profile failed with code "1"',
            );
            expect(err.message).toContain(
              'Object not found or ambigous match!',
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_valid_profile_bootloaders: non-string profile name faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:'int' object is not subscriptable</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      withRawArgs(service)
        ['get_valid_profile_bootloaders'](12345, TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Getting the valid profile boot loaders for the requested profile failed with code "1"',
            );
            expect(err.message).toContain('not subscriptable');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_profiles_since: non-numeric mtime faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:'&gt;=' not supported between instances of 'float' and 'str'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      withRawArgs(service)
        ['get_profiles_since']('not-a-number')
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Getting the profiles modified since the requested mtime failed with code "1"',
            );
            expect(err.message).toContain(
              "not supported between instances of 'float' and 'str'",
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_profile_as_rendered: non-string name faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:'int' object is not subscriptable</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      withRawArgs(service)
        ['get_profile_as_rendered'](12345, TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Getting the requested profile in a rendered format failed with code "1"',
            );
            expect(err.message).toContain('not subscriptable');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });
  });

  describe('repo', () => {
    it('background_reposync: invalid token faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const options: BackgroundReposyncOptions = {
        repos: [],
        only: '',
        nofail: false,
        tries: 1,
      };
      service.background_reposync(options, INVALID_TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toContain(
            'Executing a reposync in the background failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_repo: non-existent object id faults', () => {
      // Not a fresh live capture, same rationale as the sibling get_profile test above.
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_repo('nonexistent-uid', false, false, TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toContain(
            'Getting the requested repository failed with code "1"',
          );
          expect(err.message).toContain('Object not found');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('find_repo: empty criteria faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:The critera search dictionary cannot be empty!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.find_repo({}, false, false, TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toContain(
            'Finding the requested repos failed with code "1"',
          );
          expect(err.message).toContain(
            'The critera search dictionary cannot be empty!',
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_repo_handle: invalid object name faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object name'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_repo_handle('invalid name!').subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toContain(
            'Getting the repository handle failed with code "1"',
          );
          expect(err.message).toContain('invalid object name');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('remove_repo: invalid token faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.remove_repo('existing-repo-uid', INVALID_TOKEN, true).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toContain(
            'Removing the requested repo failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('copy_repo: invalid token faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .copy_repo('nonexistent-uid', 'new-repo-name', INVALID_TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Copying the requested repository failed with code "1"',
            );
            expect(err.message).toContain('invalid token');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('rename_repo: invalid token faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .rename_repo('nonexistent-uid', 'renamed-repo', INVALID_TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Renaming the requested repository failed with code "1"',
            );
            expect(err.message).toContain('invalid token');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('new_repo: invalid token faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.new_repo(INVALID_TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toContain(
            'Creating a new repository failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('modify_repo: nonexistent object id faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .modify_repo('nonexistent-uid', ['comment'], 'hi', TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Modifying the requested repository failed with code "1"',
            );
            expect(err.message).toContain(
              'Object not found or ambigous match!',
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('auto_add_repos: invalid token faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.auto_add_repos(INVALID_TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toContain(
            'Auto adding the repositories failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('save_repo: nonexistent object id faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .save_repo('nonexistent-uid', true, false, 'bypass', TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Saving the requested repository failed with code "1"',
            );
            expect(err.message).toContain(
              'Object not found or ambigous match!',
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_repo_config_for_profile: non-string profile name faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:'int' object is not subscriptable</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      withRawArgs(service)
        ['get_repo_config_for_profile'](12345)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Getting the repository configuration for the requested profile failed with code "1"',
            );
            expect(err.message).toContain('not subscriptable');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_repo_config_for_system: non-string system name faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:'int' object is not subscriptable</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      withRawArgs(service)
        ['get_repo_config_for_system'](12345)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Getting the repository configuration for the requested system failed with code "1"',
            );
            expect(err.message).toContain('not subscriptable');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_repos_since: non-numeric mtime faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:'&gt;=' not supported between instances of 'float' and 'str'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      withRawArgs(service)
        ['get_repos_since']('not-a-number')
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Getting the repositories modified since the requested mtime failed with code "1"',
            );
            expect(err.message).toContain(
              "not supported between instances of 'float' and 'str'",
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_repos_compatible_with_profile: non-string profile name faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:'int' object is not subscriptable</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      withRawArgs(service)
        ['get_repos_compatible_with_profile'](12345, TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Getting the repositories compatible with the requested profile failed with code "1"',
            );
            expect(err.message).toContain('not subscriptable');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_repo_as_rendered: non-string name faults', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:'int' object is not subscriptable</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      withRawArgs(service)
        ['get_repo_as_rendered'](12345, TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toContain(
              'Getting the requested repository in a rendered format failed with code "1"',
            );
            expect(err.message).toContain('not subscriptable');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });
  });
});

// Mocked fault-path coverage for the distro / image / menu wrapper methods.
//
// Every `methodResponse` fixture below is a REAL XML-RPC fault response
// captured from a live `compose.dev.yml` dev stack (cobblerd + http-api +
// traefik) by temporarily instrumenting this file with an HTTP interceptor
// and running it against `http://localhost/cobbler_api`. Nothing here was
// hand-written or guessed - each fixture is the verbatim response body the
// real backend produced for the corresponding call, captured once and then
// replayed through `HttpTestingController`.
//
// The happy-path (`instanceOfMethodResponse`) branch for these methods is
// already covered above. This section only exercises the
// `instanceOfMethodFault` branch, which needs a genuine XML-RPC fault
// payload to assert against.
describe('CobblerApiService - distro/image/menu fault paths', () => {
  const TOKEN = 'valid-session-token-placeholder';
  const BOGUS_TOKEN = '0'.repeat(36); // correctly formatted (36 chars) but never a real, cached session token
  let service: CobblerApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: AngularXmlrpcService,
          useClass: AngularXmlrpcService,
        },
        {
          provide: CobblerApiService,
          deps: [AngularXmlrpcService, COBBLER_URL],
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CobblerApiService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('distro', () => {
    it('get_distro surfaces a fault for a non-existent object id', () => {
      // Not a fresh live capture: get_distro() became uid-based after this fixture's original
      // capture. The fault text mirrors modify_distro()/save_distro()'s independently-verified
      // "Object not found or ambigous match!" ValueError (same __get_object() resolution path).
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.get_distro('nonexistent-uid', false, false, TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the requested distro failed with code "1"',
          );
          expect(err.message).toContain('Object not found');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('find_distro surfaces a fault for empty search criteria', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'ValueError'&gt;:The critera search dictionary cannot be empty!</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.find_distro({}, false, false, TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Finding the requested distros failed with code "1"',
          );
          expect(err.message).toContain(
            'critera search dictionary cannot be empty',
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_distro_handle surfaces a fault for an invalid object name', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object name'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.get_distro_handle('invalid name!').subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the distro handle failed with code "1"',
          );
          expect(err.message).toContain('invalid object name');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('remove_distro surfaces a fault for an invalid token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.remove_distro('any-object-id', BOGUS_TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Removing the requested distro failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('copy_distro surfaces a fault for an invalid token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .copy_distro('any-object-id', 'copy-distro-target', BOGUS_TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Copying the requested distro failed with code "1"',
            );
            expect(err.message).toContain('invalid token');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('rename_distro surfaces a fault for an invalid token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .rename_distro('any-object-id', 'rename-distro-target', BOGUS_TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Renaming the requested distro failed with code "1"',
            );
            expect(err.message).toContain('invalid token');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('new_distro surfaces a fault for an invalid token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.new_distro(BOGUS_TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Creating a new distro failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('modify_distro surfaces a fault for a non-existent object id', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .modify_distro('nonexistent-uid', ['comment'], 'test', TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Modifying the requested distro failed with code "1"',
            );
            expect(err.message).toContain('Object not found');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('save_distro surfaces a fault for a non-existent object id', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .save_distro('nonexistent-uid', true, true, 'bypass', TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Saving the requested distro failed with code "1"',
            );
            expect(err.message).toContain('Object not found');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_valid_distro_bootloaders surfaces a fault for a malformed distro name', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'TypeError'&gt;:unhashable type: 'list'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .get_valid_distro_bootloaders(['a', 'b'] as unknown as string, TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Getting the valid distro boot loaders for the requested distro failed with code "1"',
            );
            expect(err.message).toContain('unhashable type');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_distros_since surfaces a fault for a malformed mtime', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'TypeError'&gt;:'&gt;=' not supported between instances of 'float' and 'str'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.get_distros_since('not-a-number' as unknown as number).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the distros modified since the requested mtime failed with code "1"',
          );
          expect(err.message).toContain('not supported between instances');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_distro_as_rendered surfaces a fault for a malformed name', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'TypeError'&gt;:unhashable type: 'list'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .get_distro_as_rendered(['a'] as unknown as string, TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Getting the requested distro in a rendered format failed with code "1"',
            );
            expect(err.message).toContain('unhashable type');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });
  });

  describe('image', () => {
    it('get_image surfaces a fault for a non-existent object id', () => {
      // Not a fresh live capture, same rationale as the sibling get_distro test above.
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.get_image('nonexistent-uid', false, false, TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the requested image failed with code "1"',
          );
          expect(err.message).toContain('Object not found');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('find_image surfaces a fault for empty search criteria', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'ValueError'&gt;:The critera search dictionary cannot be empty!</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.find_image({}, false, false, TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Finding the requested images failed with code "1"',
          );
          expect(err.message).toContain(
            'critera search dictionary cannot be empty',
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_image_handle surfaces a fault for an invalid object name', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object name'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.get_image_handle('invalid name!').subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the image handle failed with code "1"',
          );
          expect(err.message).toContain('invalid object name');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('remove_image surfaces a fault for an invalid token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.remove_image('any-object-id', BOGUS_TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Removing the requested image failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('copy_image surfaces a fault for an invalid token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .copy_image('any-object-id', 'copy-image-target', BOGUS_TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Copying the requested image failed with code "1"',
            );
            expect(err.message).toContain('invalid token');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('rename_image surfaces a fault for an invalid token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .rename_image('any-object-id', 'rename-image-target', BOGUS_TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Renaming the requested image failed with code "1"',
            );
            expect(err.message).toContain('invalid token');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('new_image surfaces a fault for an invalid token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.new_image(BOGUS_TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Creating a new image failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('modify_image surfaces a fault for a non-existent object id', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .modify_image('nonexistent-uid', ['comment'], 'test', TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Modifying the requested image failed with code "1"',
            );
            expect(err.message).toContain('Object not found');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('save_image surfaces a fault for a non-existent object id', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .save_image('nonexistent-uid', true, true, 'bypass', TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Saving the requested image failed with code "1"',
            );
            expect(err.message).toContain('Object not found');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_valid_image_bootloaders surfaces a fault for a malformed image name', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'TypeError'&gt;:unhashable type: 'list'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .get_valid_image_bootloaders(['a', 'b'] as unknown as string, TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Getting the valid image boot loaders for the requested image failed with code "1"',
            );
            expect(err.message).toContain('unhashable type');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_images_since surfaces a fault for a malformed mtime', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'TypeError'&gt;:'&gt;=' not supported between instances of 'float' and 'str'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.get_images_since('not-a-number' as unknown as number).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the images modified since the requested mtime failed with code "1"',
          );
          expect(err.message).toContain('not supported between instances');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_image_as_rendered surfaces a fault for a malformed name', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'TypeError'&gt;:unhashable type: 'list'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .get_image_as_rendered(['a'] as unknown as string, TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Getting the requested image in a rendered format failed with code "1"',
            );
            expect(err.message).toContain('unhashable type');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });
  });

  describe('menu', () => {
    it('get_menu surfaces a fault for a non-existent object id', () => {
      // Not a fresh live capture, same rationale as the sibling get_distro test above.
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.get_menu('nonexistent-uid', false, false, TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the requested menu failed with code "1"',
          );
          expect(err.message).toContain('Object not found');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('find_menu surfaces a fault for empty search criteria', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'ValueError'&gt;:The critera search dictionary cannot be empty!</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.find_menu({}, false, false, TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Finding the requested files failed with code "1"',
          );
          expect(err.message).toContain(
            'critera search dictionary cannot be empty',
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_menu_handle surfaces a fault for an invalid object name', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object name'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.get_menu_handle('invalid name!').subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the file handle failed with code "1"',
          );
          expect(err.message).toContain('invalid object name');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('remove_menu surfaces a fault for an invalid token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.remove_menu('any-object-id', BOGUS_TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Removing the requested file failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('copy_menu surfaces a fault for an invalid token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .copy_menu('any-object-id', 'copy-menu-target', BOGUS_TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Copying the requested file failed with code "1"',
            );
            expect(err.message).toContain('invalid token');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('rename_menu surfaces a fault for an invalid token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .rename_menu('any-object-id', 'rename-menu-target', BOGUS_TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Renaming the requested menu failed with code "1"',
            );
            expect(err.message).toContain('invalid token');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('new_menu surfaces a fault for an invalid token', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.new_menu(BOGUS_TOKEN).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Creating a new menu failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('modify_menu surfaces a fault for a non-existent object id', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .modify_menu('nonexistent-uid', ['comment'], 'test', TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Modifying the requested menu failed with code "1"',
            );
            expect(err.message).toContain('Object not found');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('save_menu surfaces a fault for a non-existent object id', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .save_menu('nonexistent-uid', true, true, 'bypass', TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Saving the requested menu failed with code "1"',
            );
            expect(err.message).toContain('Object not found');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_menus_since surfaces a fault for a malformed mtime', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'TypeError'&gt;:'&gt;=' not supported between instances of 'float' and 'str'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service.get_menus_since('not-a-number' as unknown as number).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err: Error) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the menus modified since the requested mtime failed with code "1"',
          );
          expect(err.message).toContain('not supported between instances');
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_menu_as_rendered surfaces a fault for a malformed name', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n    <methodResponse>\n    <fault>\n    <value><struct>\n    <member>\n    <name>faultCode</name>\n    <value><int>1</int></value>\n    </member>\n    <member>\n    <name>faultString</name>\n    <value><string>&lt;class 'TypeError'&gt;:unhashable type: 'list'</string></value>\n    </member>\n    </struct></value>\n    </fault>\n    </methodResponse>\n    `;
      service
        .get_menu_as_rendered(['a'] as unknown as string, TOKEN)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain(
              'Getting the requested menu in a rendered format failed with code "1"',
            );
            expect(err.message).toContain('unhashable type');
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });
  });
});

// Fault-path coverage for the distro_group / profile_group / system_group method
// families. Every wrapper follows the generated pattern:
//   instanceOfMethodResponse -> return value
//   instanceOfMethodFault    -> throw Error(<custom prefix> + faultCode + faultString)
//   otherwise                -> throw Error('Unexpected response type')  (NOT reachable
//     by a real server; intentionally not covered here)
//
// This section exercises the middle (fault) branch. The mocked XML-RPC fault responses
// below are byte-for-byte captures of REAL responses returned by a live Cobbler
// dev backend (compose.dev.yml) for these exact calls - not hand-written/guessed XML.
//
// EXCEPTION: the `get` fixture in each *GroupXml object below is NOT a fresh live capture -
// get_<type>_group() became uid-based after these fixtures were originally captured (they
// used to assert a name-based "invalid object name" CX fault). The updated fault text mirrors
// the sibling `save` fixture's independently-verified "Object not found or ambigous match!"
// ValueError, since both resolve object_id via the same __get_object() helper.
describe('CobblerApiService - item group faults', () => {
  const distroGroupXml = {
    get: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    find: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:The critera search dictionary cannot be empty!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    handle: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object name'</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    remove: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'removal would orphan distro_group(s): ef8a8240c9664d489260e4a816410f5c'</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    copy: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:Item with id "livetest-groups-bogus-1787740058814-2" not found.</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    rename: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:Item with id "livetest-groups-bogus-1787740058889-3" not found!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    create: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    modify: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:members references uid "does-not-exist-uid" which is not an existing "distro" item</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    save: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    since: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'TypeError'&gt;:'&gt;=' not supported between instances of 'float' and 'str'</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    asRendered: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'TypeError'&gt;:'int' object is not subscriptable</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
  };

  const profileGroupXml = {
    get: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    find: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:The critera search dictionary cannot be empty!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    handle: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object name'</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    remove: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'removal would orphan profile_group(s): 3e67ec81f82249dfb09ae8d59d080bf2'</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    copy: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:Item with id "livetest-groups-bogus-1787740059572-9" not found.</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    rename: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:Item with id "livetest-groups-bogus-1787740059665-10" not found!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    create: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    modify: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:members references uid "does-not-exist-uid" which is not an existing "profile" item</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    save: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    since: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'TypeError'&gt;:'&gt;=' not supported between instances of 'float' and 'str'</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    asRendered: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'TypeError'&gt;:'int' object is not subscriptable</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
  };

  const systemGroupXml = {
    get: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    find: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:The critera search dictionary cannot be empty!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    handle: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object name'</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    remove: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'removal would orphan system_group(s): db56b2f21935442aa27e2a5275bd9497'</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    copy: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:Item with id "livetest-groups-bogus-1787740060192-16" not found.</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    rename: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:Item with id "livetest-groups-bogus-1787740060205-17" not found!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    create: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    modify: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:members references uid "does-not-exist-uid" which is not an existing "system" item</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    save: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    since: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'TypeError'&gt;:'&gt;=' not supported between instances of 'float' and 'str'</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
    asRendered: `<?xml version='1.0'?>
<methodResponse>
<fault>
<value><struct>
<member>
<name>faultCode</name>
<value><int>1</int></value>
</member>
<member>
<name>faultString</name>
<value><string>&lt;class 'TypeError'&gt;:'int' object is not subscriptable</string></value>
</member>
</struct></value>
</fault>
</methodResponse>
`,
  };

  interface GroupApi {
    get: (
      objectId: string,
      flatten: boolean,
      resolved: boolean,
      token: string,
    ) => Observable<unknown>;
    find: (
      criteria: object,
      expand: boolean,
      resolved: boolean,
      token: string,
    ) => Observable<unknown>;
    getHandle: (name: string) => Observable<string>;
    remove: (
      objectId: string,
      token: string,
      recursive: boolean,
    ) => Observable<boolean>;
    copy: (
      objectId: string,
      newName: string,
      token: string,
    ) => Observable<boolean>;
    rename: (
      objectId: string,
      newName: string,
      token: string,
    ) => Observable<boolean>;
    create: (token: string) => Observable<string>;
    modify: (
      objectId: string,
      attribute: Array<string>,
      arg: any,
      token: string,
    ) => Observable<boolean>;
    save: (
      objectId: string,
      withTriggers: boolean,
      withSync: boolean,
      editMode: string,
      token: string,
    ) => Observable<boolean>;
    since: (mtime: number) => Observable<unknown>;
    asRendered: (name: string, token: string) => Observable<unknown>;
  }

  interface GroupMustContain {
    get: string[];
    find: string[];
    handle: string[];
    remove: string[];
    copy: string[];
    rename: string[];
    create: string[];
    modify: string[];
    save: string[];
    since: string[];
    asRendered: string[];
  }

  type GroupXml = typeof distroGroupXml;

  let service: CobblerApiService;
  let httpTestingController: HttpTestingController;
  const token = 'mock-token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: AngularXmlrpcService,
          useClass: AngularXmlrpcService,
        },
        {
          provide: CobblerApiService,
          deps: [AngularXmlrpcService, COBBLER_URL],
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CobblerApiService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  /**
   * Runs `invoke()`, flushes the given (real, captured) XML-RPC fault response for it,
   * and asserts the resulting Error's message contains every fragment in `mustContain`.
   */
  function expectMockedRpcFault(
    invoke: () => Observable<unknown>,
    methodResponse: string,
    mustContain: string[],
  ): void {
    let caught: unknown = null;
    invoke().subscribe({
      next: () => {
        throw new Error(
          'Expected the observable to error, but it emitted a value.',
        );
      },
      error: (err: unknown) => {
        caught = err;
      },
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);

    expect(caught).toBeInstanceOf(Error);
    const message = (caught as Error).message;
    for (const fragment of mustContain) {
      expect(message).toContain(fragment);
    }
  }

  function runGroupSuite(
    kindLabel: string,
    api: GroupApi,
    mustContain: GroupMustContain,
    xml: GroupXml,
    memberReferencedType: 'distro' | 'profile' | 'system',
  ): void {
    describe(kindLabel, () => {
      it(`surfaces a fault for get_${kindLabel}() with a non-existent object id`, () => {
        expectMockedRpcFault(
          () => api.get('nonexistent-uid', false, false, token),
          xml.get,
          mustContain.get,
        );
      });

      // get_distro_groups()/get_profile_groups()/get_system_groups() (no arguments)
      // are intentionally NOT covered here: the wrapper method takes zero parameters,
      // and the backend implementation (CobblerXMLRPCInterface.get_items) has no
      // honest, client-triggerable failure path - it just maps `to_dict()` over the
      // in-memory collection. Not a bug - just no reachable fault path via legitimate
      // parameters.

      it(`surfaces a fault for find_${kindLabel}() with empty criteria`, () => {
        expectMockedRpcFault(
          () => api.find({}, false, false, token),
          xml.find,
          mustContain.find,
        );
      });

      it(`surfaces a fault for get_${kindLabel}_handle() with an invalid name`, () => {
        expectMockedRpcFault(
          () => api.getHandle('bad name!'),
          xml.handle,
          mustContain.handle,
        );
      });

      it(`surfaces a fault for remove_${kindLabel}() when removal would orphan a child group (non-recursive)`, () => {
        expectMockedRpcFault(
          () => api.remove('livetest-groups-parent-id', token, false),
          xml.remove,
          mustContain.remove,
        );
      });

      it(`surfaces a fault for copy_${kindLabel}() with a nonexistent object id`, () => {
        expectMockedRpcFault(
          () =>
            api.copy(
              'livetest-groups-bogus-id',
              'livetest-groups-copy-target',
              token,
            ),
          xml.copy,
          mustContain.copy,
        );
      });

      it(`surfaces a fault for rename_${kindLabel}() with a nonexistent object id`, () => {
        expectMockedRpcFault(
          () =>
            api.rename(
              'livetest-groups-bogus-id',
              'livetest-groups-rename-target',
              token,
            ),
          xml.rename,
          mustContain.rename,
        );
      });

      it(`surfaces a fault for new_${kindLabel}() with an invalid token`, () => {
        expectMockedRpcFault(
          () => api.create('not-a-real-token'),
          xml.create,
          mustContain.create,
        );
      });

      it(`surfaces a fault for modify_${kindLabel}() when members references a nonexistent ${memberReferencedType} uid`, () => {
        expectMockedRpcFault(
          () =>
            api.modify(
              'livetest-groups-object-id',
              ['members'],
              ['does-not-exist-uid'],
              token,
            ),
          xml.modify,
          mustContain.modify,
        );
      });

      it(`surfaces a fault for save_${kindLabel}() with a nonexistent object id`, () => {
        expectMockedRpcFault(
          () =>
            api.save('livetest-groups-bogus-id', true, true, 'bypass', token),
          xml.save,
          mustContain.save,
        );
      });

      it(`surfaces a fault for get_${kindLabel}s_since() with a non-numeric mtime`, () => {
        expectMockedRpcFault(
          () => api.since('not-a-number' as unknown as number),
          xml.since,
          mustContain.since,
        );
      });

      it(`surfaces a fault for get_${kindLabel}_as_rendered() with a non-string name`, () => {
        expectMockedRpcFault(
          () => api.asRendered(12345 as unknown as string, token),
          xml.asRendered,
          mustContain.asRendered,
        );
      });
    });
  }

  runGroupSuite(
    'distro_group',
    {
      get: (objectId, flatten, resolved, tok) =>
        service.get_distro_group(objectId, flatten, resolved, tok),
      find: (criteria, expand, resolved, tok) =>
        service.find_distro_group(criteria, expand, resolved, tok),
      getHandle: (name) => service.get_distro_group_handle(name),
      remove: (objectId, tok, recursive) =>
        service.remove_distro_group(objectId, tok, recursive),
      copy: (objectId, newName, tok) =>
        service.copy_distro_group(objectId, newName, tok),
      rename: (objectId, newName, tok) =>
        service.rename_distro_group(objectId, newName, tok),
      create: (tok) => service.new_distro_group(tok),
      modify: (objectId, attribute, arg, tok) =>
        service.modify_distro_group(objectId, attribute, arg, tok),
      save: (objectId, withTriggers, withSync, editMode, tok) =>
        service.save_distro_group(
          objectId,
          withTriggers,
          withSync,
          editMode,
          tok,
        ),
      since: (mtime) => service.get_distro_groups_since(mtime),
      asRendered: (name, tok) =>
        service.get_distro_group_as_rendered(name, tok),
    },
    {
      get: [
        'Getting the requested distro group failed with code "1"',
        'Object not found',
      ],
      find: [
        'Finding the requested distro groups failed with code "1"',
        'critera search dictionary cannot be empty',
      ],
      handle: [
        'Getting the distro group handle failed with code "1"',
        'invalid object name',
      ],
      remove: [
        'Removing the requested distro group failed with code "1"',
        'removal would orphan',
      ],
      copy: [
        'Copying the requested distro group failed with code "1"',
        'not found',
      ],
      rename: [
        'Renaming the requested distro group failed with code "1"',
        'not found',
      ],
      create: ['Creating a new distro group failed with code "1"', 'token'],
      modify: [
        'Modifying the requested distro group failed with code "1"',
        'does-not-exist-uid',
        'not an existing "distro" item',
      ],
      save: [
        'Saving the requested distro group failed with code "1"',
        'Object not found',
      ],
      since: [
        'Getting the distro groups modified since the requested mtime failed with code "1"',
        "not supported between instances of 'float' and 'str'",
      ],
      asRendered: [
        'Getting the requested distro group in a rendered format failed with code "1"',
        'not subscriptable',
      ],
    },
    distroGroupXml,
    'distro',
  );

  runGroupSuite(
    'profile_group',
    {
      get: (objectId, flatten, resolved, tok) =>
        service.get_profile_group(objectId, flatten, resolved, tok),
      find: (criteria, expand, resolved, tok) =>
        service.find_profile_group(criteria, expand, resolved, tok),
      getHandle: (name) => service.get_profile_group_handle(name),
      remove: (objectId, tok, recursive) =>
        service.remove_profile_group(objectId, tok, recursive),
      copy: (objectId, newName, tok) =>
        service.copy_profile_group(objectId, newName, tok),
      rename: (objectId, newName, tok) =>
        service.rename_profile_group(objectId, newName, tok),
      create: (tok) => service.new_profile_group(tok),
      modify: (objectId, attribute, arg, tok) =>
        service.modify_profile_group(objectId, attribute, arg, tok),
      save: (objectId, withTriggers, withSync, editMode, tok) =>
        service.save_profile_group(
          objectId,
          withTriggers,
          withSync,
          editMode,
          tok,
        ),
      since: (mtime) => service.get_profile_groups_since(mtime),
      asRendered: (name, tok) =>
        service.get_profile_group_as_rendered(name, tok),
    },
    {
      get: [
        'Getting the requested profile group failed with code "1"',
        'Object not found',
      ],
      find: [
        'Finding the requested profile groups failed with code "1"',
        'critera search dictionary cannot be empty',
      ],
      handle: [
        'Getting the profile group handle failed with code "1"',
        'invalid object name',
      ],
      remove: [
        'Removing the requested profile group failed with code "1"',
        'removal would orphan',
      ],
      copy: [
        'Copying the requested profile group failed with code "1"',
        'not found',
      ],
      rename: [
        'Renaming the requested profile group failed with code "1"',
        'not found',
      ],
      create: ['Creating a new profile group failed with code "1"', 'token'],
      modify: [
        'Modifying the requested profile group failed with code "1"',
        'does-not-exist-uid',
        'not an existing "profile" item',
      ],
      // Note: save_profile_group's custom message uses "profile_group" (underscored),
      // unlike every other profile_group message which uses "profile group" (spaced).
      save: [
        'Saving the requested profile_group failed with code "1"',
        'Object not found',
      ],
      since: [
        'Getting the profile groups modified since the requested mtime failed with code "1"',
        "not supported between instances of 'float' and 'str'",
      ],
      asRendered: [
        'Getting the requested profile group in a rendered format failed with code "1"',
        'not subscriptable',
      ],
    },
    profileGroupXml,
    'profile',
  );

  runGroupSuite(
    'system_group',
    {
      get: (objectId, flatten, resolved, tok) =>
        service.get_system_group(objectId, flatten, resolved, tok),
      find: (criteria, expand, resolved, tok) =>
        service.find_system_group(criteria, expand, resolved, tok),
      getHandle: (name) => service.get_system_group_handle(name),
      remove: (objectId, tok, recursive) =>
        service.remove_system_group(objectId, tok, recursive),
      copy: (objectId, newName, tok) =>
        service.copy_system_group(objectId, newName, tok),
      rename: (objectId, newName, tok) =>
        service.rename_system_group(objectId, newName, tok),
      create: (tok) => service.new_system_group(tok),
      modify: (objectId, attribute, arg, tok) =>
        service.modify_system_group(objectId, attribute, arg, tok),
      save: (objectId, withTriggers, withSync, editMode, tok) =>
        service.save_system_group(
          objectId,
          withTriggers,
          withSync,
          editMode,
          tok,
        ),
      since: (mtime) => service.get_system_groups_since(mtime),
      asRendered: (name, tok) =>
        service.get_system_group_as_rendered(name, tok),
    },
    {
      get: [
        'Getting the requested system group failed with code "1"',
        'Object not found',
      ],
      find: [
        'Finding the requested system groups failed with code "1"',
        'critera search dictionary cannot be empty',
      ],
      handle: [
        'Getting the system group handle failed with code "1"',
        'invalid object name',
      ],
      remove: [
        'Removing the requested system group failed with code "1"',
        'removal would orphan',
      ],
      copy: [
        'Copying the requested system group failed with code "1"',
        'not found',
      ],
      rename: [
        'Renaming the requested system group failed with code "1"',
        'not found',
      ],
      create: ['Creating a new system group failed with code "1"', 'token'],
      modify: [
        'Modifying the requested system group failed with code "1"',
        'does-not-exist-uid',
        'not an existing "system" item',
      ],
      // Note: save_system_group's custom message uses "system_group" (underscored),
      // unlike every other system_group message which uses "system group" (spaced).
      save: [
        'Saving the requested system_group failed with code "1"',
        'Object not found',
      ],
      since: [
        'Getting the system groups modified since the requested mtime failed with code "1"',
        "not supported between instances of 'float' and 'str'",
      ],
      asRendered: [
        'Getting the requested system group in a rendered format failed with code "1"',
        'not subscriptable',
      ],
    },
    systemGroupXml,
    'system',
  );
});

// Fault coverage for the "misc" chunk of CobblerApiService methods: autoinstall/generation,
// signatures/breeds, sync/status/utils, input coercion helpers and transactions.
//
// Unlike the happy-path tests above, these exercise the `instanceOfMethodFault` branch of each
// wrapper method. Every `methodResponse` XML string below was captured verbatim from a real,
// live `compose.dev.yml` dev stack (http://localhost/cobbler_api) while genuinely triggering
// the fault, so the fixtures reflect actual backend behavior, not hand-written guesses.
describe('CobblerApiService - misc methods fault coverage', () => {
  const BAD_TOKEN = 'livetest-misc-invalid-token';
  let service: CobblerApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: AngularXmlrpcService,
          useClass: AngularXmlrpcService,
        },
        {
          provide: CobblerApiService,
          deps: [AngularXmlrpcService, COBBLER_URL],
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CobblerApiService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  /**
   * Subscribes to `obs`, flushes `methodResponse` (a real captured XML-RPC fault response) as the
   * mocked HTTP response, and asserts the thrown Error's message contains `messageContains`.
   */
  function expectFault(
    obs: Observable<unknown>,
    methodResponse: string,
    messageContains: string,
  ): void {
    obs.subscribe({
      next: () => {
        throw new Error('expected an error');
      },
      error: (err: Error) => {
        expect(err.message).toContain(messageContains);
      },
    });
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
  }

  describe('autoinstall/generation', () => {
    it('is_autoinstall_in_use faults for a nonexistent autoinstall template', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Requested autoinstall template not found!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.is_autoinstall_in_use(
          'livetest-misc-nonexistent-template',
          BAD_TOKEN,
        ),
        methodResponse,
        'Checking if the auto-installation is in use failed',
      );
    });

    it('generate_autoinstall faults for a nonexistent profile', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Ambigous or no search result for profile!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.generate_autoinstall(
          'livetest-misc-nonexistent-profile',
          'profile',
          'name',
          '',
          '',
        ),
        methodResponse,
        'Generating the auto-installation file failed',
      );
    });

    it('generate_bootcfg faults for a nonexistent profile', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'AttributeError'&gt;:'NoneType' object has no attribute 'get_conceptual_parent'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.generate_bootcfg('livetest-misc-nonexistent-profile', ''),
        methodResponse,
        'Generating the boofcfg for the requested profile or system failed',
      );
    });

    it('generate_script faults for an invalid script name', () => {
      // validate_autoinstall_script_name() rejects this before any profile/system lookup happens,
      // so no real fixtures are required.
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:\"name\" handed to generate_script was not valid!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.generate_script('x', '', 'bad name!'),
        methodResponse,
        'Generating the requested script for the system or profile failed',
      );
    });

    it('dump_vars faults for a nonexistent item uuid', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Item with uuid \"livetest-misc-bogus-uuid\" does not exist!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.dump_vars('livetest-misc-bogus-uuid'),
        methodResponse,
        'Dumping vars failed',
      );
    });

    it('get_blended_data faults when neither profile nor system is specified', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'internal error, no system or profile specified'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.get_blended_data('', ''),
        methodResponse,
        'Getting the blended data for the requested profile or system failed',
      );
    });

    it('get_tftp_file faults for an invalid token', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:\"token\" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.get_tftp_file('/etc/passwd', 0, 10, BAD_TOKEN),
        methodResponse,
        'Getting the requested TFTP file failed',
      );
    });
  });

  describe('sync/status/utils', () => {
    it('sync_dhcp faults for an invalid token (fails before any real sync work happens)', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:\"token\" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.sync_dhcp(BAD_TOKEN),
        methodResponse,
        'The sync DHCP action failed',
      );
    });

    it('sync faults for an invalid token (fails before any real sync work happens)', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:\"token\" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.sync(BAD_TOKEN),
        methodResponse,
        'The sync action failed',
      );
    });

    it('get_status faults for an invalid token', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:\"token\" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.get_status('normal', BAD_TOKEN),
        methodResponse,
        'Getting the status failed',
      );
    });

    it('get_config_data faults for a nonexistent hostname', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:The specified hostname did not exist or was ambigous!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.get_config_data('livetest-misc-nonexistent-host'),
        methodResponse,
        'Retrieving the configuration data failed',
      );
    });

    it('run_install_triggers faults for a nonexistent object (trigger execution fails)', () => {
      // run_install_triggers doesn't call check_access() either, but unlike disable_netboot /
      // upload_log_data it does genuinely fault: cobbler.modules.installation.pre_log raises
      // when it can't resolve the referenced system/profile, and that propagates as a real fault.
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'Cobbler trigger failed: cobbler.modules.installation.pre_log'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.run_install_triggers(
          'pre',
          'system',
          'livetest-misc-nonexistent-obj',
          '0.0.0.0',
          BAD_TOKEN,
        ),
        methodResponse,
        'Running the install triggers failed',
      );
    });

    it('get_random_mac faults for an unsupported virt type', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'virt mac assignment not yet supported'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.get_random_mac('livetest-misc-bogus-virt-type', BAD_TOKEN),
        methodResponse,
        'Getting a random MAC address failed',
      );
    });

    it('get_task_status faults for a nonexistent event id', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'no event with that id'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.get_task_status('livetest-misc-bogus-event-1787740047193'),
        methodResponse,
        'Getting the status of the requested task failed',
      );
    });
  });

  describe('input coercion', () => {
    it('input_string_or_list_no_inherit faults for a non-string/list/None value', () => {
      // The TS signature only allows string | Array<any>, but the backend
      // (input_converters.input_string_or_list_no_inherit) rejects any other type - e.g. a bare
      // number sent over the wire - with a TypeError. Cast through `any` to exercise that real,
      // reachable server-side validation.
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:invalid input type</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        (
          service.input_string_or_list_no_inherit as unknown as (
            v: unknown,
          ) => Observable<unknown>
        )(42),
        methodResponse,
        'Converting input string or list no inherit failed',
      );
    });

    it('input_string_or_list faults for a non-string/list/None value', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:invalid input type</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        (
          service.input_string_or_list as unknown as (
            v: unknown,
          ) => Observable<unknown>
        )(42),
        methodResponse,
        'Converting input string or list failed',
      );
    });

    it('input_string_or_dict_no_inherit faults for a list value', () => {
      // input_converters.input_string_or_dict_no_inherit explicitly rejects lists
      // ("No idea what to do with list: ..."), even though the TS signature allows Array<any>.
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:No idea what to do with list: ['a']</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.input_string_or_dict_no_inherit(['a'], true),
        methodResponse,
        'Converting input string or dictionary no inherit failed',
      );
    });

    it('input_string_or_dict faults for a list value', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:No idea what to do with list: ['a']</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.input_string_or_dict(['a'], true),
        methodResponse,
        'Converting input string or dictionary failed',
      );
    });

    it('input_boolean faults for a non-str/bool/int value', () => {
      // The TS signature only allows string | boolean | number, but the backend
      // (input_converters.input_boolean) rejects any other type - e.g. an array sent over the
      // wire - with a TypeError.
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:The value handed to the input_boolean function was not convertable due to a wrong type (found: &lt;class 'list'&gt;)!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        (
          service.input_boolean as unknown as (
            v: unknown,
          ) => Observable<unknown>
        )([1, 2]),
        methodResponse,
        'Converting input boolean failed',
      );
    });

    it('input_int faults for an unparseable string', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:value must be convertable to type int.</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.input_int('not-a-number'),
        methodResponse,
        'Converting input integer failed',
      );
    });
  });

  describe('transactions', () => {
    it('transaction_commit faults for a token with no prior transaction_begin', () => {
      // cobbler/remote.py transaction_commit() does `self.transactions[token]...` which raises a
      // KeyError (surfaced as a real XML-RPC fault) when no matching transaction_begin() call
      // preceded it - reliably reachable without any setup.
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'KeyError'&gt;:'livetest-misc-txn-commit-1787740047379'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.transaction_commit('livetest-misc-txn-commit-1787740047379'),
        methodResponse,
        'Commiting the current transaction failed',
      );
    });

    it('transaction_abort faults for a token with no prior transaction_begin', () => {
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'KeyError'&gt;:'livetest-misc-txn-abort-1787740047393'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      expectFault(
        service.transaction_abort('livetest-misc-txn-abort-1787740047393'),
        methodResponse,
        'Aborting the current transaction failed',
      );
    });
  });
});

// Fault-path coverage for the system / network_interface wrapper methods.
//
// The happy-path (`instanceOfMethodResponse`) branch for these methods is
// already covered above. This section only exercises the
// `instanceOfMethodFault` branch: every `methodResponse` string below is a
// REAL XML-RPC fault response captured verbatim from a live `compose.dev.yml`
// dev stack while exercising each of these code paths for real (invalid
// tokens, invalid object names, non-existent object ids, empty search
// criteria, malformed argument types, etc.) - nothing here was hand-written
// or guessed.
describe('CobblerApiService - system/network_interface fault paths', () => {
  const BOGUS_TOKEN = '0'.repeat(36); // correctly formatted (36 chars) but never a real, cached session token

  /**
   * Subscribes to `obs`, asserting it errors (rather than emitting a value),
   * and forwards the thrown `Error` to `assertions`. Call this BEFORE
   * flushing the mocked request/response pair.
   */
  function expectFault(
    obs: Observable<unknown>,
    assertions: (err: Error) => void,
  ): void {
    obs.subscribe({
      next: () => {
        throw new Error(
          'Expected the call to fail with an XML-RPC fault, but it succeeded instead.',
        );
      },
      error: (err: unknown) => assertions(err as Error),
    });
  }

  let service: CobblerApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: AngularXmlrpcService,
          useClass: AngularXmlrpcService,
        },
        {
          provide: CobblerApiService,
          deps: [AngularXmlrpcService, COBBLER_URL],
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CobblerApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('system', () => {
    it('background_syncsystems surfaces a fault for an invalid token', () => {
      const options: SyncSystemsOptions = { systems: [], verbose: false };
      expectFault(
        service.background_syncsystems(options, BOGUS_TOKEN),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Syncing the systems in background failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('background_power_system surfaces a fault for an invalid token', () => {
      const options: BackgroundPowerSystem = { systems: [], power: 'status' };
      expectFault(
        service.background_power_system(options, BOGUS_TOKEN),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Executing the power action for a system in the background failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('power_system surfaces a fault for a non-existent system uid', () => {
      expectFault(
        service.power_system(
          'livetest-sysni-nonexistent-uid',
          'status',
          'token',
        ),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Executing the power action for a system failed with code "1"',
          );
          expect(err.message).toContain('not found');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:System with uid "livetest-sysni-nonexistent-uid-1787740058588-1" not found</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_system surfaces a fault for a non-existent object id', () => {
      // Not a fresh live capture (get_system() became uid-based after this suite's other
      // fixtures were captured): the fault text mirrors modify_item()/save_item()'s
      // independently-verified "Object not found or ambigous match!" ValueError, since both
      // resolve object_id via the same __get_object() helper.
      expectFault(
        service.get_system('nonexistent-uid', false, false, 'token'),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the requested system failed with code "1"',
          );
          expect(err.message).toContain('Object not found');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('find_system surfaces a fault for empty search criteria', () => {
      expectFault(service.find_system({}, false, false, 'token'), (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain(
          'Finding the requested systems failed with code "1"',
        );
        expect(err.message).toContain(
          'critera search dictionary cannot be empty',
        );
      });
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:The critera search dictionary cannot be empty!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_system_handle surfaces a fault for an invalid object name', () => {
      expectFault(service.get_system_handle('invalid name!'), (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain(
          'Getting the system handle failed with code "1"',
        );
        expect(err.message).toContain('invalid object name');
      });
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object name'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('remove_system surfaces a fault for an invalid token', () => {
      expectFault(
        service.remove_system('any-object-id', BOGUS_TOKEN),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Removing the requested system failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('copy_system surfaces a fault for an invalid token', () => {
      expectFault(
        service.copy_system('any-object-id', 'copy-system-target', BOGUS_TOKEN),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Copying the requested system failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('rename_system surfaces a fault for an invalid token', () => {
      expectFault(
        service.rename_system(
          'any-object-id',
          'rename-system-target',
          BOGUS_TOKEN,
        ),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Renaming the requested system failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('new_system surfaces a fault for an invalid token', () => {
      expectFault(service.new_system(BOGUS_TOKEN), (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain(
          'Creating a new system failed with code "1"',
        );
        expect(err.message).toContain('invalid token');
      });
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('modify_system surfaces a fault for a non-existent object id', () => {
      expectFault(
        service.modify_system('nonexistent-uid', ['comment'], 'test', 'token'),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Modifying the requested system failed with code "1"',
          );
          expect(err.message).toContain('Object not found');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('save_system surfaces a fault for a non-existent object id', () => {
      expectFault(
        service.save_system('nonexistent-uid', true, true, 'bypass', 'token'),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Saving the requested system failed with code "1"',
          );
          expect(err.message).toContain('Object not found');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_valid_system_bootloaders surfaces a fault for a malformed system name', () => {
      expectFault(
        service.get_valid_system_bootloaders(
          ['a', 'b'] as unknown as string,
          'token',
        ),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the valid system boot loaders for the requested system failed with code "1"',
          );
          expect(err.message).toContain('unhashable type');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:unhashable type: 'list'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('register_new_system surfaces a fault because registration is disabled in settings', () => {
      // `register_new_installs` is disabled by default in the dev stack
      // settings, so `remote.py::register_new_system` raises before it even
      // looks at the submitted info - this is a reliable, deterministic
      // fault trigger regardless of the (still schema-valid) payload below.
      const info: RegisterOptions = {
        name: 'livetest-sysni-register',
        profile: 'does-not-matter',
        hostname: 'does-not-matter.example.org',
        interfaces: { eth0: {} },
      };
      expectFault(service.register_new_system(info, 'token'), (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain(
          'Registering a new system failed with code "1"',
        );
        expect(err.message).toContain(
          'registration is disabled in cobbler settings',
        );
      });
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'registration is disabled in cobbler settings'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_systems_since surfaces a fault for a malformed mtime', () => {
      expectFault(
        service.get_systems_since('not-a-number' as unknown as number),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the systems modified since the requested mtime failed with code "1"',
          );
          expect(err.message).toContain('not supported between instances');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:'&gt;=' not supported between instances of 'float' and 'str'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('find_system_by_dns_name surfaces a fault for a malformed dns name', () => {
      expectFault(
        service.find_system_by_dns_name(['a', 'b'] as unknown as string),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Finding a system by its DNS name failed with code "1"',
          );
          expect(err.message).toContain(
            "'list' object has no attribute 'startswith'",
          );
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'AttributeError'&gt;:'list' object has no attribute 'startswith'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_system_as_rendered surfaces a fault for a malformed name', () => {
      expectFault(
        service.get_system_as_rendered(['a'] as unknown as string, 'token'),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the requested system in a rendered format failed with code "1"',
          );
          expect(err.message).toContain('unhashable type');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:unhashable type: 'list'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('clear_system_logs surfaces a fault for an invalid token', () => {
      expectFault(
        service.clear_system_logs('nonexistent-uid', BOGUS_TOKEN),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Clearing the system logs failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });
  });

  describe('network_interface', () => {
    it('get_network_interface surfaces a fault for a non-existent object id', () => {
      // Not a fresh live capture, same rationale as the sibling get_system test above.
      expectFault(
        service.get_network_interface('nonexistent-uid', false, false, 'token'),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the requested network interface failed with code "1"',
          );
          expect(err.message).toContain('Object not found');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('find_network_interface surfaces a fault for empty search criteria', () => {
      expectFault(
        service.find_network_interface({}, false, false, 'token'),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Finding the requested network interface failed with code "1"',
          );
          expect(err.message).toContain(
            'critera search dictionary cannot be empty',
          );
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:The critera search dictionary cannot be empty!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_network_interface_handle surfaces a fault for an invalid object name', () => {
      expectFault(
        service.get_network_interface_handle('invalid name!'),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the network interface handle failed with code "1"',
          );
          expect(err.message).toContain('invalid object name');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object name'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('remove_network_interface surfaces a fault for an invalid token', () => {
      expectFault(
        service.remove_network_interface('any-object-id', BOGUS_TOKEN),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Removing the requested network interface failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('copy_network_interface surfaces a fault for an invalid token', () => {
      expectFault(
        service.copy_network_interface(
          'any-object-id',
          'copy-ni-target',
          BOGUS_TOKEN,
        ),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Copying the requested network interface failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('rename_network_interface surfaces a fault for an invalid token', () => {
      expectFault(
        service.rename_network_interface(
          'any-object-id',
          'rename-ni-target',
          BOGUS_TOKEN,
        ),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Renaming the requested network interface failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('new_network_interface surfaces a fault for an invalid token', () => {
      expectFault(
        service.new_network_interface('any-system-uid', BOGUS_TOKEN),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Creating a new network interface failed with code "1"',
          );
          expect(err.message).toContain('invalid token');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid token: 000000000000000000000000000000000000'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('modify_network_interface surfaces a fault for a non-existent object id', () => {
      expectFault(
        service.modify_network_interface(
          'nonexistent-uid',
          ['dns_name'],
          'test.example.org',
          'token',
        ),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Modifying the requested network interface failed with code "1"',
          );
          expect(err.message).toContain('Object not found');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('save_network_interface surfaces a fault for a non-existent object id', () => {
      expectFault(
        service.save_network_interface(
          'nonexistent-uid',
          true,
          true,
          'bypass',
          'token',
        ),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Saving the requested network interface failed with code "1"',
          );
          expect(err.message).toContain('Object not found');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_network_interfaces_since surfaces a fault for a malformed mtime', () => {
      expectFault(
        service.get_network_interfaces_since(
          'not-a-number' as unknown as number,
        ),
        (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain(
            'Getting the network interfaces modified since the requested mtime failed with code "1"',
          );
          expect(err.message).toContain('not supported between instances');
        },
      );
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:'&gt;=' not supported between instances of 'float' and 'str'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });
  });
});

// Diff-coverage fault-branch tests for the `template`, `background_*`, `event` and `settings`
// method groups. Every fixture below is a REAL response captured from a live `compose.dev.yml`
// dev stack (http://localhost/cobbler_api) - nothing here is hand-written/guessed XML.
//
// A few tests (`remove_template`, `modify_template`, `save_template`, `get_template_content`)
// originally required a real, previously-created object (or a real logged-in token) to reach
// their fault branch on the live server; now that the response is mocked, only the single
// fault-triggering call is exercised - the object id/token values passed in are arbitrary
// placeholders since HttpTestingController matches requests by URL, not by body content.
describe('CobblerApiService - template/background/event/settings faults', () => {
  let service: CobblerApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: AngularXmlrpcService,
          useClass: AngularXmlrpcService,
        },
        {
          provide: CobblerApiService,
          deps: [AngularXmlrpcService, COBBLER_URL],
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CobblerApiService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  // ---------------------------------------------------------------------------------------
  // template
  // ---------------------------------------------------------------------------------------

  describe('template methods', () => {
    it('get_template surfaces a fault for a non-existent object id', () => {
      // get_template() now resolves its first argument as an object id/uid (matching
      // modify_item()/save_item()'s contract), not a name - an id that doesn't resolve to any
      // real item raises ValueError("Object not found or ambigous match!") via __get_object().
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .get_template('nonexistent-uid', false, false, 'sometoken')
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Getting the requested template failed with code "1" and error message ".*Object not found.*"/,
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('find_template surfaces a fault for an empty criteria object', () => {
      // Captured live: api.find_items() raises ValueError("The critera search dictionary
      // cannot be empty!") whenever the criteria dict is empty - uncaught, it propagates as an
      // XML-RPC fault.
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:The critera search dictionary cannot be empty!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.find_template({}, false, false, 'sometoken').subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toMatch(
            /Finding the requested template failed with code "1" and error message ".*critera search dictionary cannot be empty.*"/,
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_template_handle surfaces a fault for a syntactically invalid name', () => {
      // Note: unlike every other wrapper method, get_template_handle()'s Error message is
      // missing the closing `"` after the faultString (see cobbler-api.service.ts) - the regex
      // below intentionally does not require a trailing quote to match the real message.
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'cobbler.cexceptions.CX'&gt;:'invalid object name'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_template_handle('livetest-tmplbg/invalid!').subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toMatch(
            /Getting the template handle failed with code "1" and error message ".*invalid object name/,
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('remove_template surfaces a fault when the token is invalid, even for a real object', () => {
      // Captured live against a real, previously-created template: remove_item() swallows a
      // "not found" ValueError and just returns `false` (not a fault), so the fault branch only
      // fires once check_access() is reached, which requires the object lookup to succeed first.
      // Since the response is mocked here, the object id below is an arbitrary placeholder.
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .remove_template('some-existing-uid', 'bogus-token', false)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Removing the requested template failed with code "1" and error message ".*did not have the correct format or type.*"/,
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('copy_template surfaces a fault when the token is invalid', () => {
      // Captured live: check_access() runs before any object lookup for copy_item(), so a
      // bogus (nonexistent) object id combined with a malformed token still surfaces the
      // token-format fault first.
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .copy_template(
          'livetest-tmplbg-nonexistent',
          'livetest-tmplbg-copy',
          'bogus-token',
        )
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Copying the requested template failed with code "1" and error message ".*did not have the correct format or type.*"/,
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('rename_template surfaces a fault when the token is invalid', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .rename_template(
          'livetest-tmplbg-nonexistent',
          'livetest-tmplbg-renamed',
          'bogus-token',
        )
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Renaming the requested template failed with code "1" and error message ".*did not have the correct format or type.*"/,
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('new_template surfaces a fault when the token is invalid', () => {
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.new_template('bogus-token').subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toMatch(
            /Creating a new template failed with code "1" and error message ".*did not have the correct format or type.*"/,
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('modify_template surfaces a fault for a nonexistent object id', () => {
      // Captured live: modify_item() calls __get_object(object_id, token) first; for an id that
      // doesn't match any item this raises ValueError("Object not found or ambigous match!")
      // uncaught, before the token is ever checked via check_access().
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .modify_template(
          'livetest-tmplbg-nonexistent',
          ['name'],
          'irrelevant',
          'sometoken',
        )
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Modifying the requested template failed with code "1" and error message ".*Object not found or ambigous match.*"/,
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('save_template surfaces a fault for a nonexistent object id', () => {
      // Same __get_object() lookup as modify_item(), performed before check_access().
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .save_template(
          'livetest-tmplbg-nonexistent',
          true,
          true,
          'bypass',
          'sometoken',
        )
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Saving the requested template failed with code "1" and error message ".*Object not found or ambigous match.*"/,
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_template_content surfaces a fault for a nonexistent uid', () => {
      // Captured live: get_template_content() only type-checks uid/token (both str here, so
      // that check passes), then calls __get_object(uid, token) directly with no access check;
      // a nonexistent uid raises ValueError("Object not found or ambigous match!") uncaught.
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:Object not found or ambigous match!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .get_template_content('livetest-tmplbg-nonexistent-uid', 'sometoken')
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Getting the content of the requested template failed with code "1" and error message ".*Object not found or ambigous match.*"/,
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_templates_since surfaces a fault for a non-numeric mtime', () => {
      // Captured live: api.__since() compares `item.mtime >= mtime`; passing a string where a
      // float is declared (bypassing the TS type via `as any`, which a real untyped/JS caller
      // could do) makes Python raise
      // TypeError('>=' not supported between instances of 'float' and 'str').
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:'&gt;=' not supported between instances of 'float' and 'str'</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service
        .get_templates_since('not-a-number' as unknown as number)
        .subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Getting the templates modified since the requested mtime failed with code "1" and error message ".*not supported between instances.*"/,
            );
          },
        });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });
  });

  // ---------------------------------------------------------------------------------------
  // background_*
  // ---------------------------------------------------------------------------------------

  describe(
    'background_* methods (invalid token, verified live: fault always raised before ' +
      'any real background work starts)',
    () => {
      it('background_buildiso surfaces a fault for an invalid token', () => {
        // eslint-disable-next-line max-len
        const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
        service
          .background_buildiso(
            {
              iso: '',
              profiles: '',
              systems: '',
              buildisodir: '',
              distro: '',
              standalone: false,
              airgapped: false,
              source: '',
              excludeDNS: false,
              xorrisofsOpts: '',
            },
            'bogus-token',
          )
          .subscribe({
            next: () => {
              throw new Error('expected an error');
            },
            error: (err) => {
              expect(err.message).toMatch(
                /Building the ISO in the background failed with code "1" and error message ".*did not have the correct format or type.*"/,
              );
            },
          });
        const mockRequest = httpTestingController.expectOne(
          'http://localhost/cobbler_api',
        );
        mockRequest.flush(methodResponse);
      });

      it('background_aclsetup surfaces a fault for an invalid token', () => {
        // eslint-disable-next-line max-len
        const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
        service
          .background_aclsetup(
            { adduser: '', addgroup: '', removeuser: '', removegroup: '' },
            'bogus-token',
          )
          .subscribe({
            next: () => {
              throw new Error('expected an error');
            },
            error: (err) => {
              expect(err.message).toMatch(
                /Applying the ACLs in the background failed with code "1" and error message ".*did not have the correct format or type.*"/,
              );
            },
          });
        const mockRequest = httpTestingController.expectOne(
          'http://localhost/cobbler_api',
        );
        mockRequest.flush(methodResponse);
      });

      it('background_sync surfaces a fault for an invalid token', () => {
        // eslint-disable-next-line max-len
        const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
        service
          .background_sync(
            { dhcp: false, dns: false, verbose: false },
            'bogus-token',
          )
          .subscribe({
            next: () => {
              throw new Error('expected an error');
            },
            error: (err) => {
              expect(err.message).toMatch(
                /Executing a sync in the background failed with code "1" and error message ".*did not have the correct format or type.*"/,
              );
            },
          });
        const mockRequest = httpTestingController.expectOne(
          'http://localhost/cobbler_api',
        );
        mockRequest.flush(methodResponse);
      });

      it('background_hardlink surfaces a fault for an invalid token', () => {
        // eslint-disable-next-line max-len
        const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
        service.background_hardlink('bogus-token').subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Hardlinking files on the server in the background failed with code "1" and error message ".*did not have the correct format or type.*"/,
            );
          },
        });
        const mockRequest = httpTestingController.expectOne(
          'http://localhost/cobbler_api',
        );
        mockRequest.flush(methodResponse);
      });

      it('backgroundMkloaders surfaces a fault for an invalid token', () => {
        // eslint-disable-next-line max-len
        const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
        service.backgroundMkloaders('bogus-token').subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Mkloading files on the server in the background failed with code "1" and error message ".*did not have the correct format or type.*"/,
            );
          },
        });
        const mockRequest = httpTestingController.expectOne(
          'http://localhost/cobbler_api',
        );
        mockRequest.flush(methodResponse);
      });

      it('background_validate_autoinstall_files surfaces a fault for an invalid token', () => {
        // eslint-disable-next-line max-len
        const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
        service.background_validate_autoinstall_files('bogus-token').subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Validation of auto-installation files in the background failed with code "1" and error message ".*did not have the correct format or type.*"/,
            );
          },
        });
        const mockRequest = httpTestingController.expectOne(
          'http://localhost/cobbler_api',
        );
        mockRequest.flush(methodResponse);
      });

      it('background_replicate surfaces a fault for an invalid token', () => {
        // eslint-disable-next-line max-len
        const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
        service
          .background_replicate(
            {
              master: '',
              port: '',
              distro_patterns: '',
              profile_patterns: '',
              system_patterns: '',
              repo_patterns: '',
              image_patterns: '',
              prune: false,
              omit_data: false,
              sync_all: false,
              use_ssl: false,
            },
            'bogus-token',
          )
          .subscribe({
            next: () => {
              throw new Error('expected an error');
            },
            error: (err) => {
              expect(err.message).toMatch(
                /Replicating the Cobbler instance in the background failed with code "1" and error message ".*did not have the correct format or type.*"/,
              );
            },
          });
        const mockRequest = httpTestingController.expectOne(
          'http://localhost/cobbler_api',
        );
        mockRequest.flush(methodResponse);
      });

      it('background_import surfaces a fault for an invalid token', () => {
        // eslint-disable-next-line max-len
        const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
        service
          .background_import(
            {
              path: '',
              name: '',
              available_as: '',
              autoinstall_file: '',
              rsync_flags: '',
              arch: '',
              breed: '',
              os_version: '',
            },
            'bogus-token',
          )
          .subscribe({
            next: () => {
              throw new Error('expected an error');
            },
            error: (err) => {
              expect(err.message).toMatch(
                /Importing an ISO on the server in the background failed with code "1" and error message ".*did not have the correct format or type.*"/,
              );
            },
          });
        const mockRequest = httpTestingController.expectOne(
          'http://localhost/cobbler_api',
        );
        mockRequest.flush(methodResponse);
      });

      it('background_signature_update surfaces a fault for an invalid token', () => {
        // eslint-disable-next-line max-len
        const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
        service.background_signature_update('bogus-token').subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Updating the signatures in the background failed with code "1" and error message ".*did not have the correct format or type.*"/,
            );
          },
        });
        const mockRequest = httpTestingController.expectOne(
          'http://localhost/cobbler_api',
        );
        mockRequest.flush(methodResponse);
      });

      it('background_signature_reload surfaces a fault for an invalid token', () => {
        // eslint-disable-next-line max-len
        const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
        service.background_signature_reload('bogus-token').subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Reloading the signatures in the background failed with code "1" and error message ".*did not have the correct format or type.*"/,
            );
          },
        });
        const mockRequest = httpTestingController.expectOne(
          'http://localhost/cobbler_api',
        );
        mockRequest.flush(methodResponse);
      });

      it('background_templates_refresh_content surfaces a fault for an invalid token', () => {
        // eslint-disable-next-line max-len
        const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
        service.background_templates_refresh_content('bogus-token').subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Refreshing the template contents in the background failed with code "1" and error message ".*did not have the correct format or type.*"/,
            );
          },
        });
        const mockRequest = httpTestingController.expectOne(
          'http://localhost/cobbler_api',
        );
        mockRequest.flush(methodResponse);
      });

      it('templates_refresh_content surfaces a fault for an invalid token', () => {
        // Not a background_* method, but shares the same check_access()-first pattern.
        // eslint-disable-next-line max-len
        const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'ValueError'&gt;:"token" did not have the correct format or type!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
        service.templates_refresh_content([], 'bogus-token').subscribe({
          next: () => {
            throw new Error('expected an error');
          },
          error: (err) => {
            expect(err.message).toMatch(
              /Refreshing the template contents failed with code "1" and error message ".*did not have the correct format or type.*"/,
            );
          },
        });
        const mockRequest = httpTestingController.expectOne(
          'http://localhost/cobbler_api',
        );
        mockRequest.flush(methodResponse);
      });
    },
  );

  // ---------------------------------------------------------------------------------------
  // event
  // ---------------------------------------------------------------------------------------

  describe('event methods', () => {
    it('get_events surfaces a fault for a non-string forUser', () => {
      // Captured live: get_events() only accepts a real str for `for_user` (may be empty, but
      // must be str); a non-string (bypassing the TS type via `as any`) raises
      // TypeError('"for_user" must be of type str (may be empty str)!') uncaught.
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:"for_user" must be of type str (may be empty str)!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_events(12345 as unknown as string).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toMatch(
            /Getting the events failed with code "1" and error message ".*for_user.*must be of type str.*"/,
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });

    it('get_event_log surfaces a fault for a non-string eventId', () => {
      // Captured live: nonexistent-but-string event ids just return "?" (a normal response, not
      // a fault); the real fault path is the eventId type check:
      // TypeError('"event_id" must be of type str!').
      // eslint-disable-next-line max-len
      const methodResponse = `<?xml version='1.0'?>\n<methodResponse>\n<fault>\n<value><struct>\n<member>\n<name>faultCode</name>\n<value><int>1</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>&lt;class 'TypeError'&gt;:"event_id" must be of type str!</string></value>\n</member>\n</struct></value>\n</fault>\n</methodResponse>\n`;
      service.get_event_log(12345 as unknown as string).subscribe({
        next: () => {
          throw new Error('expected an error');
        },
        error: (err) => {
          expect(err.message).toMatch(
            /Getting the event log failed with code "1" and error message ".*event_id.*must be of type str.*"/,
          );
        },
      });
      const mockRequest = httpTestingController.expectOne(
        'http://localhost/cobbler_api',
      );
      mockRequest.flush(methodResponse);
    });
  });
});
