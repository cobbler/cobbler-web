import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {COBBLER_URL} from 'cobbler-api';

import { PackageOverviewComponent } from './package-overview.component';

describe('PackageOverviewComponent', () => {
  let component: PackageOverviewComponent;
  let fixture: ComponentFixture<PackageOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageOverviewComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api')
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
