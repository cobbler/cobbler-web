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
import { AppConfigService } from '../services/app-config.service';
import { SsoService } from '../services/sso.service';

import { LogInFormComponent } from './login.component';
import {
  HttpErrorResponse,
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
  let appConfigService: AppConfigService;
  let ssoService: SsoService;

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
    appConfigService = TestBed.inject(AppConfigService);
    ssoService = TestBed.inject(SsoService);
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

  describe('SSO bootstrap (per-server, gated on confirmed reachability)', () => {
    // Deliberately distinct from the default COBBLER_URL-prefilled server
    // ('https://localhost/cobbler_api') so that selecting them always
    // produces a genuinely new value for the reachability pipeline's
    // distinctUntilChanged, regardless of what the config's auto-prefill
    // logic may have already set.
    const PASSWORD_URL = 'https://plain.example.com/cobbler_api';
    const SSO_URL = 'https://sso.example.com/cobbler_api';
    const SSO_LOGIN_URL = '/sso_login';

    function pushTwoServerConfig() {
      appConfigService.AppConfig.next({
        cobblerUrls: [
          PASSWORD_URL,
          { url: SSO_URL, authMode: 'sso', ssoLoginUrl: SSO_LOGIN_URL },
        ],
      });
    }

    function selectServer(url: string) {
      component.login_form.controls['server'].setValue(url);
      vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
      fixture.detectChanges();
    }

    it('selecting the plain-string (password) server never calls attemptSso, regardless of reachability', () => {
      const attemptSsoSpy = vi.spyOn(ssoService, 'attemptSso');
      pushTwoServerConfig();

      selectServer(PASSWORD_URL);

      expect(component.serverStatus()).toBe('reachable');
      expect(component.ssoConfigured()).toBe(false);
      expect(attemptSsoSpy).not.toHaveBeenCalled();
      expect(
        fixture.debugElement.query(By.css('input[formControlName="username"]')),
      ).toBeTruthy();
    });

    it('hides the manual form immediately for an SSO-configured server, but does not call attemptSso before reachability is confirmed', () => {
      const attemptSsoSpy = vi.spyOn(ssoService, 'attemptSso');
      // Simulate a ping that never resolves, so serverStatus stays 'checking'.
      vi.spyOn(cobblerApiService, 'ping').mockReturnValue(
        new Observable<boolean>(() => {
          // never emits
        }),
      );
      pushTwoServerConfig();

      selectServer(SSO_URL);

      expect(component.serverStatus()).toBe('checking');
      expect(component.ssoConfigured()).toBe(true);
      expect(attemptSsoSpy).not.toHaveBeenCalled();
      expect(
        fixture.debugElement.query(By.css('input[formControlName="username"]')),
      ).toBeFalsy();
    });

    it('never calls attemptSso for an SSO-configured server that turns out to be unreachable', () => {
      const attemptSsoSpy = vi.spyOn(ssoService, 'attemptSso');
      vi.spyOn(cobblerApiService, 'ping').mockReturnValue(
        throwError(() => new Error('down')),
      );
      pushTwoServerConfig();

      selectServer(SSO_URL);

      expect(component.serverStatus()).toBe('unreachable');
      expect(component.ssoConfigured()).toBe(true);
      expect(attemptSsoSpy).not.toHaveBeenCalled();
    });

    it('never auto-attempts SSO when multiple servers are configured, and shows a manual "sign in" button instead', () => {
      const attemptSsoSpy = vi.spyOn(ssoService, 'attemptSso');
      pushTwoServerConfig();

      selectServer(SSO_URL);

      expect(component.serverStatus()).toBe('reachable');
      expect(component.ssoStatus()).toBe('idle');
      expect(attemptSsoSpy).not.toHaveBeenCalled();

      // The user must explicitly confirm the selected server before an SSO
      // attempt is made against it - a stale/last-used server could
      // otherwise silently sign them into the wrong one.
      const signInButton = fixture.debugElement.query(
        By.css('button[type="button"]'),
      );
      expect(signInButton).toBeTruthy();
      expect((signInButton.nativeElement as HTMLButtonElement).disabled).toBe(
        false,
      );

      // The manual username/password form can never authenticate a real
      // user once SSO/passthru is configured, so it must be absent from the
      // DOM, not merely hidden.
      expect(
        fixture.debugElement.query(By.css('input[formControlName="username"]')),
      ).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('input[formControlName="password"]')),
      ).toBeFalsy();
      expect(fixture.debugElement.query(By.css('mat-checkbox'))).toBeFalsy();
      // The server field is not a credential and stays visible so the user
      // can still pick which configured Cobbler backend to reconfigure
      // against.
      expect(
        fixture.debugElement.query(By.css('input[formControlName="server"]')),
      ).toBeTruthy();
    });

    it('logs in once the manual "sign in" button is clicked, for a multi-server SSO-configured server', () => {
      const attemptSsoSpy = vi
        .spyOn(ssoService, 'attemptSso')
        .mockReturnValue(of({ username: 'alice', token: 'tok' }));
      const reconfigureSpy = vi.spyOn(cobblerApiService, 'reconfigureService');
      pushTwoServerConfig();

      selectServer(SSO_URL);
      expect(attemptSsoSpy).not.toHaveBeenCalled();

      fixture.debugElement
        .query(By.css('button[type="button"]'))
        .nativeElement.click();
      fixture.detectChanges();

      expect(attemptSsoSpy).toHaveBeenCalledTimes(1);
      expect(attemptSsoSpy).toHaveBeenCalledWith(SSO_LOGIN_URL);

      // token being non-empty proves username was assigned before token: the
      // username setter clears any stored token as a side effect.
      expect(component.authO.username).toBe('alice');
      expect(component.authO.token).toBe('tok');
      expect(component.ssoStatus()).toBe('success');
      expect(routerStub.navigate).toHaveBeenCalledWith(['/manage']);

      // Regression: the SSO success path must mirror Authorize() and persist
      // the selected server / reconfigure the API client, so a page reload
      // after SSO login re-resolves the same server instead of falling back
      // to the COBBLER_URL default.
      expect(component.authO.server).toBe(SSO_URL);
      expect(reconfigureSpy).toHaveBeenCalledWith(new URL(SSO_URL));
    });

    it('shows an "unavailable" message and hides the manual form on a 401 (no ticket presented) once reachability is confirmed', () => {
      vi.spyOn(ssoService, 'attemptSso').mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 401 })),
      );
      pushTwoServerConfig();

      selectServer(SSO_URL);
      // Multiple servers are configured, so SSO is never auto-attempted -
      // confirm via the manual "sign in" button first.
      fixture.debugElement
        .query(By.css('button[type="button"]'))
        .nativeElement.click();
      fixture.detectChanges();

      expect(component.serverStatus()).toBe('reachable');
      expect(component.ssoStatus()).toBe('unavailable');
      expect(
        fixture.debugElement.query(By.css('input[formControlName="username"]')),
      ).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('input[formControlName="password"]')),
      ).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('button[type="submit"]')),
      ).toBeFalsy();
      expect(fixture.debugElement.query(By.css('mat-checkbox'))).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('.sso-status-unavailable')),
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('input[formControlName="server"]')),
      ).toBeTruthy();
    });

    it('shows an error message and hides the manual form when attemptSso fails with a non-401 status once reachability is confirmed', () => {
      vi.spyOn(ssoService, 'attemptSso').mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 403 })),
      );
      pushTwoServerConfig();

      selectServer(SSO_URL);
      // Multiple servers are configured, so SSO is never auto-attempted -
      // confirm via the manual "sign in" button first.
      fixture.debugElement
        .query(By.css('button[type="button"]'))
        .nativeElement.click();
      fixture.detectChanges();

      expect(component.serverStatus()).toBe('reachable');
      expect(component.ssoStatus()).toBe('error');
      expect(
        fixture.debugElement.query(By.css('input[formControlName="username"]')),
      ).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('input[formControlName="password"]')),
      ).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('button[type="submit"]')),
      ).toBeFalsy();
      expect(fixture.debugElement.query(By.css('mat-checkbox'))).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('.sso-status-error')),
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('input[formControlName="server"]')),
      ).toBeTruthy();
    });

    it('switching from the SSO-configured server back to the plain-string server updates ssoConfigured() and re-reveals the form', () => {
      vi.spyOn(ssoService, 'attemptSso').mockReturnValue(
        of({ username: 'alice', token: 'tok' }),
      );
      pushTwoServerConfig();

      selectServer(SSO_URL);
      expect(component.ssoConfigured()).toBe(true);
      expect(
        fixture.debugElement.query(By.css('input[formControlName="username"]')),
      ).toBeFalsy();

      selectServer(PASSWORD_URL);

      expect(component.ssoConfigured()).toBe(false);
      expect(component.serverStatus()).toBe('reachable');
      expect(
        fixture.debugElement.query(By.css('input[formControlName="username"]')),
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('input[formControlName="password"]')),
      ).toBeTruthy();
    });

    it('ignores a stale in-flight SSO response after the user switches to a different server before it resolves', () => {
      let resolveSso: (value: { username: string; token: string }) => void;
      const ssoResponse$ = new Observable<{
        username: string;
        token: string;
      }>((subscriber) => {
        resolveSso = (value) => {
          subscriber.next(value);
          subscriber.complete();
        };
      });
      vi.spyOn(ssoService, 'attemptSso').mockReturnValue(ssoResponse$);
      pushTwoServerConfig();

      selectServer(SSO_URL);
      expect(component.serverStatus()).toBe('reachable');
      // Multiple servers are configured, so SSO is never auto-attempted -
      // confirm via the manual "sign in" button first.
      fixture.debugElement
        .query(By.css('button[type="button"]'))
        .nativeElement.click();
      fixture.detectChanges();
      expect(component.ssoStatus()).toBe('checking');

      // The user switches to the plain-string server before the SSO request
      // resolves.
      selectServer(PASSWORD_URL);
      expect(component.ssoConfigured()).toBe(false);
      expect(component.ssoStatus()).toBe('idle');

      // The stale SSO response now arrives - it must not mutate any state,
      // since it no longer applies to the currently selected server.
      resolveSso({ username: 'alice', token: 'tok' });
      fixture.detectChanges();

      expect(component.authO.username).not.toBe('alice');
      expect(component.ssoStatus()).toBe('idle');
      expect(routerStub.navigate).not.toHaveBeenCalledWith(['/manage']);
    });

    it('re-evaluates ssoConfigured and attempts SSO for the already-selected server when its config arrives late, after reachability was already confirmed (returning-user regression)', () => {
      // Regression: on a cold load, AppConfig$ (two chained HTTP GETs) can
      // resolve AFTER the reachability pipeline has already confirmed the
      // (still-unchanged) prefilled server reachable. Because the server
      // value doesn't change when that happens, the reachability pipeline's
      // distinctUntilChanged() would otherwise silently drop the re-emitted
      // value, so it would never re-evaluate ssoConfigured/attempt SSO for
      // the now-loaded config - leaving a returning SSO user stuck on a
      // non-functional password form.
      expect(component.serverStatus()).toBe('reachable'); // established in the outer beforeEach
      expect(component.ssoConfigured()).toBe(false);
      const attemptSsoSpy = vi
        .spyOn(ssoService, 'attemptSso')
        .mockReturnValue(of({ username: 'bob', token: 'tok2' }));

      // The server URL here deliberately matches the already-selected/
      // already-confirmed-reachable default (COBBLER_URL), not a distinct
      // dummy URL - that's the crux of the race being regression-tested.
      appConfigService.AppConfig.next({
        cobblerUrls: [
          {
            url: 'https://localhost/cobbler_api',
            authMode: 'sso',
            ssoLoginUrl: '/sso_login',
          },
        ],
      });
      fixture.detectChanges();

      expect(component.ssoConfigured()).toBe(true);
      expect(attemptSsoSpy).toHaveBeenCalledTimes(1);
      expect(attemptSsoSpy).toHaveBeenCalledWith('/sso_login');
      expect(component.ssoStatus()).toBe('success');
      expect(component.authO.username).toBe('bob');
      expect(component.authO.token).toBe('tok2');
    });

    it('attempts SSO correctly when the config for the selected server arrives WHILE its ping is still in flight (not merely after)', () => {
      // Narrower sibling of the previous regression: here the config for a
      // NEWLY selected server arrives before the reachability pipeline's
      // switchMap has even resolved a status for it - i.e. while the ping
      // it kicked off (with only a stale/password-only entry available at
      // the time) is still pending. The final `.subscribe()` must
      // re-resolve the entry against the freshest config at the moment the
      // ping actually resolves, not reuse whatever (stale) entry was
      // captured back when switchMap started, or the SSO attempt would be
      // silently skipped even though ssoConfigured() correctly flips true.
      const LATE_SSO_URL = 'https://late-sso.example.com/cobbler_api';
      let resolvePing: (value: boolean) => void;
      const ping$ = new Observable<boolean>((subscriber) => {
        resolvePing = (value) => {
          subscriber.next(value);
          subscriber.complete();
        };
      });
      vi.spyOn(cobblerApiService, 'ping').mockReturnValue(ping$);
      const attemptSsoSpy = vi
        .spyOn(ssoService, 'attemptSso')
        .mockReturnValue(of({ username: 'carol', token: 'tok3' }));

      // Select a server that isn't in any loaded config yet (config is
      // still empty at this point), so the switchMap callback resolves it
      // to a password-only fallback entry and kicks off the (still
      // pending) ping.
      component.login_form.controls['server'].setValue(LATE_SSO_URL);
      vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
      fixture.detectChanges();

      expect(component.serverStatus()).toBe('checking');
      expect(component.ssoConfigured()).toBe(false);

      // Now, while that ping is still in flight, the config arrives and
      // reveals this exact server is SSO-configured.
      appConfigService.AppConfig.next({
        cobblerUrls: [
          {
            url: LATE_SSO_URL,
            authMode: 'sso',
            ssoLoginUrl: '/late_sso_login',
          },
        ],
      });
      fixture.detectChanges();

      // ssoConfigured must update immediately, independent of reachability.
      expect(component.ssoConfigured()).toBe(true);
      expect(attemptSsoSpy).not.toHaveBeenCalled();

      // The ping now resolves - the entry used here must be re-resolved
      // fresh, not the stale password-only one captured when switchMap ran.
      resolvePing(true);
      fixture.detectChanges();

      expect(component.serverStatus()).toBe('reachable');
      expect(attemptSsoSpy).toHaveBeenCalledTimes(1);
      expect(attemptSsoSpy).toHaveBeenCalledWith('/late_sso_login');
      expect(component.ssoStatus()).toBe('success');
      expect(component.authO.username).toBe('carol');
      expect(component.authO.token).toBe('tok3');
    });

    it('keeps the manual form fully visible and renders no SSO message region when authMode is password or absent', () => {
      fixture.detectChanges();

      expect(component.ssoConfigured()).toBe(false);
      expect(
        fixture.debugElement.query(By.css('input[formControlName="username"]')),
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('input[formControlName="password"]')),
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('button[type="submit"]')),
      ).toBeTruthy();
      expect(fixture.debugElement.query(By.css('mat-checkbox'))).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('input[formControlName="server"]')),
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('.sso-status-unavailable')),
      ).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('.sso-status-error')),
      ).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('.sso-status-checking')),
      ).toBeFalsy();
    });
  });
});

