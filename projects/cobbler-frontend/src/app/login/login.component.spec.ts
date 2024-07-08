import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Component, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { COBBLER_URL, CobblerApiService } from 'cobbler-api';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

import { LogInFormComponent } from './login.component';

@Component({ selector: 'cobbler-blank', template: '' })
class BlankStubComponent {}

@Injectable()
class MockCobblerApiService extends CobblerApiService {
  reconfigureService(url: URL) {
    console.log('reconfigure called');
  }

  login(username: string, password: string) {
    console.log('login called');
    return new Observable<string>((subscriber) => {
      subscriber.next('token');
    });
  }
}

describe('LogInFormComponent', () => {
  let routerStub;
  let component: LogInFormComponent;
  let fixture: ComponentFixture<LogInFormComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    routerStub = {
      navigate: jasmine.createSpy('navigate'),
    };
    await TestBed.configureTestingModule({
      imports: [
        LogInFormComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: Router,
          useValue: routerStub,
        },
        {
          provide: COBBLER_URL,
          useValue: new URL('https://localhost/cobbler_api'),
        },
        {
          provide: CobblerApiService,
          useClass: MockCobblerApiService,
        },
        UserService,
      ],
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should authorize correctly', () => {
    component.login_form.controls['username'].setValue('cobbler');
    component.login_form.controls['password'].setValue('cobbler');
    component.Authorize();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/manage']);
    expect(component.authO.token).toEqual('token');
  });
});
