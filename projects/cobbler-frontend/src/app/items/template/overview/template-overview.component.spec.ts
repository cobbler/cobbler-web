import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { TemplateOverviewComponent } from './template-overview.component';

describe('TemplateOverviewComponent', () => {
  let component: TemplateOverviewComponent;
  let fixture: ComponentFixture<TemplateOverviewComponent>;
  let httpTestingController: HttpTestingController;

  /** UID of the template in `templatesResponse`. */
  const templateUid = 'template-uid-1';

  // A synthetic but well-formed Cobbler 4.0.0 get_templates response: an array containing a single
  // template struct.
  // eslint-disable-next-line max-len
  const templatesResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>uid</name><value><string>${templateUid}</string></value></member><member><name>name</name><value><string>legacy.ks</string></value></member><member><name>mtime</name><value><double>1787509606.0302052</double></value></member><member><name>ctime</name><value><double>1787509606.0302052</double></value></member><member><name>comment</name><value><string></string></value></member></struct></value></data></array></value></param></params></methodResponse>`;

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
      case 'boolean':
        return typed.textContent === '1';
      default:
        throw new Error(`Unsupported value type "${typed.tagName}"`);
    }
  }

  /** Answers the request issued by retrieveTemplates(). */
  function flushInitialLoad(): void {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_templates</methodName>'),
      )
      .flush(templatesResponse);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateOverviewComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TemplateOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the full Template objects from get_templates(), not just their names', () => {
    flushInitialLoad();

    // Previously this discarded everything but `.name`, leaving no uid available anywhere in the
    // component for the delete action to use.
    expect(component.dataSource.data.length).toEqual(1);
    expect(component.dataSource.data[0].uid).toEqual(templateUid);
    expect(component.dataSource.data[0].name).toEqual('legacy.ks');
  });

  it('deletes by uid via remove_template', () => {
    flushInitialLoad();

    component.deleteTemplate(templateUid, 'legacy.ks');

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_template</methodName>'),
    );
    const document = parseRequestBody(removeRequest.request.body);
    // Passing the name ('legacy.ks') here would silently delete nothing under Cobbler 4.0.0.
    expect(valueToJs(paramValue(document, 0))).toEqual(templateUid);
    removeRequest.flush(trueResponse);

    // The table is reloaded after a successful delete.
    flushInitialLoad();
  });
});
