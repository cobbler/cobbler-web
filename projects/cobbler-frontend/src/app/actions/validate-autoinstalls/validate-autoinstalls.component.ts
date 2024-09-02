import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CobblerApiService } from 'cobbler-api';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'cobbler-validate-autoinstalls',
  standalone: true,
  imports: [MatButton],
  templateUrl: './validate-autoinstalls.component.html',
  styleUrl: './validate-autoinstalls.component.scss',
})
export class ValidateAutoinstallsComponent {
  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
  ) {}

  runValidateAutoinstalls(): void {
    this.cobblerApiService
      .background_validate_autoinstall_files(this.userService.token)
      .subscribe(
        (value) => {
          // TODO
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(this.toHTML(error.message), 'Close');
        },
      );
  }

  toHTML(input: string): any {
    // FIXME: Deduplicate method
    return new DOMParser().parseFromString(input, 'text/html').documentElement
      .textContent;
  }
}
