import { TestBed } from '@angular/core/testing';

import { SnippetService } from './snippet.service';

describe('SnippetService', () => {
  let service: SnippetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnippetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
