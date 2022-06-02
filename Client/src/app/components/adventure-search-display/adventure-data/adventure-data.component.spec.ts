import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureDataComponent } from './adventure-data.component';

describe('AdventureDataComponent', () => {
  let component: AdventureDataComponent;
  let fixture: ComponentFixture<AdventureDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdventureDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdventureDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
