import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  concat,
  concatAll,
  concatMap,
  from,
  merge,
  Observable,
  forkJoin,
  catchError,
  of,
} from 'rxjs';
import { retry } from 'rxjs/operators';
import { UserService } from './user.service';

export interface AppConfig {
  cobblerUrls: string[];
}

const EMPTY_CONFIG: AppConfig = {
  cobblerUrls: [],
};

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private http = inject(HttpClient);

  private configUrlInternal = 'assets/configs/app-config.json';

  /// The mounted app-config.json lives one level above the active locale's
  /// base href (e.g. "/cobbler_web/app-config.json" when the base href is
  /// "/cobbler_web/en-US/"), so the URL must be derived at request time
  /// rather than hardcoded as root-relative.
  private get configUrlExternal(): string {
    const appRoot = new URL('..', document.baseURI);
    return new URL('app-config.json', appRoot).toString();
  }

  public AppConfig: BehaviorSubject<AppConfig> = new BehaviorSubject<AppConfig>(
    EMPTY_CONFIG,
  );
  public AppConfig$: Observable<AppConfig> = this.AppConfig.asObservable();

  /// Loads both the external and internal configuration and publishes the last successful AppConfig.
  loadConfig(): void {
    forkJoin([
      this.retrieveConfigInternal().pipe(catchError(() => of(EMPTY_CONFIG))),
      this.retrieveConfigExternal().pipe(catchError(() => of(EMPTY_CONFIG))),
    ]).subscribe({
      next: ([internal, external]) => {
        const final = external.cobblerUrls.length > 0 ? external : internal;
        this.AppConfig.next(final);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          console.info("Couldn't load config at " + err.url);
        }
      },
    });
  }

  retrieveConfigInternal() {
    return this.http.get<AppConfig>(this.configUrlInternal).pipe(
      retry(2), // retry a failed request up to 3 times
    );
  }

  retrieveConfigExternal(): Observable<AppConfig> {
    return this.http.get<AppConfig>(this.configUrlExternal);
  }
}
