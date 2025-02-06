import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  concat,
  concatAll,
  concatMap,
  from,
  Observable,
} from 'rxjs';
import { retry } from 'rxjs/operators';

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
  private configUrlInternal = 'assets/configs/app-config.json';
  private configUrlExternal = '/app-config.json';

  public AppConfig: BehaviorSubject<AppConfig> = new BehaviorSubject<AppConfig>(
    EMPTY_CONFIG,
  );
  public AppConfig$: Observable<AppConfig> = this.AppConfig.asObservable();

  constructor(private http: HttpClient) {}

  loadConfig(): void {
    concat(
      this.retrieveConfigInternal(),
      this.retrieveConfigExternal(),
    ).subscribe({
      next: (res) => {
        this.AppConfig.next(res);
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
