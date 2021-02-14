import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebResourcesTableDialogComponent } from './web-resources-table-dialog.component';

describe('WebResourcesTableDialogComponent', () => {
  let component: WebResourcesTableDialogComponent;
  let fixture: ComponentFixture<WebResourcesTableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebResourcesTableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebResourcesTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
