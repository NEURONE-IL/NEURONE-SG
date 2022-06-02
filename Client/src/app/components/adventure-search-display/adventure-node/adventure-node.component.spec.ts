import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureNodeComponent } from './adventure-node.component';

describe('AdventureNodeComponent', () => {
  let component: AdventureNodeComponent;
  let fixture: ComponentFixture<AdventureNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdventureNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdventureNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
