import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebResourcesSearchDialogComponent } from './web-resources-search-dialog.component';

describe('WebResourcesTableDialogComponent', () => {
  let component: WebResourcesSearchDialogComponent;
  let fixture: ComponentFixture<WebResourcesSearchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebResourcesSearchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebResourcesSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
