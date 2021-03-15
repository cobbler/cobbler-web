import { TestBed } from '@angular/core/testing';

import { XmlServicesService } from './xml-services.service';

describe('XmlServicesService', () => {
  let service: XmlServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XmlServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
