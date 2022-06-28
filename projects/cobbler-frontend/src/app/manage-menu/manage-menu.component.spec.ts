import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import { ManageMenuComponent } from './manage-menu.component';

import { RouterTestingModule } from '@angular/router/testing';

// eslint-disable-next-line @angular-eslint/component-selector
@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent {
}

@Component({selector: 'app-navbar', template: ''})
class NavbarStubComponent {
}

describe('ManageMenuComponent', () => {
  let component: ManageMenuComponent;
  let fixture: ComponentFixture<ManageMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatListModule,
        MatSidenavModule,
        MatDividerModule,
        MatToolbarModule,
        MatIconModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      declarations: [
        ManageMenuComponent,
        NavbarStubComponent,
        RouterOutletStubComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
