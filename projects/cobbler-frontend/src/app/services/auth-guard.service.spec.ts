import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuardService } from './auth-guard.service';
import { AuthenticationComponent } from '../authentication/authentication.component';

describe('AuthGuardService', () => {
  let service: AuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthenticationComponent]
    });
    service = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
