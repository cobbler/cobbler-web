import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { SsoService, SsoLoginResponse } from './sso.service';

describe('SsoService', () => {
  let service: SsoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(SsoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('issues a single GET request with credentials and emits the response body', () => {
    const expected: SsoLoginResponse = {
      username: 'cobbler',
      token: 'abc123',
    };
    let actual: SsoLoginResponse | undefined;

    service.attemptSso('/cobbler-sso/login').subscribe((response) => {
      actual = response;
    });

    const req = httpMock.expectOne('/cobbler-sso/login');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);

    req.flush(expected);

    expect(actual).toEqual(expected);
  });
});
