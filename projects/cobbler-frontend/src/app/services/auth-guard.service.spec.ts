import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthGuardService } from './auth-guard.service';
import { UserService } from './user.service';

describe('AuthGuardService', () => {
  let service: AuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), UserService],
    });
    service = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
