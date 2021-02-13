import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAdventureDialogComponent } from './new-adventure-dialog.component';

describe('NewAdventureDialogComponent', () => {
  let component: NewAdventureDialogComponent;
  let fixture: ComponentFixture<NewAdventureDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAdventureDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAdventureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
