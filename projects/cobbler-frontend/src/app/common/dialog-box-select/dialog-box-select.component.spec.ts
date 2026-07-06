import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBoxSelectComponent } from './dialog-box-select.component';

describe('DialogBoxSelectComponent', () => {
  let component: DialogBoxSelectComponent;
  let fixture: ComponentFixture<DialogBoxSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogBoxSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogBoxSelectComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
