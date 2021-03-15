import { TestBed } from '@angular/core/testing';

import { GetObjService } from './get-obj.service';

describe('GetObjService', () => {
  let service: GetObjService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetObjService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
