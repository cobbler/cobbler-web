import { TestBed } from '@angular/core/testing';

import { DataDistroService } from './data-distro.service';

describe('DataDistroService', () => {
  let service: DataDistroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataDistroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
