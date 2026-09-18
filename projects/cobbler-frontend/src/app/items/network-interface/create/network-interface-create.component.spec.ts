import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { COBBLER_URL } from 'cobbler-api';
import { beforeEach, describe, expect, it } from 'vitest';

import { NetworkInterfaceCreateComponent } from './network-interface-create.component';

describe('NetworkInterfaceCreateComponent', () => {
  let component: NetworkInterfaceCreateComponent;
  let fixture: ComponentFixture<NetworkInterfaceCreateComponent>;
  let httpTestingController: HttpTestingController;
  let closedWith: unknown;

  /** UID of the system the dialog attaches the new interface to. */
  const systemUid = '8d0c1f3753214e59a2b3fdab7548435f';

  // Captured live from a Cobbler 4.0.0 dev instance
  // (`new_network_interface(system_uid, token)`); the returned string is the new item's UID, which
  // doubles as its XML-RPC item handle.
  const newInterfaceUid = '34cf322627cf49ecbaae14b9061e4e5c';
  const newInterfaceResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>${newInterfaceUid}</string></value></param></params></methodResponse>`;

  // Captured live from the same instance for modify_network_interface()/save_network_interface().
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
      default:
        throw new Error(`Unsupported value type "${typed.tagName}"`);
    }
  }

  beforeEach(async () => {
    closedWith = undefined;
    await TestBed.configureTestingModule({
      imports: [
        NetworkInterfaceCreateComponent,
        MatButtonModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatInputModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: (result: unknown) => {
              closedWith = result;
            },
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { systemUid },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(NetworkInterfaceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates through the NetworkInterface RPC family using the nested attribute paths', () => {
    component.networkInterfaceCreateFormGroup.patchValue({
      name: 'eth1',
      mac_address: 'DE:AD:BE:EF:00:01',
      ipv4_address: '198.51.100.10',
      ipv6_address: '2001:db8:13::10',
    });

    component.createNetworkInterface();

    // new_network_interface() takes the system's UID, not its name, and returns the new item's
    // handle directly, so no get_network_interface_handle() round-trip is needed.
    const newRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>new_network_interface</methodName>'),
    );
    expect(
      valueToJs(paramValue(parseRequestBody(newRequest.request.body), 0)),
    ).toEqual(systemUid);
    newRequest.flush(newInterfaceResponse);

    const expectedPaths: Array<[string[], string]> = [
      [['name'], 'eth1'],
      [['mac_address'], 'DE:AD:BE:EF:00:01'],
      // Cobbler 4.0.0 moved the addresses into the nested ipv4/ipv6 sub-objects; a flat
      // `ip_address`/`ipv6_address` attribute does not exist on a NetworkInterface any more.
      [['ipv4', 'address'], '198.51.100.10'],
      [['ipv6', 'address'], '2001:db8:13::10'],
    ];
    const modifyRequests = httpTestingController.match((req) =>
      req.body.includes('<methodName>modify_network_interface</methodName>'),
    );
    expect(modifyRequests.length).toEqual(expectedPaths.length);
    const seenPaths: string[] = [];
    for (const request of modifyRequests) {
      const document = parseRequestBody(request.request.body);
      expect(valueToJs(paramValue(document, 0))).toEqual(newInterfaceUid);
      const path = valueToJs(paramValue(document, 1)) as string[];
      const expected = expectedPaths.find(
        ([candidate]) => JSON.stringify(candidate) === JSON.stringify(path),
      );
      expect(expected).toBeDefined();
      expect(valueToJs(paramValue(document, 2))).toEqual(
        (expected as [string[], string])[1],
      );
      seenPaths.push(JSON.stringify(path));
      request.flush(trueResponse);
    }
    expect(new Set(seenPaths).size).toEqual(expectedPaths.length);

    const saveRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>save_network_interface</methodName>'),
    );
    const saveDocument = parseRequestBody(saveRequest.request.body);
    expect(valueToJs(paramValue(saveDocument, 0))).toEqual(newInterfaceUid);
    // A brand-new item has to be persisted in the "new" editmode, otherwise the backend does not
    // add it to the collection.
    expect(valueToJs(paramValue(saveDocument, 3))).toEqual('new');
    saveRequest.flush(trueResponse);

    // The pre-4.0.0 implementation went through get_system_handle() followed by
    // modify_system(handle, ['modify_interface'], ...) and save_system(); none of those RPC
    // operations exist for an interface any more.
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

    expect(closedWith).toEqual('eth1');
    httpTestingController.verify();
  });

  it('omits optional fields that were left empty', () => {
    component.networkInterfaceCreateFormGroup.patchValue({ name: 'eth2' });

    component.createNetworkInterface();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>new_network_interface</methodName>'),
      )
      .flush(newInterfaceResponse);

    const modifyRequests = httpTestingController.match((req) =>
      req.body.includes('<methodName>modify_network_interface</methodName>'),
    );
    // Only the name is written; mac/ipv4/ipv6 keep their backend defaults.
    expect(modifyRequests.length).toEqual(1);
    const document = parseRequestBody(modifyRequests[0].request.body);
    expect(valueToJs(paramValue(document, 1))).toEqual(['name']);
    expect(valueToJs(paramValue(document, 2))).toEqual('eth2');
    modifyRequests[0].flush(trueResponse);

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_network_interface</methodName>'),
      )
      .flush(trueResponse);

    expect(closedWith).toEqual('eth2');
    httpTestingController.verify();
  });
});
