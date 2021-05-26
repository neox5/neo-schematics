import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutViewComponent } from './main-layout-view.component';

describe('MainLayoutViewComponent', () => {
  let component: MainLayoutViewComponent;
  let fixture: ComponentFixture<MainLayoutViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainLayoutViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainLayoutViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
