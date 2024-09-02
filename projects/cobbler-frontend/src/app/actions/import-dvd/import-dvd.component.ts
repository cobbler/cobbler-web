import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CobblerApiService, BackgroundImportOptions } from 'cobbler-api';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'cobbler-import-dvd',
  templateUrl: './import-dvd.component.html',
  styleUrls: ['./import-dvd.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
  ],
})
export class ImportDVDComponent {
  private readonly _formBuilder = inject(FormBuilder);
  importFormGroup = this._formBuilder.group({
    path: '',
    name: '',
    available_as: '',
    autoinstall_file: '',
    rsync_flags: '',
    arch: '',
    breed: '',
    os_version: '',
  });

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
  ) {}

  runImport(): void {
    const importOptions: BackgroundImportOptions = {
      path: this.importFormGroup.controls.path.value,
      name: this.importFormGroup.controls.name.value,
      available_as: this.importFormGroup.controls.available_as.value,
      autoinstall_file: this.importFormGroup.controls.autoinstall_file.value,
      rsync_flags: this.importFormGroup.controls.rsync_flags.value,
      arch: this.importFormGroup.controls.arch.value,
      breed: this.importFormGroup.controls.breed.value,
      os_version: this.importFormGroup.controls.os_version.value,
    };
    if (this.importFormGroup.invalid) {
      this._snackBar.open('Please give all inputs a system name!', 'Close', {
        duration: 2000,
      });
      return;
    }
    this.cobblerApiService
      .background_import(importOptions, this.userService.token)
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
