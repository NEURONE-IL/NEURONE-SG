import { TestBed } from '@angular/core/testing';

import { AdventureSearchService } from './adventure-search.service';

describe('AdventureSearchService', () => {
  let service: AdventureSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdventureSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
