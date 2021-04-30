import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavViewComponent } from './sidenav-view.component';

describe('SidenavViewComponent', () => {
  let component: SidenavViewComponent;
  let fixture: ComponentFixture<SidenavViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
