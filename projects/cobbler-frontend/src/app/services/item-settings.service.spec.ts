import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {COBBLER_URL} from 'cobbler-api';

import {ItemSettingsService} from './item-settings.service';

describe('ItemSettingsService', () => {
  let service: ItemSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api')
        }
      ],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ItemSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
