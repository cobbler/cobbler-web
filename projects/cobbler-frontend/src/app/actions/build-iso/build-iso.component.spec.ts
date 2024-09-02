import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { COBBLER_URL } from 'cobbler-api';

import { BuildISOComponent } from './build-iso.component';

describe('BuildISOComponent', () => {
  let component: BuildISOComponent;
  let fixture: ComponentFixture<BuildISOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildISOComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildISOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
