import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from './app-config.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let httpMock: HttpTestingController;
  let originalBaseURI: PropertyDescriptor | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AppConfigService);
    httpMock = TestBed.inject(HttpTestingController);
    originalBaseURI = Object.getOwnPropertyDescriptor(
      Document.prototype,
      'baseURI',
    );
  });

  afterEach(() => {
    httpMock.verify();
    if (originalBaseURI) {
      Object.defineProperty(Document.prototype, 'baseURI', originalBaseURI);
    }
  });

  function stubBaseURI(baseURI: string): void {
    Object.defineProperty(Document.prototype, 'baseURI', {
      value: baseURI,
      configurable: true,
    });
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('requests the external config from the app root when served at the domain root', () => {
    stubBaseURI('http://localhost/en-US/');

    service.retrieveConfigExternal().subscribe();

    const req = httpMock.expectOne('http://localhost/app-config.json');
    expect(req.request.method).toBe('GET');
    req.flush({ cobblerUrls: [] });
  });

  it('requests the external config from the app root when served under a subpath', () => {
    stubBaseURI('http://localhost/cobbler_web/en-US/');

    service.retrieveConfigExternal().subscribe();

    const req = httpMock.expectOne(
      'http://localhost/cobbler_web/app-config.json',
    );
    expect(req.request.method).toBe('GET');
    req.flush({ cobblerUrls: [] });
  });
});
