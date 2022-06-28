import {Component} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {COBBLER_URL} from 'cobbler-api';

import { SettingsViewComponent } from './settings-view.component';

// eslint-disable-next-line @angular-eslint/component-selector
@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent {
}

describe('AppSettingsComponent', () => {
  let component: SettingsViewComponent;
  let fixture: ComponentFixture<SettingsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatPaginatorModule,
        MatTableModule,
        NoopAnimationsModule
      ],
      declarations: [
        SettingsViewComponent,
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
    fixture = TestBed.createComponent(SettingsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