describe('LogInFormComponent - SSO already configured at very first render (logout regression)', () => {
  let appConfigService: AppConfigService;

  beforeEach(async () => {
    const routerStub = { navigate: vi.fn().mockName('navigate') };
    await TestBed.configureTestingModule({
      imports: [
        LogInFormComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: Router, useValue: routerStub },
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
    // Start from a clean slate: UserService.server falls back to reading
    // COBBLER_URL from localStorage, which must not leak in from other
    // spec files/tests sharing the same jsdom environment.
    localStorage.clear();
    appConfigService = TestBed.inject(AppConfigService);
  });

  it('does not throw in ngAfterViewInit when AppConfigService already resolves ssoConfigured to true before the view is first rendered', () => {
    // Simulate AppConfigService's cached BehaviorSubject already holding an
    // SSO-configured config for the last-used server BEFORE this component
    // instance exists - e.g. a fresh LogInFormComponent constructed by an
    // SPA route change back to /login after logout: the AppConfig$
    // subscription in the constructor fires SYNCHRONOUSLY with the
    // already-cached config, so ssoConfigured() can become true before
    // ngAfterViewInit runs and before the #usernameInput/#passwordInput
    // ViewChilds (only present when the manual form renders) ever exist.
    appConfigService.AppConfig.next({
      cobblerUrls: [
        {
          url: 'https://localhost/cobbler_api',
          authMode: 'sso',
          ssoLoginUrl: '/sso_login',
        },
      ],
    });

    const fixture = TestBed.createComponent(LogInFormComponent);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.ssoConfigured()).toBe(true);
  });
});

describe('LogInFormComponent - post-logout SSO suppression', () => {
  let userService: UserService;
  let appConfigService: AppConfigService;
  let ssoService: SsoService;

  beforeEach(async () => {
    const routerStub = { navigate: vi.fn().mockName('navigate') };
    await TestBed.configureTestingModule({
      imports: [
        LogInFormComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: Router, useValue: routerStub },
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
    localStorage.clear();
    userService = TestBed.inject(UserService);
    appConfigService = TestBed.inject(AppConfigService);
    ssoService = TestBed.inject(SsoService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('skips exactly one auto-SSO attempt after an explicit logout and shows a "logged out" message (not the non-functional manual form), then resumes auto-SSO on the next load', () => {
    // Simulate NavbarComponent.logout() having just run.
    userService.suppressNextSso();

    vi.useFakeTimers();
    const attemptSsoSpy = vi.spyOn(ssoService, 'attemptSso');

    // The SSO-configured server is already the cached/last-used one, same as
    // the logout-regression scenario above.
    appConfigService.AppConfig.next({
      cobblerUrls: [
        {
          url: 'https://localhost/cobbler_api',
          authMode: 'sso',
          ssoLoginUrl: '/sso_login',
        },
      ],
    });

    const fixture = TestBed.createComponent(LogInFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
    fixture.detectChanges();

    expect(component.serverStatus()).toBe('reachable');
    expect(attemptSsoSpy).not.toHaveBeenCalled();
    // Suppression must NOT reveal the manual form: it's still non-functional
    // for this SSO-configured server regardless of suppression. ssoConfigured
    // stays true, and a distinct "logged out" message shows instead.
    expect(component.ssoConfigured()).toBe(true);
    expect(component.ssoStatus()).toBe('logged-out');
    expect(
      fixture.debugElement.query(By.css('.sso-status-logged-out')),
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('input[formControlName="username"]')),
    ).toBeFalsy();
    expect(
      fixture.debugElement.query(By.css('input[formControlName="password"]')),
    ).toBeFalsy();
    // Only one server is configured, so there's nothing to "select" - the
    // multi-server wording would be confusing here.
    const loggedOutMessage = fixture.debugElement.query(
      By.css('.sso-status-logged-out'),
    );
    expect(loggedOutMessage.nativeElement.textContent).toContain(
      'Reload this page to sign in again via Kerberos.',
    );
    expect(loggedOutMessage.nativeElement.textContent).not.toContain(
      'select a different server below',
    );

    // A reload button lets the user re-attempt Kerberos SSO without having
    // to know they can just refresh the browser themselves. jsdom's
    // window.location.reload isn't spy-able in place, so swap the whole
    // location object out for the duration of this assertion.
    const originalLocation = window.location;
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload: reloadSpy },
    });
    const reloadButton = fixture.debugElement.query(
      By.css('button[type="button"]'),
    );
    expect(reloadButton).toBeTruthy();
    reloadButton.nativeElement.click();
    expect(reloadSpy).toHaveBeenCalledTimes(1);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });

    // The suppression is one-time: a subsequent page load (a fresh component
    // instance, e.g. after a reload) must resume normal auto-SSO behavior,
    // since UserService.consumeSsoSuppression() already cleared the flag.
    const secondSsoSpy = vi
      .spyOn(ssoService, 'attemptSso')
      .mockReturnValue(of({ username: 'dave', token: 'tok4' }));
    const secondFixture = TestBed.createComponent(LogInFormComponent);
    secondFixture.detectChanges();
    vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
    secondFixture.detectChanges();

    expect(secondFixture.componentInstance.ssoConfigured()).toBe(true);
    expect(secondSsoSpy).toHaveBeenCalledTimes(1);
    expect(secondSsoSpy).toHaveBeenCalledWith('/sso_login');
  });

  it('mentions picking a different server in the "logged out" message when multiple servers are configured, and offers a "sign in" button instead of "reload page"', () => {
    userService.suppressNextSso();

    vi.useFakeTimers();
    const attemptSsoSpy = vi.spyOn(ssoService, 'attemptSso');

    appConfigService.AppConfig.next({
      cobblerUrls: [
        'https://other.example.com/cobbler_api',
        {
          url: 'https://localhost/cobbler_api',
          authMode: 'sso',
          ssoLoginUrl: '/sso_login',
        },
      ],
    });

    const fixture = TestBed.createComponent(LogInFormComponent);
    fixture.detectChanges();
    vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
    fixture.detectChanges();

    expect(fixture.componentInstance.ssoStatus()).toBe('logged-out');
    const loggedOutMessage = fixture.debugElement.query(
      By.css('.sso-status-logged-out'),
    );
    expect(loggedOutMessage.nativeElement.textContent).toContain(
      'select a different server below',
    );

    // The "Reload page" recovery is only meaningful for a single-server
    // config (see the sibling test above) - with multiple servers, the
    // regular "Sign in via Kerberos" button is the way back in instead.
    const buttons = fixture.debugElement.queryAll(
      By.css('button[type="button"]'),
    );
    expect(buttons).toHaveLength(1);
    const signInButton = buttons[0];
    expect(signInButton.nativeElement.textContent).not.toContain('Reload page');
    expect(signInButton.nativeElement.textContent).toContain(
      'Sign in via Kerberos',
    );

    // Clicking it must still work despite the post-logout suppression flag:
    // that flag only blocks *automatic* re-login, not an explicit click.
    signInButton.nativeElement.click();
    expect(attemptSsoSpy).toHaveBeenCalledTimes(1);
    expect(attemptSsoSpy).toHaveBeenCalledWith('/sso_login');
  });

  it('also shows a "logged out" message for a password-only server, so the form does not resize while switching servers post-logout', () => {
    userService.suppressNextSso();

    vi.useFakeTimers();
    appConfigService.AppConfig.next({
      cobblerUrls: [
        'https://other.example.com/cobbler_api',
        {
          url: 'https://localhost/cobbler_api',
          authMode: 'sso',
          ssoLoginUrl: '/sso_login',
        },
      ],
    });

    const fixture = TestBed.createComponent(LogInFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
    fixture.detectChanges();

    // Switch to the password-only server.
    component.login_form.controls['server'].setValue(
      'https://other.example.com/cobbler_api',
    );
    vi.advanceTimersByTime(SERVER_CHECK_DEBOUNCE_MS);
    fixture.detectChanges();

    expect(component.ssoConfigured()).toBe(false);
    expect(component.ssoStatus()).toBe('logged-out');
    // The manual form is genuinely functional for this server and must
    // stay visible/usable, unlike the SSO case.
    expect(
      fixture.debugElement.query(By.css('input[formControlName="username"]')),
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('input[formControlName="password"]')),
    ).toBeTruthy();
    const loggedOutMessage = fixture.debugElement.query(
      By.css('.sso-status-logged-out'),
    );
    expect(loggedOutMessage).toBeTruthy();
    expect(loggedOutMessage.nativeElement.textContent).toContain(
      'You have been logged out.',
    );
    // Neither the SSO-specific reload nor sign-in button applies here.
    expect(
      fixture.debugElement.query(By.css('button[type="button"]')),
    ).toBeFalsy();
  });
});
