import { TestBed } from '@angular/core/testing';

import { MngclassesService } from './mngclasses.service';

describe('MngclassesService', () => {
  let service: MngclassesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MngclassesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
