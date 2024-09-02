import { Injectable } from '@angular/core';
import { CobblerApiService } from 'cobbler-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Settings } from 'cobbler-api';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ItemSettingsService {
  constructor(
    public authO: UserService,
    private cobblerApiService: CobblerApiService,
  ) {
    // Nothing to see here
  }

  getAll(): Observable<Settings> {
    return this.cobblerApiService.get_settings(this.authO.token);
  }

  getitem(name: string): Observable<any> {
    return this.cobblerApiService.get_settings(this.authO.token).pipe(
      map<Settings, any>((data: Settings) => {
        if (name in data) {
          return data[name];
        }
        throw new Error('Requested name not found in the settings!');
      }),
    );
  }
}
