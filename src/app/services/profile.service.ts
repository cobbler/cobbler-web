import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  // FIXME move to common area. e.g. settingsService
  apiURL = "http://localhost:4200/cobbler";

  constructor(private httpClient: HttpClient) { }

  getProfiles(): Observable<any> {
    return this.httpClient.get(`${this.apiURL}/profiles`);
  }
}
