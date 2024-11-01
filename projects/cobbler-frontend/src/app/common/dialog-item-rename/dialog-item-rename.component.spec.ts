import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { DialogItemRenameComponent } from './dialog-item-rename.component';

describe('DialogItemRenameComponent', () => {
  let component: DialogItemRenameComponent;
  let fixture: ComponentFixture<DialogItemRenameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogItemRenameComponent,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { itemType: 'Test', itemName: 'test', itemUid: '' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogItemRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
