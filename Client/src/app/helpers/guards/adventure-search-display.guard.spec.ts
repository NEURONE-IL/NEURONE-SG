import { TestBed } from '@angular/core/testing';

import { AdventureSearchDisplayGuard } from './adventure-search-display.guard';

describe('AdventureSearchDisplayGuard', () => {
  let guard: AdventureSearchDisplayGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdventureSearchDisplayGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
