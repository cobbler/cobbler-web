import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementClassesComponent } from './management-classes.component';

describe('ManagementClassesComponent', () => {
  let component: ManagementClassesComponent;
  let fixture: ComponentFixture<ManagementClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementClassesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
