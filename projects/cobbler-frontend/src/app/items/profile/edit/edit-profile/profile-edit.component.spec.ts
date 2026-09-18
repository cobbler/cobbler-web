import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { ProfileEditComponent } from './profile-edit.component';

describe('ProfileEditComponent', () => {
  let component: ProfileEditComponent;
  let fixture: ComponentFixture<ProfileEditComponent>;
  let httpTestingController: HttpTestingController;

  // A synthetic but well-formed Cobbler 4.0.0 get_profile response, modelled after the real
  // captured get_system fixture used in cobbler-api.service.spec.ts / system-edit.component.spec.ts
  // (same nested `virt`/`dns`/`tftp` sub-object shapes; Profile has no `power`). Carries non-default
  // dns/tftp data and <<inherit>>-sentinel virt data, exercising both branches of
  // Utils.patchFormGroupInherited for the fields fixed by this task.
  // eslint-disable-next-line max-len
  const profileMethodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>uid</name><value><string>a1b2c3d4e5f64a3d8b3a2b1c0d9e8f7a</string></value></member><member><name>name</name><value><string>t4profile</string></value></member><member><name>mtime</name><value><double>1787509606.0302052</double></value></member><member><name>ctime</name><value><double>1787509606.0302052</double></value></member><member><name>comment</name><value><string></string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>dhcp_tag</name><value><string></string></value></member><member><name>distro</name><value><string>testdistro</string></value></member><member><name>menu</name><value><string></string></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>server</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>repos</name><value><array><data><value><string>repo1</string></value></data></array></value></member><member><name>boot_loaders</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>autoinstall_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>kernel_options</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>kernel_options_post</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>dns</name><value><struct><member><name>name_servers</name><value><array><data><value><string>198.51.100.53</string></value></data></array></value></member><member><name>name_servers_search</name><value><array><data></data></array></value></member></struct></value></member><member><name>tftp</name><value><struct><member><name>next_server_v4</name><value><string>203.0.113.10</string></value></member><member><name>next_server_v6</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></member><member><name>virt</name><value><struct><member><name>auto_boot</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>cpus</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>disk_driver</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>path</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>pxe_boot</name><value><boolean>0</boolean></value></member><member><name>ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>type</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>uefi</name><value><boolean>0</boolean></value></member></struct></value></member></struct></value></param></params></methodResponse>`;

  const bootloadersResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>grub</string></value></data></array></value></param></params></methodResponse>`;

  const trueResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

  const handleResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>test-profile-handle</string></value></param></params></methodResponse>`;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileEditComponent, NoopAnimationsModule],
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
                get: () => 'testprof',
              },
            },
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads virt/dns/tftp fields from their real nested attribute paths on refreshData(), including the newly added virt_* fields', () => {
    const profileRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>get_profile</methodName>'),
    );
    profileRequest.flush(profileMethodResponse);

    const bootloadersRequest = httpTestingController.expectOne((req) =>
      req.body.includes(
        '<methodName>get_valid_profile_boot_loaders</methodName>',
      ),
    );
    bootloadersRequest.flush(bootloadersResponse);

    // dns.* — plain, non-inheritable array fields read from the nested `dns` sub-object.
    expect(component.profileFormGroup.get('name_servers').value).toEqual([
      '198.51.100.53',
    ]);
    expect(component.profileFormGroup.get('name_servers_search').value).toEqual(
      [],
    );

    // tftp.next_server_v4/v6 are bare-string fields (like the existing redhat_management_key):
    // displayed as the raw string as-is — a real value stays a real value, and the literal
    // "<<inherit>>" sentinel is shown verbatim rather than through Utils.patchFormGroupInherited()
    // (which discriminates solely on `typeof value === 'string'` and would incorrectly treat every
    // real, concrete value of these fields as "inherited"). No separate `_inherited` control exists.
    expect(component.profileFormGroup.get('next_server_v4').value).toEqual(
      '203.0.113.10',
    );
    expect(component.profileFormGroup.get('next_server_v6').value).toEqual(
      '<<inherit>>',
    );
    expect(component.profileFormGroup.get('next_server_v4_inherited')).toEqual(
      null,
    );

    // The newly added virt_* fields (previously entirely absent from profile-edit).
    expect(component.profileFormGroup.get('virt_pxe_boot').value).toEqual(
      false,
    );
    expect(component.profileFormGroup.get('virt_cpus').value).toEqual(0);
    expect(component.profileFormGroup.get('virt_cpus_inherited').value).toEqual(
      true,
    );
    expect(component.profileFormGroup.get('virt_ram').value).toEqual(0);
    expect(component.profileFormGroup.get('virt_file_size').value).toEqual(0);
    expect(component.profileFormGroup.get('virt_disk_driver').value).toEqual(
      '<<inherit>>',
    );
    expect(component.profileFormGroup.get('virt_path').value).toEqual(
      '<<inherit>>',
    );
    expect(component.profileFormGroup.get('virt_type').value).toEqual(
      '<<inherit>>',
    );
    expect(component.profileFormGroup.get('virt_auto_boot').value).toEqual(
      false,
    );
    expect(
      component.profileFormGroup.get('virt_auto_boot_inherited').value,
    ).toEqual(true);
  });

  it('sends the real nested attribute path for one dirtied virt/dns/tftp field each on save', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_profile</methodName>'),
      )
      .flush(profileMethodResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes(
          '<methodName>get_valid_profile_boot_loaders</methodName>',
        ),
      )
      .flush(bootloadersResponse);

    component.editProfile();

    const dirty: Array<[string, any]> = [
      ['virt_cpus', 4],
      ['name_servers', ['203.0.113.1']],
      ['next_server_v6', '2001:db8::53'],
    ];
    for (const [control, value] of dirty) {
      const formControl = component.profileFormGroup.get(control);
      formControl.setValue(value);
      formControl.markAsDirty();
    }

    component.saveProfile();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_profile_handle</methodName>'),
      )
      .flush(handleResponse);

    const modifyRequests = httpTestingController.match((req) =>
      req.body.includes('<methodName>modify_profile</methodName>'),
    );
    expect(modifyRequests.length).toEqual(dirty.length);

    const expectedPaths: Record<string, string[]> = {
      virt_cpus: ['virt', 'cpus'],
      name_servers: ['dns', 'name_servers'],
      next_server_v6: ['tftp', 'next_server_v6'],
    };
    const seenPaths = new Set<string>();
    for (const request of modifyRequests) {
      const document = parseRequestBody(request.request.body);
      expect(
        document.getElementsByTagName('methodName')[0].textContent,
      ).toEqual('modify_profile');
      expect(valueToJs(paramValue(document, 0))).toEqual('test-profile-handle');
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
        req.body.includes('<methodName>save_profile</methodName>'),
      )
      .flush(trueResponse);
  });

  it('toggling the "Inherited" checkbox for virt_cpus disables the field and sends <<inherit>> on save', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_profile</methodName>'),
      )
      .flush(profileMethodResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes(
          '<methodName>get_valid_profile_boot_loaders</methodName>',
        ),
      )
      .flush(bootloadersResponse);

    component.editProfile();

    // The fixture's virt.cpus is `<<inherit>>`, so editProfile() must start the value control
    // disabled, exactly like the pre-existing owners/boot_loaders/kernel_options/etc. fields do
    // when their current value is the inherit sentinel.
    expect(component.profileFormGroup.get('virt_cpus').disabled).toEqual(true);

    // Un-inherit via the checkbox: getInheritObservable() must re-enable the value control.
    const inheritedControl = component.profileFormGroup.get(
      'virt_cpus_inherited',
    );
    inheritedControl.setValue(false as never);
    expect(component.profileFormGroup.get('virt_cpus').disabled).toEqual(false);

    // Re-inherit via the checkbox, exactly as a user restoring inheritance would in the UI.
    inheritedControl.setValue(true as never);
    inheritedControl.markAsDirty();
    // getInheritObservable() must disable the underlying value control again, matching every
    // other inheritable field's behavior.
    expect(component.profileFormGroup.get('virt_cpus').disabled).toEqual(true);

    component.saveProfile();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_profile_handle</methodName>'),
      )
      .flush(handleResponse);

    const modifyRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>modify_profile</methodName>'),
    );
    const document = parseRequestBody(modifyRequest.request.body);
    expect(valueToJs(paramValue(document, 1))).toEqual(['virt', 'cpus']);
    expect(valueToJs(paramValue(document, 2))).toEqual('<<inherit>>');
    modifyRequest.flush(trueResponse);

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_profile</methodName>'),
      )
      .flush(trueResponse);
  });

  it('saves with nothing dirty by calling save_profile directly and exits edit mode', () => {
    // combineLatest([]) never emits, so saveProfile() must short-circuit around it instead of
    // hanging with modifyObservables empty (no dirty fields).
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_profile</methodName>'),
      )
      .flush(profileMethodResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes(
          '<methodName>get_valid_profile_boot_loaders</methodName>',
        ),
      )
      .flush(bootloadersResponse);

    component.editProfile();

    component.saveProfile();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_profile_handle</methodName>'),
      )
      .flush(handleResponse);

    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>modify_profile</methodName>'),
    );

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_profile</methodName>'),
      )
      .flush(trueResponse);

    expect(component.isEditMode).toBe(false);
  });

  it('deletes by uid, not by name (Cobbler 4.0.0 requires an object id for remove_profile)', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_profile</methodName>'),
      )
      .flush(profileMethodResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes(
          '<methodName>get_valid_profile_boot_loaders</methodName>',
        ),
      )
      .flush(bootloadersResponse);

    component.removeProfile();

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_profile</methodName>'),
    );
    const document = parseRequestBody(removeRequest.request.body);
    // Passing the name ('testprof') here would silently delete nothing under Cobbler 4.0.0.
    expect(valueToJs(paramValue(document, 0))).toEqual(
      'a1b2c3d4e5f64a3d8b3a2b1c0d9e8f7a',
    );
    removeRequest.flush(trueResponse);
  });
});
