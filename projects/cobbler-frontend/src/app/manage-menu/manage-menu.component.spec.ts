import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { ManageMenuComponent } from './manage-menu.component';
import { COBBLER_URL } from 'cobbler-api';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({ selector: 'cobbler-navbar', template: '', standalone: true })
class NavbarStubComponent {}

describe('ManageMenuComponent', () => {
  let component: ManageMenuComponent;
  let fixture: ComponentFixture<ManageMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MatListModule,
        MatSidenavModule,
        MatDividerModule,
        MatToolbarModule,
        MatIconModule,
        NoopAnimationsModule,
        ManageMenuComponent,
        NavbarStubComponent],
    providers: [
        provideRouter([]),
        {
            provide: COBBLER_URL,
            useValue: new URL('https://localhost/cobbler_api'),
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();
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
