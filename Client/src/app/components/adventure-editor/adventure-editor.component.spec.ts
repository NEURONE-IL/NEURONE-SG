import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureEditorComponent } from './adventure-editor.component';

describe('AdventureEditorComponent', () => {
  let component: AdventureEditorComponent;
  let fixture: ComponentFixture<AdventureEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdventureEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdventureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
