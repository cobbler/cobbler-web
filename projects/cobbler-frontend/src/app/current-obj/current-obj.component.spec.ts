import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentOBJComponent } from './current-obj.component';

describe('CurrentOBJComponent', () => {
  let component: CurrentOBJComponent;
  let fixture: ComponentFixture<CurrentOBJComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentOBJComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentOBJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
