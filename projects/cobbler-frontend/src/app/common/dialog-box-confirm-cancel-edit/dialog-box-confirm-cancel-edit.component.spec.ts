import { DialogModule } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DialogBoxConfirmCancelEditComponent } from './dialog-box-confirm-cancel-edit.component';

describe('DialogBoxConfirmCancelEditComponent', () => {
  let component: DialogBoxConfirmCancelEditComponent;
  let fixture: ComponentFixture<DialogBoxConfirmCancelEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogBoxConfirmCancelEditComponent,
        DialogModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { name: '' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogBoxConfirmCancelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
