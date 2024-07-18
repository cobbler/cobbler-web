import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatTreeModule} from '@angular/material/tree';
import {COBBLER_URL} from 'cobbler-api';

import { SignaturesComponent } from './signatures.component';

describe('SignaturesComponent', () => {
  let component: SignaturesComponent;
  let fixture: ComponentFixture<SignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SignaturesComponent,
        MatTreeModule,
        MatIconModule,
        MatTableModule,
        MatDividerModule,
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

    fixture = TestBed.createComponent(SignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
