import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureSearchDisplayComponent } from './adventure-search-display.component';

describe('AdventureSearchDisplayComponent', () => {
  let component: AdventureSearchDisplayComponent;
  let fixture: ComponentFixture<AdventureSearchDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdventureSearchDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdventureSearchDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
