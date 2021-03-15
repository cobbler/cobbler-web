import {TestBed} from '@angular/core/testing';

import {AngularXmlrpcService} from './typescript-xmlrpc.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('AngularXmlrpcService', () => {
  let service: AngularXmlrpcService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AngularXmlrpcService]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AngularXmlrpcService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('configuration should succeed without errors', () => {
    spyOn(service, 'configureService');
    service.configureService(new URL('https://localhost'));
    expect(service.configureService).toHaveBeenCalledTimes(1);
  });

  it('method call does network request with specified params', () => {
    const testData = `<?xml version="1.0"?><methodResponse><params><param><value><string>3.2.1</string></value></param></params></methodResponse>`;
    service.configureService(new URL('http://localhost/cobbler_api'));
    const callObservable = service.methodCall('version');
    callObservable.subscribe(value => {
      expect(value).toEqual({value: '3.2.1'});
    });
    const req = httpTestingController.expectOne('http://localhost/cobbler_api');
    expect(req.request.method).toEqual('POST');
    req.flush(testData);
  });
});
