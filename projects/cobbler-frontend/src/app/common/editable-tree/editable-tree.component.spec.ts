import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTreeModule } from '@angular/material/tree';

import { EditableTreeComponent } from './editable-tree.component';

describe('EditableTreeComponent', () => {
  let component: EditableTreeComponent;
  let fixture: ComponentFixture<EditableTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTreeModule, EditableTreeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
