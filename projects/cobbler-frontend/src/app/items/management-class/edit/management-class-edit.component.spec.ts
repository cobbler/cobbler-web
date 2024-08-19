import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { ManagementClassEditComponent } from './management-class-edit.component';

describe('ManagementClassEditComponent', () => {
  let component: ManagementClassEditComponent;
  let fixture: ComponentFixture<ManagementClassEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementClassEditComponent, NoopAnimationsModule],
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
                get: () => 'testmgmtclass',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementClassEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
