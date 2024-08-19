import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { RepositoryEditComponent } from './repository-edit.component';

describe('RepositoryEditComponent', () => {
  let component: RepositoryEditComponent;
  let fixture: ComponentFixture<RepositoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryEditComponent, NoopAnimationsModule],
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
                get: () => 'testrepository',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
