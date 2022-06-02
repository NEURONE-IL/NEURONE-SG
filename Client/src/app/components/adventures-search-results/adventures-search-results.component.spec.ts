import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventuresSearchResultsComponent } from './adventures-search-results.component';

describe('AdventuresSearchResultsComponent', () => {
  let component: AdventuresSearchResultsComponent;
  let fixture: ComponentFixture<AdventuresSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdventuresSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdventuresSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
