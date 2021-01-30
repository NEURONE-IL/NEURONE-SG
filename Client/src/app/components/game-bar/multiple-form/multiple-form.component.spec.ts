import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleFormComponent } from './multiple-form.component';

describe('MultipleFormComponent', () => {
  let component: MultipleFormComponent;
  let fixture: ComponentFixture<MultipleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
