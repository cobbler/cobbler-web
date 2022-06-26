import {Component} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatTableModule} from '@angular/material/table';
import {MatTableModule} from '@angular/material/table';
import {RouterTestingModule} from '@angular/router/testing';
import {COBBLER_URL} from 'cobbler-api';

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
        MatTableModule,
        HttpClientTestingModule
      ,
        RouterTestingModule,
        MatTableModule
      ],
      declarations: [
        AppSettingsComponent,
        RouterOutletStubComponent
      ],
      providers: [
        {
          provide: COBBLER_URL,
          useValue: new URL("https://localhost/cobbler_api")
        }
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
