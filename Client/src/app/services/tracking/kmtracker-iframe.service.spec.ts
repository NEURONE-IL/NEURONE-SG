import { TestBed } from '@angular/core/testing';

import { KmTrackerIframeService } from './kmtracker-iframe.service';

describe('KmtrackerIframeService', () => {
  let service: KmTrackerIframeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KmTrackerIframeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
