import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, provideRouter} from '@angular/router';
import {COBBLER_URL} from 'cobbler-api';

import { PackageEditComponent } from './package-edit.component';

describe('PackageEditComponent', () => {
  let component: PackageEditComponent;
  let fixture: ComponentFixture<PackageEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PackageEditComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api')
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => "testpackage"
              },
            },
          },
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
