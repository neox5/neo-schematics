import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLayoutViewComponent } from './app-layout-view.component';

describe('AppLayoutViewComponent', () => {
  let component: AppLayoutViewComponent;
  let fixture: ComponentFixture<AppLayoutViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLayoutViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLayoutViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
