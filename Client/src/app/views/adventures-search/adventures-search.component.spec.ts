import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventuresSearchComponent } from './adventures-search.component';

describe('AdventuresSearchComponent', () => {
  let component: AdventuresSearchComponent;
  let fixture: ComponentFixture<AdventuresSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdventuresSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdventuresSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
