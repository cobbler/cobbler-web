import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckSysComponent } from './check-sys.component';

describe('CheckSysComponent', () => {
  let component: CheckSysComponent;
  let fixture: ComponentFixture<CheckSysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckSysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
