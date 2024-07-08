import {Component} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';

import { SettingsEditComponent } from './settings-edit.component';

@Component({selector: 'cobbler-editable-tree', template: '', standalone: true})
class EditableTreeStubComponent {
}

describe('EditComponent', () => {
  let component: SettingsEditComponent;
  let fixture: ComponentFixture<SettingsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatRadioModule,
        MatInputModule,
        SettingsEditComponent,
        EditableTreeStubComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
