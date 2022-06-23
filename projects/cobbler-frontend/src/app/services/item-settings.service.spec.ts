import {HttpClientTestingModule} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ItemSettingsService } from './item-settings.service';

describe('ItemSettingsService', () => {
  let service: ItemSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ItemSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
