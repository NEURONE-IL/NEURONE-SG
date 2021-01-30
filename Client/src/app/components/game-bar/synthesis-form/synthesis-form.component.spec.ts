import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesisFormComponent } from './synthesis-form.component';

describe('SynthesisFormComponent', () => {
  let component: SynthesisFormComponent;
  let fixture: ComponentFixture<SynthesisFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynthesisFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthesisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
