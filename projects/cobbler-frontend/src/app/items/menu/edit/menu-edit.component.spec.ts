import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { MenuEditComponent } from './menu-edit.component';

describe('MenuEditComponent', () => {
  let component: MenuEditComponent;
  let fixture: ComponentFixture<MenuEditComponent>;
  let httpTestingController: HttpTestingController;

  // A synthetic but well-formed Cobbler 4.0.0 get_menu response.
  // eslint-disable-next-line max-len
  const menuMethodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>uid</name><value><string>f1e2d3c4b5a647d8b9a0c1d2e3f4a5b6</string></value></member><member><name>name</name><value><string>testmenu</string></value></member><member><name>mtime</name><value><double>1787509606.0302052</double></value></member><member><name>ctime</name><value><double>1787509606.0302052</double></value></member><member><name>comment</name><value><string></string></value></member><member><name>display_name</name><value><string></string></value></member></struct></value></param></params></methodResponse>`;

  const trueResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

  const handleResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>test-menu-handle</string></value></param></params></methodResponse>`;

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
      case 'boolean':
        return typed.textContent === '1';
      default:
        throw new Error(`Unsupported value type "${typed.tagName}"`);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuEditComponent, NoopAnimationsModule],
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
                get: () => 'testmenu',
              },
            },
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(MenuEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deletes by uid, not by name (Cobbler 4.0.0 requires an object id for remove_menu)', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_menu</methodName>'),
      )
      .flush(menuMethodResponse);

    component.removeMenu();

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_menu</methodName>'),
    );
    const document = parseRequestBody(removeRequest.request.body);
    // Passing the name ('testmenu') here would silently delete nothing under Cobbler 4.0.0.
    expect(valueToJs(paramValue(document, 0))).toEqual(
      'f1e2d3c4b5a647d8b9a0c1d2e3f4a5b6',
    );
    removeRequest.flush(trueResponse);
  });

  it('saves with nothing dirty by calling save_menu directly and exits edit mode', () => {
    // combineLatest([]) never emits, so saveMenu() must short-circuit around it instead of
    // hanging with modifyObservables empty (no dirty fields).
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_menu</methodName>'),
      )
      .flush(menuMethodResponse);

    component.editMenu();

    component.saveMenu();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_menu_handle</methodName>'),
      )
      .flush(handleResponse);

    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>modify_menu</methodName>'),
    );

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_menu</methodName>'),
      )
      .flush(trueResponse);

    expect(component.isEditMode).toBe(false);
  });
});
