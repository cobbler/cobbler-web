import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NetworkInterfaceOverviewComponent } from './network-interface-overview.component';

/**
 * Records the config the component opens a dialog with and replays a canned `afterClosed()` value.
 * The dialogs themselves are covered by their own specs; this spec is about the RPC calls the
 * overview issues once a dialog has been closed.
 */
class MatDialogStub {
  lastConfig: any;
  result: any;

  open(
    _component: unknown,
    config: any,
  ): { afterClosed: () => Observable<any> } {
    this.lastConfig = config;
    return { afterClosed: () => of(this.result) };
  }
}

describe('NetworkInterfaceOverviewComponent', () => {
  let component: NetworkInterfaceOverviewComponent;
  let fixture: ComponentFixture<NetworkInterfaceOverviewComponent>;
  let httpTestingController: HttpTestingController;
  let dialog: MatDialogStub;

  /** UID of the system in `systemResponse`. */
  const systemUid = '8d0c1f3753214e59a2b3fdab7548435f';
  /** UID of the interface in `networkInterfaceResponse`; also its XML-RPC item handle. */
  const interfaceUid = 'c5ce98962116423b8e7b68a32dfcd553';

  // Captured live from a Cobbler 4.0.0 dev instance (`get_system("task5system", ...)`). Only the
  // `uid` is consumed by the component, but the full response is kept so the fixture exercises the
  // real wire format.
  // eslint-disable-next-line max-len
  const systemResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>ctime</name><value><double>1787515061.6932278</double></value></member><member><name>mtime</name><value><double>1787571297.7253938</double></value></member><member><name>uid</name><value><string>8d0c1f3753214e59a2b3fdab7548435f</string></value></member><member><name>name</name><value><string>task5system</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>depth</name><value><int>2</int></value></member><member><name>parent</name><value><string></string></value></member><member><name>is_subobject</name><value><boolean>0</boolean></value></member><member><name>children</name><value><array><data></data></array></value></member><member><name>hostname</name><value><string>task5system.example.com</string></value></member><member><name>status</name><value><string></string></value></member></struct></value></param></params></methodResponse>`;

  // Captured live from the same instance
  // (`find_network_interface({system_uid}, true, false, token)`).
  // eslint-disable-next-line max-len
  const networkInterfaceResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>ctime</name><value><double>1787515096.9201949</double></value></member><member><name>mtime</name><value><double>1787572054.7528539</double></value></member><member><name>uid</name><value><string>c5ce98962116423b8e7b68a32dfcd553</string></value></member><member><name>name</name><value><string>eth0</string></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><string>&lt;&lt;inherit&gt;&gt;</string></value></member><member><name>ipv4</name><value><struct><member><name>address</name><value><string>192.0.2.50</string></value></member><member><name>static_routes</name><value><array><data></data></array></value></member><member><name>mtu</name><value><string></string></value></member><member><name>netmask</name><value><string>255.255.255.0</string></value></member></struct></value></member><member><name>ipv6</name><value><struct><member><name>address</name><value><string>2001:db8::50</string></value></member><member><name>static_routes</name><value><array><data></data></array></value></member><member><name>mtu</name><value><string></string></value></member><member><name>default_gateway</name><value><string></string></value></member><member><name>prefix</name><value><string>64</string></value></member><member><name>secondaries</name><value><array><data></data></array></value></member></struct></value></member><member><name>mac_address</name><value><string>aa:bb:cc:dd:ee:ff</string></value></member><member><name>management</name><value><boolean>0</boolean></value></member><member><name>static</name><value><boolean>0</boolean></value></member><member><name>system_uid</name><value><string>8d0c1f3753214e59a2b3fdab7548435f</string></value></member></struct></value></data></array></value></param></params></methodResponse>`;

  const trueResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

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

  /** Answers the two requests issued by retrieveInterfaces(). */
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

  /** Asserts that none of the RPC operations the pre-4.0.0 code used are called any more. */
  function expectNoSystemRpcCalls(): void {
    for (const method of [
      'get_system_handle',
      'modify_system',
      'save_system',
    ]) {
      expect(
        httpTestingController.match((req) =>
          req.body.includes(`<methodName>${method}</methodName>`),
        ).length,
      ).toEqual(0);
    }
  }

  beforeEach(async () => {
    dialog = new MatDialogStub();
    await TestBed.configureTestingModule({
      imports: [NetworkInterfaceOverviewComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: MatDialog,
          useValue: dialog,
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
    fixture = TestBed.createComponent(NetworkInterfaceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('retrieves interfaces via find_network_interface keyed by system_uid', () => {
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
      system_uid: systemUid,
    });
    // `expand` must be true, otherwise the backend only returns interface names (strings) instead
    // of full NetworkInterface objects.
    expect(valueToJs(paramValue(findDocument, 1))).toEqual(true);
    findRequest.flush(networkInterfaceResponse);

    expect(component.dataSource.data.length).toEqual(1);
    expect(component.dataSource.data[0].interfaceName).toEqual('eth0');
    expect(component.dataSource.data[0].networkInterface.uid).toEqual(
      interfaceUid,
    );
    expect(component.systemUid).toEqual(systemUid);
    httpTestingController.verify();
  });

  it('does not open the create dialog before the system UID has resolved', () => {
    // Before retrieveInterfaces()'s get_system() response arrives, systemUid is still undefined.
    // Opening the dialog anyway would send new_network_interface(undefined, token): the serializer
    // emits an empty <param/> for `undefined`, which the backend's XML-RPC parser silently drops —
    // shifting `token` into the `system_uid` slot and reporting a misleading "missing 1 required
    // positional argument: 'token'" TypeError instead of the real problem.
    component.addNetworkInterface();

    expect(dialog.lastConfig).toBeUndefined();

    flushInitialLoad();
    httpTestingController.verify();
  });

  it('hands the system UID to the create dialog', () => {
    flushInitialLoad();

    component.addNetworkInterface();

    // new_network_interface() attaches the new interface by system UID, so the dialog needs the
    // UID and not the system name.
    expect(dialog.lastConfig.data).toEqual({ systemUid });
    httpTestingController.verify();
  });

  it('navigates to /items/system/:name/interface/:interface after a successful create', () => {
    flushInitialLoad();
    dialog.result = 'eth1';
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.addNetworkInterface();

    // Regression test: this used to navigate to /manage/items/system/..., which does not match
    // any configured route (the top-level 'items' route is a sibling of 'manage', not nested
    // under it) and produced a 404 instead of showing the newly created interface.
    expect(navigateSpy).toHaveBeenCalledWith([
      '/items',
      'system',
      'testsystem',
      'interface',
      'eth1',
    ]);
  });

  it('showInterface navigates to /items/system/:name/interface/:interface', () => {
    flushInitialLoad();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.showInterface('eth0');

    // Regression test for the "Show details" 404: the previous /manage/items/... path does not
    // match any configured route.
    expect(navigateSpy).toHaveBeenCalledWith([
      '/items',
      'system',
      'testsystem',
      'interface',
      'eth0',
    ]);
  });

  it('renames through rename_network_interface using the interface UID', () => {
    flushInitialLoad();
    dialog.result = 'eth1';

    component.renameInterface(component.dataSource.data[0]);

    const renameRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>rename_network_interface</methodName>'),
    );
    const document = parseRequestBody(renameRequest.request.body);
    // The item handle is the interface UID resolved by find_network_interface(); resolving it by
    // name via get_network_interface_handle() would be ambiguous, because interface names are only
    // unique per system.
    expect(valueToJs(paramValue(document, 0))).toEqual(interfaceUid);
    expect(valueToJs(paramValue(document, 1))).toEqual('eth1');
    renameRequest.flush(trueResponse);

    // The pre-4.0.0 implementation went through modify_system(handle, ['rename_interface'], ...),
    // an RPC operation that does not exist.
    expectNoSystemRpcCalls();

    // The table is reloaded after a successful rename.
    flushInitialLoad();
    httpTestingController.verify();
  });

  it('does not rename when the dialog was cancelled', () => {
    flushInitialLoad();
    dialog.result = undefined;

    component.renameInterface(component.dataSource.data[0]);

    expect(
      httpTestingController.match((req) =>
        req.body.includes('<methodName>rename_network_interface</methodName>'),
      ).length,
    ).toEqual(0);
    httpTestingController.verify();
  });

  it('deletes through remove_network_interface using the interface UID', () => {
    flushInitialLoad();

    component.deleteInterface(component.dataSource.data[0]);

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_network_interface</methodName>'),
    );
    const document = parseRequestBody(removeRequest.request.body);
    expect(valueToJs(paramValue(document, 0))).toEqual(interfaceUid);
    // Interfaces have no descendants, so the delete is explicitly non-recursive.
    expect(valueToJs(paramValue(document, 2))).toEqual(false);
    removeRequest.flush(trueResponse);

    // The pre-4.0.0 implementation went through modify_system(handle, ['delete_interface'], ...),
    // an RPC operation that does not exist.
    expectNoSystemRpcCalls();

    // The table is reloaded after a successful delete.
    flushInitialLoad();
    httpTestingController.verify();
  });
});
