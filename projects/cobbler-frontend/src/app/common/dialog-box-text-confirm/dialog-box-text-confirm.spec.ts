import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTreeModule } from '@angular/material/tree';
import { DialogBoxTextConfirmComponent } from './dialog-box-text-confirm';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

describe('DialogBoxTextConfirmComponent', () => {
  let component: DialogBoxTextConfirmComponent;
  let fixture: ComponentFixture<DialogBoxTextConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTreeModule, MatDialogModule, DialogBoxTextConfirmComponent],
      providers: [
        {
          // I was expecting this will pass the desired value
          provide: MAT_DIALOG_DATA,
          useValue: { eventId: '', name: '', eventLog: '' },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBoxTextConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
