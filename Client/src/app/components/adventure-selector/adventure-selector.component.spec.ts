import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureSelectorComponent } from './adventure-selector.component';

describe('AdventureSelectorComponent', () => {
  let component: AdventureSelectorComponent;
  let fixture: ComponentFixture<AdventureSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdventureSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdventureSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
