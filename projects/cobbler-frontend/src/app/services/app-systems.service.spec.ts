import { TestBed } from '@angular/core/testing';

import { AppSystemsService } from './app-systems.service';

describe('AppSystemsService', () => {
  let service: AppSystemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppSystemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
