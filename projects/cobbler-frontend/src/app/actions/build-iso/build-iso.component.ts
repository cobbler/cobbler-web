import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackgroundBuildisoOptions, CobblerApiService } from 'cobbler-api';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import Utils from '../../utils';
import {
  ItemReferenceComponent,
  ItemReferenceOption,
} from 'projects/cobbler-frontend/src/app/common/item-reference/item-reference.component';
import {
  MultiSelectStrictComponent,
  MultiSelectStrictOption,
} from 'projects/cobbler-frontend/src/app/common/multi-select-strict/multi-select-strict.component';

@Component({
  selector: 'cobbler-build-iso',
  templateUrl: './build-iso.component.html',
  styleUrls: ['./build-iso.component.scss'],
  imports: [
    MatListModule,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatCheckbox,
    ItemReferenceComponent,
    MultiSelectStrictComponent,
  ],
})
export class BuildISOComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  buildisoFormGroup = this._formBuilder.group({
    iso: '',
    profiles: this._formBuilder.control<string[]>([]),
    systems: this._formBuilder.control<string[]>([]),
    buildisodir: '',
    distro: '',
    standalone: true,
    airgapped: false,
    source: '',
    excludeDNS: false,
    xorrisofsOpts: '',
  });

  distroOptions: Array<ItemReferenceOption> = [];
  profileOptions: Array<MultiSelectStrictOption> = [];
  systemOptions: Array<MultiSelectStrictOption> = [];

  ngOnInit(): void {
    forkJoin({
      distros: this.cobblerApiService.get_distros(),
      profiles: this.cobblerApiService.get_profiles(),
      systems: this.cobblerApiService.get_systems(),
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(({ distros, profiles, systems }) => {
        this.distroOptions = distros.map((distro) => ({
          value: distro.uid,
          label: distro.name,
        }));
        this.profileOptions = profiles.map((profile) => ({
          value: profile.uid,
          label: profile.name,
        }));
        this.systemOptions = systems.map((system) => ({
          value: system.uid,
          label: system.name,
        }));
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

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
      this._snackBar.open(
        $localize`:@@validation.required-inputs:Please fill out all required inputs!`,
        $localize`:@@snackbar.action.close:Close`,
        { duration: 2000 },
      );
      return;
    }
    this.cobblerApiService
      .background_buildiso(buildisoOptions, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          // TODO
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      );
  }
}
