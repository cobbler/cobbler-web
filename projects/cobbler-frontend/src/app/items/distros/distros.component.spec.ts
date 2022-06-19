import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrosComponent } from './distros.component';

describe('DistrosComponent', () => {
  let component: DistrosComponent;
  let fixture: ComponentFixture<DistrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
