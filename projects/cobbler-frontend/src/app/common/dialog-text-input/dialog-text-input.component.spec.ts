import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import { DialogTextInputComponent } from './dialog-text-input.component';

describe('DialogTextInputComponent', () => {
  let component: DialogTextInputComponent;
  let fixture: ComponentFixture<DialogTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogTextInputComponent,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {text: ""}
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
