import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COBBLER_URL } from 'cobbler-api';
import { vi } from 'vitest';

import { ImageOverviewComponent } from './image-overview.component';
import { provideRouter } from '@angular/router';

describe('ImageOverviewComponent', () => {
  let component: ImageOverviewComponent;
  let fixture: ComponentFixture<ImageOverviewComponent>;
  let httpTestingController: HttpTestingController;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageOverviewComponent],
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
    fixture = TestBed.createComponent(ImageOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deletes by uid via remove_image, not remove_distro (pre-existing copy-paste bug)', () => {
    component.deleteImage('image-uid-1', 'testimage');

    // The previous implementation called remove_distro() here (a copy-paste bug), which either did
    // nothing or, worse, could delete an unrelated distro sharing the same name.
    expect(
      httpTestingController.match((req) =>
        req.body.includes('<methodName>remove_distro</methodName>'),
      ).length,
    ).toEqual(0);

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_image</methodName>'),
    );
    const document = parseRequestBody(removeRequest.request.body);
    // Passing the name ('testimage') here would silently delete nothing under Cobbler 4.0.0.
    expect(valueToJs(paramValue(document, 0))).toEqual('image-uid-1');
    removeRequest.flush(trueResponse);
  });

  it('shows the delete-failed snackbar and does not refresh when remove_image returns false', () => {
    // Drain the initial get_images() request triggered by ngOnInit() so the later
    // expectNone() only reflects requests caused by deleteImage() itself.
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_images</methodName>'),
      )
      .flush(
        `<?xml version='1.0'?><methodResponse><params><param><value><array><data></data></array></value></param></params></methodResponse>`,
      );

    const snackBar = TestBed.inject(MatSnackBar);
    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component.deleteImage('image-uid-1', 'testimage');

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_image</methodName>'),
    );
    removeRequest.flush(
      `<?xml version='1.0'?><methodResponse><params><param><value><boolean>0</boolean></value></param></params></methodResponse>`,
    );

    expect(snackBarSpy).toHaveBeenCalled();
    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>get_images</methodName>'),
    );
  });
});
