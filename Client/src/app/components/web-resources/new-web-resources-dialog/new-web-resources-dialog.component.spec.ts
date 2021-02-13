import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWebResourcesDialogComponent } from './new-web-resources-dialog.component';

describe('NewWebResourcesDialogComponent', () => {
  let component: NewWebResourcesDialogComponent;
  let fixture: ComponentFixture<NewWebResourcesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewWebResourcesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWebResourcesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
