import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';

export interface AppConfig {
  cobblerUrls: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private configUrl = 'assets/configs/app-config.json';
  private config: AppConfig = undefined;
  private errorMsg: String = undefined;

  constructor(private http: HttpClient) { }

  loadConfig(): Promise<any> {
    // Need to subscribe but APP_INITIALIZE does not take type: subscription;
    // use Promise instead
    return this.makeConfigCall().toPromise().then(
      res => {
        this.config = res;
      },
      err => {
        this.errorMsg = "Something bad happened loading App Configuration; please try again later.";
      });
  }

  makeConfigCall() {
    return this.http.get<AppConfig>(this.configUrl)
              .pipe(
                retry(2) // retry a failed request up to 3 times
              );
  }
  
  async reloadAppConfig() {
    return await this.loadConfig();
  }

  getAppConfig(): AppConfig {
    return this.config;
  }

  getAppConfigError(): String {
    return this.errorMsg;
  }
}
