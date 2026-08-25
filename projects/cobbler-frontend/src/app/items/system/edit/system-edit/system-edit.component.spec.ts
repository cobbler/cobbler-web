import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { SystemEditComponent } from './system-edit.component';

describe('SystemEditComponent', () => {
  let component: SystemEditComponent;
  let fixture: ComponentFixture<SystemEditComponent>;
  let httpTestingController: HttpTestingController;

  // Captured live from a Cobbler 4.0.0b1 dev instance (same fixture used by
  // cobbler-api.service.spec.ts's "should convert the nested structs of a real Cobbler 4.0.0
  // get_system response into plain objects" test). Carries non-default power/dns data and
  // <<inherit>>-sentinel virt/tftp data, so it exercises both branches of
  // Utils.patchFormGroupInherited for the fields fixed by this task.
  // eslint-disable-next-line max-len
  const systemMethodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>ctime</name><value><double>1787509606.0302052</double></value></member><member><name>mtime</name><value><double>1787509606.0302052</double></value></member><member><name>uid</name><value><string>5a1d7b47cd424c5aa4b5b63853df4fc7</string></value></member><member><name>name</name><value><string>t4system</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>depth</name><value><int>2</int></value></member><member><name>parent</name><value><string></string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>kernel_options</name><value><struct><member><name>rd.debug</name><value><string>~</string></value></member><member><name>ip</name><value><string>dhcp</string></value></member></struct></value></member><member><name>kernel_options_post</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>autoinstall_meta</name><value><struct><member><name>sysmeta</name><value><string>yes</string></value></member></struct></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>ipv6_autoconfiguration</name><value><boolean>0</boolean></value></member><member><name>repos_enabled</name><value><boolean>0</boolean></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_loaders</name><value><array><data><value><string>&lt;&lt;inherit&gt;&gt;</string></value></data></array></value></member><member><name>dns</name><value><struct><member><name>name_servers</name><value><array><data><value><string>198.51.100.1</string></value></data></array></value></member><member><name>name_servers_search</name><value><array><data></data></array></value></member></struct></value></member><member><name>enable_ipxe</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>gateway</name><value><string></string></value></member><member><name>hostname</name><value><string></string></value></member><member><name>image</name><value><string></string></value></member><member><name>ipv6_default_device</name><value><string></string></value></member><member><name>netboot_enabled</name><value><boolean>0</boolean></value></member><member><name>tftp</name><value><struct><member><name>next_server_v4</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>next_server_v6</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></member><member><name>filename</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>power</name><value><struct><member><name>address</name><value><string>192.0.2.10</string></value></member><member><name>id</name><value><string></string></value></member><member><name>password</name><value><string></string></value></member><member><name>type</name><value><string>ipmilanplus</string></value></member><member><name>user</name><value><string>admin</string></value></member><member><name>options</name><value><string></string></value></member><member><name>identity_file</name><value><string></string></value></member></struct></value></member><member><name>profile</name><value><string>0b5d3ef680694a18a21fe2b86d147bf0</string></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_org</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_user</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_password</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>server</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>status</name><value><string></string></value></member><member><name>virt</name><value><struct><member><name>auto_boot</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>cpus</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>disk_driver</name><value><string>qcow2</string></value></member><member><name>file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>path</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>pxe_boot</name><value><boolean>0</boolean></value></member><member><name>ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>type</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>uefi</name><value><boolean>0</boolean></value></member></struct></value></member><member><name>serial_device</name><value><int>-1</int></value></member><member><name>serial_baud_rate</name><value><int>-1</int></value></member><member><name>display_name</name><value><string></string></value></member><member><name>kickstart</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ks_meta</name><value><struct><member><name>sysmeta</name><value><string>yes</string></value></member></struct></value></member></struct></value></param></params></methodResponse>`;

  const bootloadersResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>grub</string></value></data></array></value></param></params></methodResponse>`;

  // Minimal (not full-item) fixtures for the uid->name lookups the ITEM_REFERENCE fields need.
  // The fixture's `profile` value is a real-looking uid, so it's reused here to exercise
  // resolution end-to-end against a matching option.
  const profilesResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>uid</name><value><string>0b5d3ef680694a18a21fe2b86d147bf0</string></value></member><member><name>name</name><value><string>Test Profile Name</string></value></member></struct></value></data></array></value></param></params></methodResponse>`;
  const imagesResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data></data></array></value></param></params></methodResponse>`;
  const systemsResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>uid</name><value><string>5a1d7b47cd424c5aa4b5b63853df4fc7</string></value></member><member><name>name</name><value><string>t4system</string></value></member></struct></value><value><struct><member><name>uid</name><value><string>other-system-uid</string></value></member><member><name>name</name><value><string>Other System</string></value></member></struct></value></data></array></value></param></params></methodResponse>`;

  const settingsResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>pxe_just_once</name><value><boolean>0</boolean></value></member></struct></value></param></params></methodResponse>`;

  const trueResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

  const handleResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>test-system-handle</string></value></param></params></methodResponse>`;

  /** Parses a captured XML-RPC request body and asserts that it is well-formed XML. */
  function parseRequestBody(body: string): Document {
    expect(typeof body).toEqual('string');
    const document = new DOMParser().parseFromString(body, 'text/xml');
    expect(document.getElementsByTagName('parsererror').length).toEqual(0);
    return document;
  }

  /** Returns the ``<value>`` element of the n-th ``<param>`` of a serialized ``<methodCall>``. */
  function paramValue(document: Document, index: number): Element {
    const params = document.getElementsByTagName('param');
    expect(params.length).toBeGreaterThan(index);
    const value = params[index].firstElementChild;
    expect(value).not.toBeNull();
    expect(value?.tagName).toEqual('value');
    return value as Element;
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
      case 'array':
        return Array.from(typed.getElementsByTagName('data')[0].children).map(
          (element) => valueToJs(element),
        );
      default:
        throw new Error(`Unsupported value type "${typed.tagName}"`);
    }
  }

  /** Flushes get_system + the parallel bootloaders/profiles/images/systems requests refreshData() fires. */
  function flushSystemAndBootloaders(): void {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_system</methodName>'),
      )
      .flush(systemMethodResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes(
          '<methodName>get_valid_system_boot_loaders</methodName>',
        ),
      )
      .flush(bootloadersResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_profiles</methodName>'),
      )
      .flush(profilesResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_images</methodName>'),
      )
      .flush(imagesResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_systems</methodName>'),
      )
      .flush(systemsResponse);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemEditComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'testsystem',
              },
            },
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SystemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads power/virt/dns/tftp fields from their real nested attribute paths on refreshData()', () => {
    const settingsRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>get_settings</methodName>'),
    );
    settingsRequest.flush(settingsResponse);

    flushSystemAndBootloaders();

    // profile/image/parent — ITEM_REFERENCE fields: raw uid stays the form value, options carry
    // the uid/name pairs used to resolve a display name/link.
    expect(component.systemFormGroup.get('profile').value).toEqual(
      '0b5d3ef680694a18a21fe2b86d147bf0',
    );
    const profileInput = component.systemEditableInputData.find(
      (input) => input.formControlName === 'profile',
    );
    expect(profileInput?.options).toEqual([
      {
        value: '0b5d3ef680694a18a21fe2b86d147bf0',
        label: 'Test Profile Name',
      },
    ]);
    const parentInput = component.systemEditableInputData.find(
      (input) => input.formControlName === 'parent',
    );
    // The system being edited (uid 5a1d7b47cd424c5aa4b5b63853df4fc7) must be excluded from its
    // own parent options — a system cannot be its own parent.
    expect(parentInput?.options).toEqual([
      { value: 'other-system-uid', label: 'Other System' },
    ]);

    // power.* — plain, non-inheritable fields read from the nested `power` sub-object.
    expect(component.systemFormGroup.get('power_address').value).toEqual(
      '192.0.2.10',
    );
    expect(component.systemFormGroup.get('power_type').value).toEqual(
      'ipmilanplus',
    );
    expect(component.systemFormGroup.get('power_user').value).toEqual('admin');
    expect(component.systemFormGroup.get('power_id').value).toEqual('');

    // dns.* — plain, non-inheritable array fields read from the nested `dns` sub-object.
    expect(component.systemFormGroup.get('name_servers').value).toEqual([
      '198.51.100.1',
    ]);
    expect(component.systemFormGroup.get('name_servers_search').value).toEqual(
      [],
    );

    // virt.pxe_boot — plain boolean, not inheritable.
    expect(component.systemFormGroup.get('virt_pxe_boot').value).toEqual(false);

    // virt.cpus/ram/file_size/auto_boot — number/boolean-typed, all `<<inherit>>` in the fixture:
    // the visible control must show its default (not the literal sentinel string), and the hidden
    // `_inherited` flag must be set.
    expect(component.systemFormGroup.get('virt_cpus').value).toEqual(0);
    expect(component.systemFormGroup.get('virt_cpus_inherited').value).toEqual(
      true,
    );
    expect(component.systemFormGroup.get('virt_ram').value).toEqual(0);
    expect(component.systemFormGroup.get('virt_file_size').value).toEqual(0);
    expect(component.systemFormGroup.get('virt_auto_boot').value).toEqual(
      false,
    );
    expect(
      component.systemFormGroup.get('virt_auto_boot_inherited').value,
    ).toEqual(true);

    // virt.disk_driver/path/type and tftp.next_server_v4/v6 are bare-string fields (like the
    // existing redhat_management_key): displayed as the raw string, including the literal
    // "<<inherit>>" sentinel, with no separate `_inherited` control (patchFormGroupInherited()
    // cannot be used here — it would treat every real string value as "inherited"). disk_driver
    // is deliberately a real, concrete, non-inherited value in this fixture (unlike path/type) so
    // this test alone would catch the regression this task previously introduced and fixed: using
    // patchFormGroupInherited() on a bare-string field blanks out real values.
    expect(component.systemFormGroup.get('virt_disk_driver').value).toEqual(
      'qcow2',
    );
    expect(component.systemFormGroup.get('virt_path').value).toEqual(
      '<<inherit>>',
    );
    expect(component.systemFormGroup.get('virt_type').value).toEqual(
      '<<inherit>>',
    );
    expect(component.systemFormGroup.get('next_server_v4').value).toEqual(
      '<<inherit>>',
    );
    expect(component.systemFormGroup.get('next_server_v6').value).toEqual(
      '<<inherit>>',
    );
    expect(component.systemFormGroup.get('next_server_v4_inherited')).toEqual(
      null,
    );
  });

  it('sends the real nested attribute path for one dirtied power/virt/dns/tftp field each on save', () => {
    // Get the component into edit mode with a populated `system` so saveSystem()/editSystem() can run.
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_settings</methodName>'),
      )
      .flush(settingsResponse);
    flushSystemAndBootloaders();

    component.editSystem();

    const dirty: Array<[string, any]> = [
      ['power_address', '192.0.2.99'],
      ['virt_cpus', 4],
      ['name_servers', ['203.0.113.1']],
      ['next_server_v4', '203.0.113.53'],
    ];
    for (const [control, value] of dirty) {
      const formControl = component.systemFormGroup.get(control);
      formControl.setValue(value);
      formControl.markAsDirty();
    }

    component.saveSystem();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_system_handle</methodName>'),
      )
      .flush(handleResponse);

    const modifyRequests = httpTestingController.match((req) =>
      req.body.includes('<methodName>modify_system</methodName>'),
    );
    expect(modifyRequests.length).toEqual(dirty.length);

    const expectedPaths: Record<string, string[]> = {
      power_address: ['power', 'address'],
      virt_cpus: ['virt', 'cpus'],
      name_servers: ['dns', 'name_servers'],
      next_server_v4: ['tftp', 'next_server_v4'],
    };
    const seenPaths = new Set<string>();
    for (const request of modifyRequests) {
      const document = parseRequestBody(request.request.body);
      expect(
        document.getElementsByTagName('methodName')[0].textContent,
      ).toEqual('modify_system');
      expect(valueToJs(paramValue(document, 0))).toEqual('test-system-handle');
      const path = valueToJs(paramValue(document, 1)) as string[];
      const key = Object.keys(expectedPaths).find(
        (candidate) =>
          JSON.stringify(expectedPaths[candidate]) === JSON.stringify(path),
      );
      expect(key).toBeDefined();
      seenPaths.add(key as string);
      const value = valueToJs(paramValue(document, 2));
      const [, expectedValue] = dirty.find(([control]) => control === key) as [
        string,
        any,
      ];
      expect(value).toEqual(expectedValue);
      request.flush(trueResponse);
    }
    expect(seenPaths.size).toEqual(dirty.length);

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_system</methodName>'),
      )
      .flush(trueResponse);
  });

  it('toggling the "Inherited" checkbox for virt_auto_boot disables the field and sends <<inherit>> on save', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_settings</methodName>'),
      )
      .flush(settingsResponse);
    flushSystemAndBootloaders();

    component.editSystem();

    // The fixture's virt.auto_boot is `<<inherit>>`, so editSystem() must start the value control
    // disabled, exactly like the pre-existing owners/boot_loaders/kernel_options/etc. fields do
    // when their current value is the inherit sentinel.
    expect(component.systemFormGroup.get('virt_auto_boot').disabled).toEqual(
      true,
    );

    // Un-inherit via the checkbox: getInheritObservable() must re-enable the value control.
    const inheritedControl = component.systemFormGroup.get(
      'virt_auto_boot_inherited',
    );
    inheritedControl.setValue(false as never);
    expect(component.systemFormGroup.get('virt_auto_boot').disabled).toEqual(
      false,
    );

    // Re-inherit via the checkbox, exactly as a user restoring inheritance would in the UI.
    inheritedControl.setValue(true as never);
    inheritedControl.markAsDirty();
    // getInheritObservable() must disable the underlying value control again, matching every
    // other inheritable field's behavior.
    expect(component.systemFormGroup.get('virt_auto_boot').disabled).toEqual(
      true,
    );

    component.saveSystem();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_system_handle</methodName>'),
      )
      .flush(handleResponse);

    const modifyRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>modify_system</methodName>'),
    );
    const document = parseRequestBody(modifyRequest.request.body);
    expect(valueToJs(paramValue(document, 1))).toEqual(['virt', 'auto_boot']);
    expect(valueToJs(paramValue(document, 2))).toEqual('<<inherit>>');
    modifyRequest.flush(trueResponse);

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_system</methodName>'),
      )
      .flush(trueResponse);
  });

  it('saves with nothing dirty by calling save_system directly and exits edit mode', () => {
    // combineLatest([]) never emits, so saveSystem() must short-circuit around it instead of
    // hanging with modifyObservables empty (no dirty fields).
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_settings</methodName>'),
      )
      .flush(settingsResponse);
    flushSystemAndBootloaders();

    component.editSystem();

    component.saveSystem();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_system_handle</methodName>'),
      )
      .flush(handleResponse);

    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>modify_system</methodName>'),
    );

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_system</methodName>'),
      )
      .flush(trueResponse);

    expect(component.isEditMode).toBe(false);
  });

  it('deletes by uid, not by name (Cobbler 4.0.0 requires an object id for remove_system)', () => {
    flushSystemAndBootloaders();

    component.removeSystem();

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_system</methodName>'),
    );
    const document = parseRequestBody(removeRequest.request.body);
    // Passing the name ('t4system') here would silently delete nothing under Cobbler 4.0.0.
    expect(valueToJs(paramValue(document, 0))).toEqual(
      '5a1d7b47cd424c5aa4b5b63853df4fc7',
    );
    removeRequest.flush(trueResponse);
  });
});
