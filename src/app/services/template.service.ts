import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  // FIXME move to common area. e.g. settingsService
  apiURL = "http://localhost:4200/cobbler";

  constructor(private httpClient: HttpClient) { }

  getTemplates(): Observable<any> {
    return this.httpClient.get(`${this.apiURL}/templates`);
  }
}
