import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureMetaEditorComponent } from './adventure-meta-editor.component';

describe('AdventureMetaEditorComponent', () => {
  let component: AdventureMetaEditorComponent;
  let fixture: ComponentFixture<AdventureMetaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdventureMetaEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdventureMetaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
