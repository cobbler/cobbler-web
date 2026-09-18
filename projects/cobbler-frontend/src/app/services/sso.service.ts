import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface SsoLoginResponse {
  username: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class SsoService {
  private http = inject(HttpClient);

  attemptSso(ssoLoginUrl: string): Observable<SsoLoginResponse> {
    return this.http.get<SsoLoginResponse>(ssoLoginUrl, {
      withCredentials: true,
    });
  }
}
