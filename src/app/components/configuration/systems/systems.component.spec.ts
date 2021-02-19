import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemsComponent } from './systems.component';

describe('SystemsComponent', () => {
  let component: SystemsComponent;
  let fixture: ComponentFixture<SystemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
