import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import {provideRouter} from '@angular/router';

import { AppEventsComponent } from './app-events.component';


describe('AppEventsComponent', () => {
  let component: AppEventsComponent;
  let fixture: ComponentFixture<AppEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppEventsComponent, MatListModule],
      providers: [
        provideRouter([]),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
