import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DialogItemCopyComponent } from './dialog-item-copy.component';

describe('DialogItemRenameComponent', () => {
  let component: DialogItemCopyComponent;
  let fixture: ComponentFixture<DialogItemCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogItemCopyComponent, MatDialogModule, NoopAnimationsModule],
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

    fixture = TestBed.createComponent(DialogItemCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
