import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBoxItemRenderedComponent } from './dialog-box-item-rendered.component';
import { MatTreeModule } from '@angular/material/tree';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

describe('DialogBoxItemRenderedComponent', () => {
  let component: DialogBoxItemRenderedComponent;
  let fixture: ComponentFixture<DialogBoxItemRenderedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTreeModule, MatDialogModule, DialogBoxItemRenderedComponent],
      providers: [
        {
          // I was expecting this will pass the desired value
          provide: MAT_DIALOG_DATA,
          useValue: {
            itemType: '',
            uid: '',
            name: '',
            renderedData: {
              name: 'testdistro',
              comment: '',
              kernel_options: { a: 1 },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogBoxItemRenderedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the plain object as indented JSON', () => {
    expect(component.jsonData).toBe(
      JSON.stringify(
        { name: 'testdistro', comment: '', kernel_options: { a: 1 } },
        null,
        2,
      ),
    );
  });
});
