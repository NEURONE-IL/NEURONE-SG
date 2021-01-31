import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureSelectionComponent } from './adventure-selection.component';

describe('AdventureSelectionComponent', () => {
  let component: AdventureSelectionComponent;
  let fixture: ComponentFixture<AdventureSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdventureSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdventureSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
