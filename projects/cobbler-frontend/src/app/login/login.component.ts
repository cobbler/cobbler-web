import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { COBBLER_URL, CobblerApiService } from 'cobbler-api';
import {
  AppConfigService,
  AppConfig,
  CobblerServerConfig,
  CobblerServerEntry,
  serverAuthMode,
  serverSsoLoginUrl,
  serverUrl,
} from '../services/app-config.service';
import { HttpErrorResponse } from '@angular/common/http';

import { AsyncPipe, CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthGuardService } from '../services/auth-guard.service';
import { UserService } from '../services/user.service';
import { SsoService } from '../services/sso.service';
import { merge, Observable, of, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  timeout,
} from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

const SERVER_CHECK_DEBOUNCE_MS = 300;
const SERVER_CHECK_TIMEOUT_MS = 5000;

export type ServerStatus = 'idle' | 'checking' | 'reachable' | 'unreachable';

@Component({
  selector: 'cobbler-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInFormComponent implements OnDestroy, AfterViewInit {
  authO = inject(UserService);
  private router = inject(Router);
  private guard = inject(AuthGuardService);
  private cobblerApiService = inject(CobblerApiService);
  private configService = inject(AppConfigService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private ssoService = inject(SsoService);

  subs = new Subscription();
  errMsgServer = signal('');
  errMsgUser = signal('');
  errMsgPassword = signal('');
  serverStatus = signal<ServerStatus>('idle');
  ssoStatus = signal<
    'idle' | 'checking' | 'success' | 'unavailable' | 'error' | 'logged-out'
  >('idle');
  // Whenever SSO is configured (authMode 'sso' with a ssoLoginUrl), the
  // manual username/password form can never authenticate a real user:
  // the backend's passthru auth module ignores the username and only checks
  // the password against a server-side shared secret, and Cobbler loads
  // exactly one auth module system-wide. The form must be hidden, not
  // offered as a "fallback".
  ssoConfigured = signal(false);

  private readonly _formBuilder = inject(FormBuilder);
  server_prefilled: string;
  message = null;
  config: Observable<AppConfig>;
  // Populated from every AppConfig$ emission so the reachability pipeline can
  // resolve which server-entry (and therefore which auth mode) corresponds to
  // the currently selected server URL.
  private latestConfig: AppConfig = { cobblerUrls: [] };
  // Tracks the currently in-flight SSO attempt (if any) so a server change
  // can cancel it - both so a stale response can't mutate state (the
  // staleness guard in maybeAttemptSso already covers that) and so the
  // actual SPNEGO negotiation against the abandoned server doesn't keep
  // running client/server-side after the user has moved on.
  private ssoAttemptSub?: Subscription;
  // Records which server value serverStatus() actually describes, so a
  // catch-up read of serverStatus() elsewhere (e.g. the AppConfig$ handler
  // below) can't mistake a status that describes a PREVIOUS server for one
  // describing the currently-selected server (see maybeAttemptSso callers).
  private statusServer: string | null = null;
  // Consumed exactly once, at construction, from UserService's one-time
  // logout flag. If true, this single page load never auto-attempts SSO -
  // even for an SSO-configured server, where a still-valid Kerberos ticket
  // would otherwise silently re-authenticate the user via the reachability
  // pipeline / AppConfig$ catch-up below, making logout a no-op. The manual
  // form is NOT shown as a substitute for an SSO-configured server (it's
  // still non-functional there); instead ssoStatus becomes 'logged-out' so
  // the user sees an explicit "you are logged out" message and can reload to
  // sign in again, or pick a different (password-only) server from the
  // dropdown, which remains visible and functional throughout. A subsequent
  // reload/navigation finds the flag already cleared (see
  // UserService.consumeSsoSuppression()) and resumes normal auto-SSO
  // behavior.
  private readonly ssoSuppressedThisLoad: boolean;
  login_form = this._formBuilder.group({
    server: ['', [Validators.required, LogInFormComponent.urlValidator]],
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', Validators.required],
    rememberUsername: [false],
  });

  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  private static urlValidator({
    value,
  }: AbstractControl): null | ValidationErrors {
    try {
      new URL(value);
      return null;
    } catch {
      return { pattern: true };
    }
  }

  constructor() {
    const url = inject<URL>(COBBLER_URL);
    const configService = this.configService;

    this.ssoSuppressedThisLoad = this.authO.consumeSsoSuppression();

    if (this.authO.localUsername) {
      this.login_form.controls.username.setValue(this.authO.localUsername);
      this.login_form.controls.rememberUsername.setValue(true);
    }

    this.configService.loadConfig();
    this.config = configService.AppConfig$;

    // The injection token has a default value and as such is always set.
    this.server_prefilled = url.toString();
    this.login_form.controls.server.setValue(this.server_prefilled);

    this.subs.add(
      this.configService.AppConfig$.subscribe((config) => {
        this.latestConfig = config;
        if (config.cobblerUrls.length === 0) return; // emit EMPTY_CONFIG
        const previousValue = this.login_form.value.server;
        const lastUsedServer = this.authO.server; // reads from local storage
        // use last server if config contains it, otherwise use last from the array
        const targetUrl = config.cobblerUrls.some(
          (e) => serverUrl(e) === lastUsedServer,
        )
          ? lastUsedServer
          : serverUrl(config.cobblerUrls[config.cobblerUrls.length - 1]);
        this.login_form.controls.server.setValue(targetUrl);

        // If the config resolves to the SAME server value that's already
        // selected, setValue() above is a no-op as far as the debounced
        // reachability pipeline is concerned: its distinctUntilChanged()
        // drops the re-emitted (unchanged) value, so that pipeline's
        // switchMap never re-runs and never re-evaluates ssoConfigured for
        // this (now-loaded) config. This happens routinely on a cold load,
        // since AppConfig$ can resolve after the initial reachability check
        // already completed. Explicitly catch up here so a returning SSO
        // user isn't silently stuck on a non-functional password form.
        // When the value DOES change, the reachability pipeline handles
        // everything from scratch once it processes the genuinely new
        // value, so no catch-up is needed (and doing it here too would risk
        // using a stale serverStatus() that describes the PREVIOUS server,
        // not this new one).
        if (targetUrl === previousValue) {
          const entry = this.resolveServerEntry(targetUrl);
          const isSso = this.isSsoServer(entry);
          this.ssoConfigured.set(isSso);
          if (this.ssoSuppressedThisLoad) {
            // The one-time post-logout suppression flag is active for this
            // page load. For an SSO-only server this also means the manual
            // form stays hidden (via ssoConfigured above) and we must not
            // auto-attempt SSO; for a password-only server it changes
            // nothing functionally, but showing the same "logged out"
            // message regardless of server type keeps the form's layout
            // (and width) stable while the user browses the server dropdown
            // post-logout, rather than having the message pop in and out.
            this.ssoStatus.set('logged-out');
          } else if (
            this.serverStatus() === 'reachable' &&
            this.statusServer === targetUrl
          ) {
            // Mirror the switchMap path's reset before (re-)attempting SSO,
            // so a stale status can't flash/linger from a previous
            // selection. The statusServer check guards against a race where
            // serverStatus() is still 'reachable' for a PREVIOUSLY selected
            // server (the reachability pipeline hasn't caught up yet, e.g.
            // it's still inside its debounce window) - without it, this
            // catch-up branch could fire SSO against targetUrl even though
            // targetUrl itself was never confirmed reachable.
            this.ssoStatus.set('idle');
            this.maybeAttemptSso(targetUrl, entry);
          }
        }
      }),
    );
    this.subs.add(
      merge(
        this.login_form.controls.server.statusChanges,
        this.login_form.controls.server.valueChanges,
      )
        .pipe(distinctUntilChanged())
        .subscribe(() => this.updateErrServer()),
    );
    this.subs.add(
      merge(
        this.login_form.controls.username.statusChanges,
        this.login_form.controls.username.valueChanges,
      )
        .pipe(distinctUntilChanged())
        .subscribe(() => {
          this.updateErrUser();
        }),
    );
    this.subs.add(
      merge(
        this.login_form.controls.password.statusChanges,
        this.login_form.controls.password.valueChanges,
      )
        .pipe(distinctUntilChanged())
        .subscribe(() => this.updateErrPassword()),
    );
    this.subs.add(
      this.login_form.controls.server.valueChanges
        .pipe(
          debounceTime(SERVER_CHECK_DEBOUNCE_MS),
          distinctUntilChanged(),
          switchMap((value) => {
            // Cancel any still-in-flight SSO attempt against whatever server
            // was previously selected: the staleness guard in
            // maybeAttemptSso already stops a late response from mutating
            // state, but without this the actual SPNEGO negotiation keeps
            // running client/server-side against a server the user has
            // already navigated away from (e.g. a stray credential prompt).
            this.ssoAttemptSub?.unsubscribe();

            // Resolve which configured server-entry (and therefore which auth
            // mode) the newly selected/typed URL corresponds to. This must
            // happen regardless of reachability: the manual form is genuinely
            // non-functional for an SSO-configured server either way, so
            // there's no reason to wait for a ping to hide it. Any previous
            // SSO attempt/result no longer applies to the newly selected
            // server, so ssoStatus resets too.
            const entry = this.resolveServerEntry(value);
            const isSso = this.isSsoServer(entry);
            this.ssoConfigured.set(isSso);
            // Shown regardless of server type while suppressed (see the
            // AppConfig$ catch-up path above for why) so the form's layout
            // doesn't shift as the user browses the server dropdown.
            this.ssoStatus.set(
              this.ssoSuppressedThisLoad ? 'logged-out' : 'idle',
            );

            if (this.login_form.controls.server.invalid) {
              return of({ status: 'idle' as ServerStatus, value });
            }
            this.serverStatus.set('checking');
            this.cobblerApiService.reconfigureService(new URL(value));
            return this.cobblerApiService.ping().pipe(
              timeout(SERVER_CHECK_TIMEOUT_MS),
              map<boolean, ServerStatus>(() => 'reachable'),
              catchError(() => of<ServerStatus>('unreachable')),
              map((status) => ({ status, value })),
            );
          }),
        )
        .subscribe(({ status, value }) => {
          this.serverStatus.set(status);
          this.statusServer = value;
          if (status === 'reachable') {
            // Re-resolve the entry against the FRESHEST available config,
            // rather than reusing whatever was captured when switchMap
            // started: AppConfig$ can resolve while this exact ping is
            // still in flight, and reusing a stale (pre-config) entry here
            // would silently skip an SSO attempt that should now fire.
            // Only ever attempt SSO against a server whose reachability has
            // just been confirmed - never speculatively, never against a
            // stale/different server.
            this.maybeAttemptSso(value, this.resolveServerEntry(value));
          }
          this.changeDetectorRef.markForCheck();
        }),
    );
    // Trigger an initial reachability check for the prefilled server value, since
    // valueChanges only fires on changes after subscription, not for the current value.
    this.login_form.controls.server.updateValueAndValidity();
  }

  /// Resolves the currently-relevant server config for the given URL, falling
  /// back to password-only if the URL isn't found in the loaded config (e.g.
  /// a manually-typed URL not present in the dropdown).
  private resolveServerEntry(url: string): CobblerServerConfig {
    const match = this.latestConfig.cobblerUrls.find(
      (e) => serverUrl(e) === url,
    );
    if (!match) return { url };
    return typeof match === 'string' ? { url: match } : match;
  }

  /// Whether the given server entry is SSO-configured at all. Independent of
  /// the post-logout suppression flag: the manual form must stay hidden for
  /// an SSO-configured server regardless of suppression (it's non-functional
  /// either way), only the actual SSO *attempt* is what suppression skips -
  /// see ssoSuppressedThisLoad and its callers.
  private isSsoServer(entry: CobblerServerConfig): boolean {
    return serverAuthMode(entry) !== 'password' && !!serverSsoLoginUrl(entry);
  }

  /// Attempts an SSO login for the given server, but only ever after that
  /// exact server's reachability has just been confirmed (callers must only
  /// invoke this once serverStatus is 'reachable' for serverUrlValue).
  ///
  /// Automatic callers (the reachability pipeline, the AppConfig$ catch-up
  /// path) never pass `manual: true`, and are subject to two gates a manual
  /// (button-triggered) call bypasses entirely - an explicit click already
  /// is the confirmation/intent those gates exist to require:
  /// - the one-time post-logout suppression flag (see ssoSuppressedThisLoad)
  ///   only suppresses *automatic* re-login; a user who explicitly clicks
  ///   "Sign in via Kerberos" after logging out clearly wants to sign back
  ///   in, so manual calls must still go through.
  /// - when more than one server is configured, a still-cached last-used
  ///   server could silently sign the user into the wrong one before
  ///   they've had a chance to notice/change it, so auto-attempts are
  ///   skipped in that case too - the user must confirm via the "Sign in"
  ///   button (see triggerSso()).
  private maybeAttemptSso(
    serverUrlValue: string,
    entry: CobblerServerConfig,
    { manual = false }: { manual?: boolean } = {},
  ): void {
    // Cancel any still-in-flight SSO attempt before possibly starting a new
    // one. The switchMap callback already does this for genuine server
    // changes, but maybeAttemptSso is also called directly from the
    // AppConfig$ catch-up path (a late-arriving config for the
    // already-selected server), which bypasses that cancellation point - so
    // guard here too, otherwise a second visit to this page (logout,
    // auth-guard redirect, session expiry - AppConfigService's
    // BehaviorSubject replays) could start a second concurrent SSO attempt
    // without cancelling the first.
    this.ssoAttemptSub?.unsubscribe();
    if (!this.isSsoServer(entry)) {
      // SSO isn't configured for this server - the manual login form
      // applies instead.
      return;
    }
    if (!manual && this.ssoSuppressedThisLoad) {
      return;
    }
    if (!manual && this.latestConfig.cobblerUrls.length > 1) {
      // Leave ssoStatus as-is - the template shows a manual "Sign in"
      // button in that state so the user can confirm the selected server
      // first.
      return;
    }
    this.ssoStatus.set('checking');
    this.changeDetectorRef.markForCheck();
    this.ssoAttemptSub = this.ssoService
      .attemptSso(serverSsoLoginUrl(entry))
      .subscribe({
        next: ({ username, token }) => {
          // The user may have switched to a different server while this
          // request was in flight - its result no longer applies.
          if (this.login_form.value.server !== serverUrlValue) return;
          this.authO.changeAuthorizedState(true);
          // Order matters: the username setter clears the stored token as a
          // side effect, so it must run before the token is set.
          this.authO.username = username;
          this.authO.token = token;
          // Mirror Authorize(): persist the selected server and reconfigure
          // the API client so a page reload after SSO login re-resolves the
          // same server instead of falling back to the COBBLER_URL default.
          this.authO.server = this.login_form.value.server;
          this.cobblerApiService.reconfigureService(
            new URL(this.login_form.value.server),
          );
          this.ssoStatus.set('success');
          this.changeDetectorRef.markForCheck();
          this.router.navigate(['/manage']);
        },
        error: (err: HttpErrorResponse) => {
          if (this.login_form.value.server !== serverUrlValue) return;
          // 401 means "no ticket yet" - a normal, expected outcome when the
          // browser has no Kerberos ticket. Any other status means SSO was
          // attempted but failed outright.
          this.ssoStatus.set(err.status === 401 ? 'unavailable' : 'error');
          this.changeDetectorRef.markForCheck();
        },
      });
    this.subs.add(this.ssoAttemptSub);
  }

  /// Invoked by the manual "Sign in" button shown when multiple servers are
  /// configured, so the user explicitly confirms the currently-selected
  /// server before an SSO attempt is made against it.
  protected triggerSso(): void {
    if (this.serverStatus() !== 'reachable') return;
    const value = this.login_form.value.server;
    this.maybeAttemptSso(value, this.resolveServerEntry(value), {
      manual: true,
    });
  }

  ngAfterViewInit(): void {
    // The #usernameInput/#passwordInput @ViewChilds only exist in the DOM
    // when the manual form is rendered (i.e. SSO isn't configured for the
    // currently selected server). If SSO is already known to be configured
    // at the very first render - e.g. returning from /manage via logout,
    // where AppConfigService's cached BehaviorSubject emits synchronously
    // for the last-used (SSO) server before this view even renders - both
    // ViewChilds are undefined and focusing them would throw.
    if (this.ssoConfigured()) {
      return;
    }
    if (this.authO.localUsername) {
      this.passwordInput.nativeElement.focus();
    } else {
      this.usernameInput.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  protected serverUrlOf(entry: CobblerServerEntry): string {
    return serverUrl(entry);
  }

  protected reloadPage(): void {
    window.location.reload();
  }

  get server(): AbstractControl {
    return this.login_form.get('server');
  }

  get username(): AbstractControl {
    return this.login_form.get('username');
  }

  get password(): AbstractControl {
    return this.login_form.get('password');
  }

  Authorize(): void {
    if (this.login_form.controls.rememberUsername.value) {
      if (this.login_form.value.username) {
        this.authO.localUsername = this.login_form.value.username;
      }
    } else {
      this.authO.clearLocalUsername();
    }

    const formData = this.login_form.value;
    const user = formData.username;
    const pass = formData.password;
    this.authO.server = formData.server;
    this.cobblerApiService.reconfigureService(new URL(formData.server));

    this.subs.add(
      this.cobblerApiService.login(user, pass).subscribe({
        next: (data) => {
          this.authO.changeAuthorizedState(true);
          // sets username in session storage
          this.authO.username = user;
          this.authO.token = data;

          this.router.navigate(['/manage']);
        },
        error: () => {
          // Setting a plain field from an async XHR callback doesn't by itself re-render an
          // OnPush component — it must be explicitly marked for check.
          this.message =
            'Server, Username or Password did not Validate. Please try again.';
          this.changeDetectorRef.markForCheck();
        },
      }),
    );
  }

  updateErrServer() {
    if (this.login_form.controls['server'].hasError('required')) {
      this.errMsgServer.set('Server is required');
    } else if (this.login_form.controls['server'].hasError('pattern')) {
      this.errMsgServer.set('Server must be a valid URL.');
    } else {
      this.errMsgServer.set('');
    }
  }

  updateErrUser() {
    if (
      this.login_form.controls['username'].hasError('required') ||
      this.login_form.controls['username'].touched
    ) {
      this.errMsgUser.set('Username is required');
    } else if (this.login_form.controls['username'].hasError('minlength')) {
      this.errMsgUser.set(`Username must be minimum
        ${this.login_form.controls['username'].errors.minlength.requiredLength} characters.`);
    } else {
      this.errMsgUser.set('');
    }
  }

  updateErrPassword() {
    if (this.login_form.controls['password'].hasError('required')) {
      this.errMsgPassword.set('Password is required');
    } else {
      this.errMsgServer.set('');
    }
  }
}
