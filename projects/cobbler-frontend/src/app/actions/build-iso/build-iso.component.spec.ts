import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildISOComponent } from './build-iso.component';

describe('BuildISOComponent', () => {
  let component: BuildISOComponent;
  let fixture: ComponentFixture<BuildISOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildISOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildISOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
