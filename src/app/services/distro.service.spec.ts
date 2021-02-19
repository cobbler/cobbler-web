import { TestBed } from '@angular/core/testing';

import { DistroService } from './distro.service';

describe('DistroService', () => {
  let service: DistroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
