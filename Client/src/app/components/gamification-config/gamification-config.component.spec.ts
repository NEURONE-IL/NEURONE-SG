import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamificationConfigComponent } from './gamification-config.component';

describe('GamificationConfigComponent', () => {
  let component: GamificationConfigComponent;
  let fixture: ComponentFixture<GamificationConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamificationConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamificationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
