import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../services/settings.service';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private logger: LogService, private httpClient: HttpClient) { }

  getProfiles(): Observable<any> {
    return this.httpClient.get(`${SettingsService.settings.cobblerApiURL}/profiles`);
  }
}
