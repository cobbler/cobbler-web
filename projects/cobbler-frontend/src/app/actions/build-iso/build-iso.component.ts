import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackgroundBuildisoOptions, CobblerApiService } from 'cobbler-api';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'cobbler-build-iso',
  templateUrl: './build-iso.component.html',
  styleUrls: ['./build-iso.component.scss'],
  standalone: true,
  imports: [
    MatListModule,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatCheckbox,
  ],
})
export class BuildISOComponent {
  private readonly _formBuilder = inject(FormBuilder);
  buildisoFormGroup = this._formBuilder.group({
    iso: '',
    profiles: '',
    systems: '',
    buildisodir: '',
    distro: '',
    standalone: false,
    airgapped: false,
    source: '',
    excludeDNS: false,
    xorrisofsOpts: '',
  });

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
  ) {}

  runBuildiso(): void {
    const buildisoOptions: BackgroundBuildisoOptions = {
      iso: this.buildisoFormGroup.controls.iso.value,
      profiles: this.buildisoFormGroup.controls.profiles.value,
      systems: this.buildisoFormGroup.controls.systems.value,
      buildisodir: this.buildisoFormGroup.controls.buildisodir.value,
      distro: this.buildisoFormGroup.controls.distro.value,
      standalone: this.buildisoFormGroup.controls.standalone.value,
      airgapped: this.buildisoFormGroup.controls.airgapped.value,
      source: this.buildisoFormGroup.controls.source.value,
      excludeDNS: this.buildisoFormGroup.controls.excludeDNS.value,
      xorrisofsOpts: this.buildisoFormGroup.controls.xorrisofsOpts.value,
    };
    if (this.buildisoFormGroup.invalid) {
      this._snackBar.open('Please fill out all required inputs!', 'Close', {
        duration: 2000,
      });
      return;
    }
    this.cobblerApiService
      .background_buildiso(buildisoOptions, this.userService.token)
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
