import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { COBBLER_URL } from 'cobbler-api';

import { ValidateAutoinstallsComponent } from './validate-autoinstalls.component';

describe('ValidateAutoinstallsComponent', () => {
  let component: ValidateAutoinstallsComponent;
  let fixture: ComponentFixture<ValidateAutoinstallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateAutoinstallsComponent, MatButtonModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidateAutoinstallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
