import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from '../services/settings.service';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class RepoService {

  constructor(private logger: LogService, private httpClient: HttpClient) { }

  getRepos(): Observable<any> {
    return this.httpClient.get(`${SettingsService.settings.cobblerApiURL}/repos`);
  }
}
