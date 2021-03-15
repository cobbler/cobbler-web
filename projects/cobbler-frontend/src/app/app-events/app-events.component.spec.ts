import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {AppEventsComponent} from './app-events.component';

describe('AppEventsComponent', () => {
  let component: AppEventsComponent;
  let fixture: ComponentFixture<AppEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppEventsComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();
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
