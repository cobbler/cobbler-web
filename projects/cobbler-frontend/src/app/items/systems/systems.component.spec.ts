import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';

import { SystemsComponent } from './systems.component';


describe('SystemsComponent', () => {
  let component: SystemsComponent;
  let fixture: ComponentFixture<SystemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SystemsComponent,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [
        provideRouter([]),
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
