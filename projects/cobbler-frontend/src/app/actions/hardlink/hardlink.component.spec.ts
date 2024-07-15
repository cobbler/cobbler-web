import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {COBBLER_URL} from 'cobbler-api';

import { HardlinkComponent } from './hardlink.component';

describe('HardlinkComponent', () => {
  let component: HardlinkComponent;
  let fixture: ComponentFixture<HardlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HardlinkComponent,
        MatButtonModule,
      ],
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

    fixture = TestBed.createComponent(HardlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
