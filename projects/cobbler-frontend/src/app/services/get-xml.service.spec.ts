import {HttpClientTestingModule} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GetXMLService } from './get-xml.service';

describe('GetXMLService', () => {
  let service: GetXMLService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(GetXMLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
