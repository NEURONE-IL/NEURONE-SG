import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWebResourceDialogComponent } from './new-web-resource-dialog.component';

describe('NewWebResourceDialogComponent', () => {
  let component: NewWebResourceDialogComponent;
  let fixture: ComponentFixture<NewWebResourceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewWebResourceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWebResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
