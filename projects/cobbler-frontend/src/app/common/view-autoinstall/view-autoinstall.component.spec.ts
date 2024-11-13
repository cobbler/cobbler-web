import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';
import { routes } from '../../app-routing.module';

import { ViewAutoinstallComponent } from './view-autoinstall.component';

describe('ViewAutoinstallComponent', () => {
  let component: ViewAutoinstallComponent;
  let fixture: ComponentFixture<ViewAutoinstallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAutoinstallComponent, NoopAnimationsModule],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [{ path: 'profile' }],
              paramMap: {
                get: () => 'testprof',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAutoinstallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
