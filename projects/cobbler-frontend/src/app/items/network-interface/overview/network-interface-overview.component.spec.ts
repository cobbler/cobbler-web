import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { NetworkInterfaceOverviewComponent } from './network-interface-overview.component';

describe('OverviewComponent', () => {
  let component: NetworkInterfaceOverviewComponent;
  let fixture: ComponentFixture<NetworkInterfaceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkInterfaceOverviewComponent],
      providers: [
        provideRouter([]),
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
              paramMap: {
                get: () => 'testsystem',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkInterfaceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
