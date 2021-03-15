import { TestBed } from '@angular/core/testing';

import { CobblerApiService } from './cobbler-api.service';

describe('CobblerApiService', () => {
  let service: CobblerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CobblerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
