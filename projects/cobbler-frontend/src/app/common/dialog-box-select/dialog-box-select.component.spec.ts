import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogBoxSelectComponent } from './dialog-box-select.component';

describe('DialogBoxSelectComponent', () => {
  let component: DialogBoxSelectComponent;
  let fixture: ComponentFixture<DialogBoxSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogBoxSelectComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogBoxSelectComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
