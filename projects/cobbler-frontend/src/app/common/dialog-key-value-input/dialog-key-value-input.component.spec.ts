import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DialogKeyValueInputComponent } from './dialog-key-value-input.component';

describe('DialogKeyValueInputComponent', () => {
  let component: DialogKeyValueInputComponent;
  let fixture: ComponentFixture<DialogKeyValueInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogKeyValueInputComponent,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogKeyValueInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
