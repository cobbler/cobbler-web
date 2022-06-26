import {Component} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatTableModule} from '@angular/material/table';

import { AppSettingsComponent } from './app-settings.component';

// eslint-disable-next-line @angular-eslint/component-selector
@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent {
}

describe('AppSettingsComponent', () => {
  let component: AppSettingsComponent;
  let fixture: ComponentFixture<AppSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTableModule
      ],
      declarations: [
        AppSettingsComponent,
        RouterOutletStubComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
