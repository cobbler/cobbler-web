import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LogService } from './log.service';

export interface ISettingsConfig {
  cobblerApiURL: string
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  static settings: ISettingsConfig;

  constructor(private logger: LogService, private http: HttpClient) { }

  loadAppConfig() {
    // FIXME try loading settings indexdb, localstorage or other means first
    const jsonFile = 'assets/cobblerweb_settings.json';
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then( response => {
        SettingsService.settings = <ISettingsConfig>response;
        this.logger.debug("Loaded cobblerweb_settings");
        resolve();
      }).catch((response: any) => {
        this.logger.fatal("Failed to load cobblerweb_settings");
        reject(`Failed to load cobblerweb_settings`);
      });
    });
  }

  saveSettings(settings: any): boolean {
    // FIXME - save user settings
    // Global changes should be done by modifying the settings file directly.
    return true;
  }
}
