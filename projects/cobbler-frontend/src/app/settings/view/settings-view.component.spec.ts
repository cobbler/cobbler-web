import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { SettingsViewComponent } from './settings-view.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppSettingsComponent', () => {
  let component: SettingsViewComponent;
  let fixture: ComponentFixture<SettingsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MatTableModule,
        MatPaginatorModule,
        MatTableModule,
        NoopAnimationsModule,
        SettingsViewComponent],
    providers: [
        {
            provide: COBBLER_URL,
            useValue: new URL('https://localhost/cobbler_api'),
        },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();
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
