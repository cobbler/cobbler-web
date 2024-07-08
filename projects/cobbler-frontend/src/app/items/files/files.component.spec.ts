import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {COBBLER_URL} from 'cobbler-api';

import { FilesComponent } from './files.component';
import {ReactiveFormsModule} from "@angular/forms";


describe('AppFilesComponent', () => {
  let component: FilesComponent;
  let fixture: ComponentFixture<FilesComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FilesComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideRouter([]),
        {
          provide: COBBLER_URL,
          useValue: new URL('https://localhost/cobbler_api'),
        },
      ]
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
