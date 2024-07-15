import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CobblerApiService} from 'cobbler-api';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'cobbler-hardlink',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './hardlink.component.html',
  styleUrl: './hardlink.component.scss'
})
export class HardlinkComponent {

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar
  ) {
  }

  runHardlink(): void {
    this.cobblerApiService.background_hardlink(this.userService.token).subscribe(
      value => {
        // TODO
      },
      error => {
        // HTML encode the error message since it originates from XML
        this._snackBar.open(this.toHTML(error.message), 'Close');
      });
  }

  toHTML(input: string): any {
    // FIXME: Deduplicate method
    return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent;
  }

}
