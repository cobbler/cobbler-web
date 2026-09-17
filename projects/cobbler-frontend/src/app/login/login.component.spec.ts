import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { describe, expect, it, vi } from 'vitest';

import { Component, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { COBBLER_URL, CobblerApiService } from 'cobbler-api';
import { Observable, of, throwError } from 'rxjs';
import { UserService } from '../services/user.service';

import { LogInFormComponent } from './login.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

const SERVER_CHECK_DEBOUNCE_MS = 300;
const SERVER_CHECK_TIMEOUT_MS = 5000;

@Component({
  selector: 'cobbler-blank',
  template: '',
  standalone: true,
})
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

  ping() {
    return of(true);
  }
}

describe('LogInFormComponent', () => {
  let routerStub;
  let component: LogInFormComponent;
  let fixture: ComponentFixture<LogInFormComponent>;
  let httpTestingController: HttpTestingController;
  let cobblerApiService: CobblerApiService;

  beforeEach(async () => {
    routerStub = {
      navigate: vi.fn().mockName('navigate'),
    };
    await TestBed.configureTestingModule({
      imports: [
        LogInFormComponent,
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    vi.useFakeTimers();
    fixture = TestBed.createComponent(LogInFormComponent);
    component = fixture.componentInstance;
    cobblerApiService = TestBed.inject(CobblerApiService);
    fixture.detectChanges();
    // Flush the initial reachability check triggered for the prefilled server URL.
    vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it('checks the prefilled server URL on init without user interaction', () => {
    expect(component.serverStatus()).toBe('reachable');
  });

  it('shows reachable status after entering a valid server URL', () => {
    component.login_form.controls['server'].setValue(
      'https://good.example/cobbler_api',
    );
    vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
    expect(component.serverStatus()).toBe('reachable');
  });

  it('shows unreachable status when ping errors', () => {
    vi.spyOn(cobblerApiService, 'ping').mockReturnValue(
      throwError(() => new Error('down')),
    );
    component.login_form.controls['server'].setValue(
      'https://bad.example/cobbler_api',
    );
    vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
    expect(component.serverStatus()).toBe('unreachable');
  });

  it('shows unreachable status when ping times out', () => {
    vi.spyOn(cobblerApiService, 'ping').mockReturnValue(
      new Observable<boolean>(() => {
        // never emits
      }),
    );
    component.login_form.controls['server'].setValue(
      'https://slow.example/cobbler_api',
    );
    vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
    vi.advanceTimersByTime(SERVER_CHECK_TIMEOUT_MS);
    expect(component.serverStatus()).toBe('unreachable');
  });

  it('does not ping for an invalid URL and stays idle', () => {
    const pingSpy = vi.spyOn(cobblerApiService, 'ping');
    component.login_form.controls['server'].setValue('not-a-url');
    vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
    expect(component.serverStatus()).toBe('idle');
    expect(pingSpy).not.toHaveBeenCalled();
  });

  it('enables the submit button once the form is valid and the server is reachable', () => {
    component.login_form.controls['username'].setValue('cobbler');
    component.login_form.controls['password'].setValue('cobbler');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  it('disables the submit button and enables a hover hint when the server is unreachable', () => {
    vi.spyOn(cobblerApiService, 'ping').mockReturnValue(
      throwError(() => new Error('down')),
    );
    component.login_form.controls['username'].setValue('cobbler');
    component.login_form.controls['password'].setValue('cobbler');
    component.login_form.controls['server'].setValue(
      'https://bad.example/cobbler_api',
    );
    vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    const tooltip = fixture.debugElement
      .query(By.directive(MatTooltip))
      .injector.get(MatTooltip);
    expect(tooltip.disabled).toBe(false);
    expect(tooltip.message).toBe('Server is not reachable');
  });

  it('shows no warning banner while the server is reachable', () => {
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.server-status-unreachable')),
    ).toBeFalsy();
  });

  it('shows a warning banner when the server is unreachable', () => {
    vi.spyOn(cobblerApiService, 'ping').mockReturnValue(
      throwError(() => new Error('down')),
    );
    component.login_form.controls['server'].setValue(
      'https://bad.example/cobbler_api',
    );
    vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.server-status-unreachable')),
    ).toBeTruthy();
  });
});
