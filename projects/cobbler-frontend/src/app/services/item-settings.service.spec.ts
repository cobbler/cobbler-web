import { TestBed } from '@angular/core/testing';

import { ItemSettingsService } from './item-settings.service';

describe('ItemSettingsService', () => {
  let service: ItemSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
