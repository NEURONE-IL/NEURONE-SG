import { TestBed } from '@angular/core/testing';

import { KmtrackerService } from './kmtracker.service';

describe('KmtrackerService', () => {
  let service: KmtrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KmtrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
