import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';
import { describe, expect, it, beforeEach } from 'vitest';

import { NetworkInterfaceEditComponent } from './network-interface-edit.component';

describe('NetworkInterfaceEditComponent', () => {
  let component: NetworkInterfaceEditComponent;
  let fixture: ComponentFixture<NetworkInterfaceEditComponent>;
  let httpTestingController: HttpTestingController;

  // Captured live from a Cobbler 4.0.0 dev instance (`get_system("task5system", ...)`). Only the
  // `uid` is consumed by the component, but the full response is kept so the fixture exercises the
  // real wire format.
  // eslint-disable-next-line max-len
  const systemResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>ctime</name><value><double>1787515061.6932278</double></value></member><member><name>mtime</name><value><double>1787571297.7253938</double></value></member><member><name>uid</name><value><string>8d0c1f3753214e59a2b3fdab7548435f</string></value></member><member><name>name</name><value><string>task5system</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>depth</name><value><int>2</int></value></member><member><name>parent</name><value><string></string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>kernel_options</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>kernel_options_post</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>autoinstall_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>template_files</name><value><struct></struct></value></member><member><name>ipv6_autoconfiguration</name><value><boolean>0</boolean></value></member><member><name>repos_enabled</name><value><boolean>0</boolean></value></member><member><name>autoinstall</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>boot_loaders</name><value><array><data><value><string>&lt;&lt;inherit&gt;&gt;</string></value></data></array></value></member><member><name>dns</name><value><struct><member><name>name_servers</name><value><array><data></data></array></value></member><member><name>name_servers_search</name><value><array><data></data></array></value></member></struct></value></member><member><name>enable_ipxe</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>gateway</name><value><string></string></value></member><member><name>hostname</name><value><string>task5system.example.com</string></value></member><member><name>image</name><value><string></string></value></member><member><name>ipv6_default_device</name><value><string></string></value></member><member><name>netboot_enabled</name><value><boolean>0</boolean></value></member><member><name>tftp</name><value><struct><member><name>next_server_v4</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>next_server_v6</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></member><member><name>filename</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>power</name><value><struct><member><name>address</name><value><string></string></value></member><member><name>id</name><value><string></string></value></member><member><name>password</name><value><string></string></value></member><member><name>type</name><value><string></string></value></member><member><name>user</name><value><string></string></value></member><member><name>options</name><value><string></string></value></member><member><name>identity_file</name><value><string></string></value></member></struct></value></member><member><name>profile</name><value><string>56e49548605b4cd69c018bcefc0d100c</string></value></member><member><name>proxy</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_key</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_org</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_user</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>redhat_management_password</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>server</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>status</name><value><string></string></value></member><member><name>virt</name><value><struct><member><name>auto_boot</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>cpus</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>disk_driver</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>file_size</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>path</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>pxe_boot</name><value><boolean>0</boolean></value></member><member><name>ram</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>type</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>uefi</name><value><boolean>0</boolean></value></member></struct></value></member><member><name>serial_device</name><value><int>-1</int></value></member><member><name>serial_baud_rate</name><value><int>-1</int></value></member><member><name>display_name</name><value><string></string></value></member><member><name>kickstart</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ks_meta</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member></struct></value></param></params></methodResponse>`;

  // Captured live from a Cobbler 4.0.0 dev instance
  // (`find_network_interface({system_uid, name: "eth0"}, true, false, token)`) after setting a
  // distinct, non-default value on every attribute this task fixes. Note that `ipv6.default_gateway`
  // / `ipv6.static_routes` are deliberately left empty while the top-level `ipv6_default_gateway` /
  // `ipv6_static_routes` carry real values: those are four distinct backend attributes and the form
  // must read the top-level pair, not the `ipv6` sub-object pair.
  // eslint-disable-next-line max-len
  const networkInterfaceResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>ctime</name><value><double>1787515096.9201949</double></value></member><member><name>mtime</name><value><double>1787572054.7528539</double></value></member><member><name>uid</name><value><string>c5ce98962116423b8e7b68a32dfcd553</string></value></member><member><name>name</name><value><string>eth0</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>bonding_opts</name><value><string></string></value></member><member><name>bridge_opts</name><value><string></string></value></member><member><name>connected_mode</name><value><boolean>0</boolean></value></member><member><name>dhcp_tag</name><value><string></string></value></member><member><name>dns</name><value><struct><member><name>name</name><value><string>node1.example.org</string></value></member><member><name>common_names</name><value><array><data><value><string>alias1.example.org</string></value><value><string>alias2.example.org</string></value></data></array></value></member></struct></value></member><member><name>if_gateway</name><value><string></string></value></member><member><name>interface_master</name><value><string></string></value></member><member><name>interface_type</name><value><string>na</string></value></member><member><name>ipv4</name><value><struct><member><name>address</name><value><string>192.0.2.50</string></value></member><member><name>static_routes</name><value><array><data><value><string>192.0.2.0/24:192.0.2.1</string></value></data></array></value></member><member><name>mtu</name><value><string>9000</string></value></member><member><name>netmask</name><value><string>255.255.255.0</string></value></member></struct></value></member><member><name>ipv6</name><value><struct><member><name>address</name><value><string>2001:db8::50</string></value></member><member><name>static_routes</name><value><array><data></data></array></value></member><member><name>mtu</name><value><string>1480</string></value></member><member><name>default_gateway</name><value><string></string></value></member><member><name>prefix</name><value><string>64</string></value></member><member><name>secondaries</name><value><array><data><value><string>2001:db8::51</string></value></data></array></value></member><member><name>efault_gateway</name><value><string></string></value></member></struct></value></member><member><name>ipv6_default_gateway</name><value><string>2001:db8::1</string></value></member><member><name>ipv6_static_routes</name><value><array><data><value><string>2001:db8:1::/64:2001:db8::2</string></value></data></array></value></member><member><name>mac_address</name><value><string>aa:bb:cc:dd:ee:ff</string></value></member><member><name>management</name><value><boolean>0</boolean></value></member><member><name>static</name><value><boolean>0</boolean></value></member><member><name>virt_bridge</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>system_uid</name><value><string>8d0c1f3753214e59a2b3fdab7548435f</string></value></member></struct></value></data></array></value></param></params></methodResponse>`;

  const trueResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

  /** The UID of the interface in `networkInterfaceResponse`; also its XML-RPC item handle. */
  const interfaceUid = 'c5ce98962116423b8e7b68a32dfcd553';

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
      case 'array': {
        const data = Array.from(typed.children).find(
          (child) => child.tagName === 'data',
        ) as Element;
        return Array.from(data.children).map((element) => valueToJs(element));
      }
      case 'struct':
        return Object.fromEntries(
          Array.from(typed.children)
            .filter((child) => child.tagName === 'member')
            .map((member) => {
              const children = Array.from(member.children);
              const name = children.find((child) => child.tagName === 'name');
              const value = children.find((child) => child.tagName === 'value');
              return [name?.textContent ?? '', valueToJs(value as Element)];
            }),
        );
      default:
        throw new Error(`Unsupported value type "${typed.tagName}"`);
    }
  }

  /** Answers the two requests issued by refreshData() and returns nothing. */
  function flushInitialLoad(): void {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_system</methodName>'),
      )
      .flush(systemResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>find_network_interface</methodName>'),
      )
      .flush(networkInterfaceResponse);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkInterfaceEditComponent, NoopAnimationsModule],
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
                get: (key: string) => (key === 'name' ? 'task5system' : 'eth0'),
              },
            },
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(NetworkInterfaceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('resolves the interface via find_network_interface keyed by system_uid + name', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_system</methodName>'),
      )
      .flush(systemResponse);

    const findRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>find_network_interface</methodName>'),
    );
    const findDocument = parseRequestBody(findRequest.request.body);
    expect(valueToJs(paramValue(findDocument, 0))).toEqual({
      system_uid: '8d0c1f3753214e59a2b3fdab7548435f',
      name: 'eth0',
    });
    // `expand` must be true, otherwise the backend only returns interface names (strings) instead
    // of full NetworkInterface objects.
    expect(valueToJs(paramValue(findDocument, 1))).toEqual(true);
    findRequest.flush(networkInterfaceResponse);

    expect(component.networkInterface.uid).toEqual(interfaceUid);
  });

  it('loads the dns/ipv4/ipv6 fields from their real nested attribute paths on refreshData()', () => {
    flushInitialLoad();

    const form = component.networkInterfaceFormGroup;

    // dns.* — Cobbler 4.0.0 moved `dns_name`/`cnames` under the `dns` sub-object.
    expect(form.get('dns_name').value).toEqual('node1.example.org');
    expect(form.get('cnames').value).toEqual([
      'alias1.example.org',
      'alias2.example.org',
    ]);

    // ipv4.* — `ip_address`/`mtu`/`netmask`/`static_routes` live under the `ipv4` sub-object.
    expect(form.get('ip_address').value).toEqual('192.0.2.50');
    expect(form.get('mtu').value).toEqual('9000');
    expect(form.get('netmask').value).toEqual('255.255.255.0');
    expect(form.get('static_routes').value).toEqual(['192.0.2.0/24:192.0.2.1']);

    // ipv6.* — `ipv6_address`/`ipv6_mtu`/`ipv6_prefix`/`ipv6_secondaries` live under `ipv6`.
    expect(form.get('ipv6_address').value).toEqual('2001:db8::50');
    expect(form.get('ipv6_mtu').value).toEqual('1480');
    expect(form.get('ipv6_prefix').value).toEqual('64');
    expect(form.get('ipv6_secondaries').value).toEqual(['2001:db8::51']);

    // `ipv6_default_gateway` and `ipv6_static_routes` are genuine top-level attributes and must
    // NOT be read from `ipv6.default_gateway` / `ipv6.static_routes`, which are empty here.
    expect(form.get('ipv6_default_gateway').value).toEqual('2001:db8::1');
    expect(form.get('ipv6_static_routes').value).toEqual([
      '2001:db8:1::/64:2001:db8::2',
    ]);

    // Unchanged flat attributes keep working.
    expect(form.get('mac_address').value).toEqual('aa:bb:cc:dd:ee:ff');
    expect(form.get('interface_type').value).toEqual('na');
    expect(form.get('virt_bridge').value).toEqual('<<inherit>>');
  });

  it('saves through the NetworkInterface RPC family using the nested attribute paths', () => {
    flushInitialLoad();

    component.editInterface();

    const dirty: Array<[string, any]> = [
      ['ip_address', '192.0.2.99'],
      ['netmask', '255.255.0.0'],
      ['dns_name', 'node2.example.org'],
      ['cnames', ['alias3.example.org']],
      ['ipv6_prefix', '48'],
      ['ipv6_secondaries', ['2001:db8::99']],
      // Not a nested field: must be sent under its own flat name.
      ['ipv6_default_gateway', '2001:db8::ff'],
      ['mac_address', 'AA:BB:CC:00:11:22'],
    ];
    for (const [control, value] of dirty) {
      const formControl = component.networkInterfaceFormGroup.get(control);
      formControl.setValue(value);
      formControl.markAsDirty();
    }

    component.saveInterface();

    const modifyRequests = httpTestingController.match((req) =>
      req.body.includes('<methodName>modify_network_interface</methodName>'),
    );
    expect(modifyRequests.length).toEqual(dirty.length);

    const expectedPaths: Record<string, string[]> = {
      ip_address: ['ipv4', 'address'],
      netmask: ['ipv4', 'netmask'],
      dns_name: ['dns', 'name'],
      cnames: ['dns', 'common_names'],
      ipv6_prefix: ['ipv6', 'prefix'],
      ipv6_secondaries: ['ipv6', 'secondaries'],
      ipv6_default_gateway: ['ipv6_default_gateway'],
      mac_address: ['mac_address'],
    };
    const seenControls = new Set<string>();
    for (const request of modifyRequests) {
      const document = parseRequestBody(request.request.body);
      // The item handle is the interface UID resolved by find_network_interface(); resolving it
      // by name via get_network_interface_handle() would be ambiguous, because interface names
      // are only unique per system.
      expect(valueToJs(paramValue(document, 0))).toEqual(interfaceUid);
      const path = valueToJs(paramValue(document, 1)) as string[];
      const control = Object.keys(expectedPaths).find(
        (candidate) =>
          JSON.stringify(expectedPaths[candidate]) === JSON.stringify(path),
      );
      expect(control).toBeDefined();
      seenControls.add(control as string);
      const [, expectedValue] = dirty.find(
        ([candidate]) => candidate === control,
      ) as [string, any];
      expect(valueToJs(paramValue(document, 2))).toEqual(expectedValue);
      request.flush(trueResponse);
    }
    expect(seenControls.size).toEqual(dirty.length);

    const saveRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>save_network_interface</methodName>'),
    );
    expect(
      valueToJs(paramValue(parseRequestBody(saveRequest.request.body), 0)),
    ).toEqual(interfaceUid);
    saveRequest.flush(trueResponse);

    // The pre-4.0.0 implementation went through modify_system(handle, ['modify_interface'], ...)
    // followed by save_system(); neither RPC operation may be used for an interface any more.
    expect(
      httpTestingController.match((req) =>
        req.body.includes('<methodName>modify_system</methodName>'),
      ).length,
    ).toEqual(0);
    expect(
      httpTestingController.match((req) =>
        req.body.includes('<methodName>save_system</methodName>'),
      ).length,
    ).toEqual(0);
    expect(
      httpTestingController.match((req) =>
        req.body.includes('<methodName>get_system_handle</methodName>'),
      ).length,
    ).toEqual(0);

    // refreshData() re-runs after a successful save.
    flushInitialLoad();
    expect(component.isEditMode).toEqual(false);
    httpTestingController.verify();
  });

  it('deletes through remove_network_interface instead of modify_system', () => {
    flushInitialLoad();

    component.removeInterface();

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_network_interface</methodName>'),
    );
    const document = parseRequestBody(removeRequest.request.body);
    // The item is identified by its uid, not its name (Cobbler 4.0.0 requires an object id for
    // remove_<type> RPC calls).
    expect(valueToJs(paramValue(document, 0))).toEqual(interfaceUid);
    // Interfaces have no descendants, so the delete is explicitly non-recursive.
    expect(valueToJs(paramValue(document, 2))).toEqual(false);
    removeRequest.flush(trueResponse);

    // The pre-4.0.0 implementation went through modify_system(handle, ['delete_interface'], ...),
    // an RPC operation that does not exist; nothing may target the System object any more.
    expect(
      httpTestingController.match((req) =>
        req.body.includes('<methodName>modify_system</methodName>'),
      ).length,
    ).toEqual(0);
    expect(
      httpTestingController.match((req) =>
        req.body.includes('<methodName>get_system_handle</methodName>'),
      ).length,
    ).toEqual(0);
    httpTestingController.verify();
  });
});
