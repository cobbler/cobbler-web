import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, Package } from 'cobbler-api';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'cobbler-edit',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCheckbox,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatTooltip,
    ReactiveFormsModule,
    MultiSelectComponent,
  ],
  templateUrl: './package-edit.component.html',
  styleUrl: './package-edit.component.scss',
})
export class PackageEditComponent implements OnInit {
  name: string;
  package: Package;
  private readonly _formBuilder = inject(FormBuilder);
  packageFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: true }),
    uid: new FormControl({ value: '', disabled: true }),
    mtime: new FormControl({ value: '', disabled: true }),
    ctime: new FormControl({ value: '', disabled: true }),
    depth: new FormControl({ value: 0, disabled: true }),
    is_subobject: new FormControl({ value: false, disabled: true }),
    comment: new FormControl({ value: '', disabled: true }),
    redhat_management_key: new FormControl({ value: '', disabled: true }),
    mode: new FormControl({ value: '', disabled: true }),
    owner: new FormControl({ value: '', disabled: true }),
    group: new FormControl({ value: '', disabled: true }),
    path: new FormControl({ value: '', disabled: true }),
    template: new FormControl({ value: '', disabled: true }),
    action: new FormControl({ value: '', disabled: true }),
    installer: new FormControl({ value: '', disabled: true }),
    version: new FormControl({ value: '', disabled: true }),
    owners: new FormControl({ value: [], disabled: true }),
    owners_inherited: new FormControl({ value: false, disabled: true }),
  });
  isEditMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.name = this.route.snapshot.paramMap.get('name');
  }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.cobblerApiService
      .get_package(this.name, false, false, this.userService.token)
      .subscribe(
        (value) => {
          this.package = value;
          this.packageFormGroup.controls.name.setValue(this.package.name);
          this.packageFormGroup.controls.uid.setValue(this.package.uid);
          this.packageFormGroup.controls.mtime.setValue(
            new Date(this.package.mtime * 1000).toString(),
          );
          this.packageFormGroup.controls.ctime.setValue(
            new Date(this.package.ctime * 1000).toString(),
          );
          this.packageFormGroup.controls.depth.setValue(this.package.depth);
          this.packageFormGroup.controls.is_subobject.setValue(
            this.package.is_subobject,
          );
          this.packageFormGroup.controls.comment.setValue(this.package.comment);
          this.packageFormGroup.controls.mode.setValue(this.package.mode);
          this.packageFormGroup.controls.owner.setValue(this.package.owner);
          this.packageFormGroup.controls.group.setValue(this.package.group);
          this.packageFormGroup.controls.path.setValue(this.package.path);
          this.packageFormGroup.controls.template.setValue(
            this.package.template,
          );
          this.packageFormGroup.controls.action.setValue(this.package.action);
          this.packageFormGroup.controls.installer.setValue(
            this.package.installer,
          );
          this.packageFormGroup.controls.version.setValue(this.package.version);
          if (typeof this.package.owners === 'string') {
            this.packageFormGroup.controls.owners_inherited.setValue(true);
          } else {
            this.packageFormGroup.controls.owners_inherited.setValue(false);
            this.packageFormGroup.controls.owners.setValue(this.package.owners);
          }
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(this.toHTML(error.message), 'Close');
        },
      );
  }

  removePackage(): void {
    this.cobblerApiService
      .remove_package(this.name, this.userService.token, false)
      .subscribe(
        (value) => {
          if (value) {
            this.router.navigate(['/items', 'package']);
          }
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            'Delete failed! Check server logs for more information.',
            'Close',
          );
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(this.toHTML(error.message), 'Close');
        },
      );
  }

  editPackage(): void {
    // TODO
    this._snackBar.open('Not implemented at the moment!', 'Close');
  }

  copyPackage(): void {
    this.cobblerApiService
      .copy_package('', '', this.userService.token)
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

  savePackage(): void {
    // TODO
  }

  get packageOwners(): string[] {
    if (this.package && this.package.owners) {
      const ownersResult = this.package.owners;
      if (typeof ownersResult !== 'string') {
        return ownersResult;
      }
    }
    return [];
  }

  toHTML(input: string): any {
    // FIXME: Deduplicate method
    return new DOMParser().parseFromString(input, 'text/html').documentElement
      .textContent;
  }
}
