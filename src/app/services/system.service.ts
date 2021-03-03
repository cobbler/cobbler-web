import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../services/settings.service';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(private logger: LogService, private httpClient: HttpClient) { }

  getSystems(): Observable<any> {
    return this.httpClient.get(`${SettingsService.settings.cobblerApiURL}/systems`);
  }
}
