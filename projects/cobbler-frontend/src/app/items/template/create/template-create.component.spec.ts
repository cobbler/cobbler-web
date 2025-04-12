import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { COBBLER_URL } from 'cobbler-api';

import { TemplateCreateComponent } from './template-create.component';

describe('TemplateCreateComponent', () => {
  let component: TemplateCreateComponent;
  let fixture: ComponentFixture<TemplateCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TemplateCreateComponent,
        MatButtonModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatInputModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
