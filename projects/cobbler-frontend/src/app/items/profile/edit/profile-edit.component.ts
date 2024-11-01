import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, Profile } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';

@Component({
  selector: 'cobbler-edit',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatTooltip,
    FormsModule,
    MatButton,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MultiSelectComponent,
    KeyValueEditorComponent,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  name: string;
  profile: Profile;
  private readonly _formBuilder = inject(FormBuilder);
  profileFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: true }),
    uid: new FormControl({ value: '', disabled: true }),
    mtime: new FormControl({ value: '', disabled: true }),
    ctime: new FormControl({ value: '', disabled: true }),
    depth: new FormControl({ value: 0, disabled: true }),
    is_subobject: new FormControl({ value: false, disabled: true }),
    comment: new FormControl({ value: '', disabled: true }),
    redhat_management_key: new FormControl({ value: '', disabled: true }),
    autoinstall: new FormControl({ value: '', disabled: true }),
    dhcp_tag: new FormControl({ value: '', disabled: true }),
    distro: new FormControl({ value: '', disabled: true }),
    menu: new FormControl({ value: '', disabled: true }),
    next_server_v4: new FormControl({ value: '', disabled: true }),
    next_server_v6: new FormControl({ value: '', disabled: true }),
    filename: new FormControl({ value: '', disabled: true }),
    parent: new FormControl({ value: '', disabled: true }),
    proxy: new FormControl({ value: '', disabled: true }),
    server: new FormControl({ value: '', disabled: true }),
    boot_loaders: new FormControl({ value: [], disabled: true }),
    bootloader_inherited: new FormControl({ value: false, disabled: true }),
    owners: new FormControl({ value: [], disabled: true }),
    owners_inherited: new FormControl({ value: false, disabled: true }),
    autoinstall_meta: new FormControl({ value: {}, disabled: true }),
    autoinstall_meta_inherited: new FormControl({
      value: false,
      disabled: true,
    }),
    boot_files: new FormControl({ value: {}, disabled: true }),
    boot_files_inherited: new FormControl({ value: false, disabled: true }),
    fetchable_files: new FormControl({ value: {}, disabled: true }),
    fetchable_files_inherited: new FormControl({
      value: false,
      disabled: true,
    }),
    kernel_options: new FormControl({ value: {}, disabled: true }),
    kernel_options_inherited: new FormControl({ value: false, disabled: true }),
    kernel_options_post: new FormControl({ value: {}, disabled: true }),
    kernel_options_post_inherited: new FormControl({
      value: false,
      disabled: true,
    }),
    mgmt_classes: new FormControl({ value: [], disabled: true }),
    mgmt_classes_inherited: new FormControl({ value: false, disabled: true }),
    mgmt_parameters: new FormControl({ value: {}, disabled: true }),
    mgmt_parameters_inherited: new FormControl({
      value: false,
      disabled: true,
    }),
    name_servers: new FormControl({ value: [], disabled: true }),
    name_servers_search: new FormControl({ value: [], disabled: true }),
    repos: new FormControl({ value: [], disabled: true }),
    template_files: new FormControl({ value: {}, disabled: true }),
    template_files_inherited: new FormControl({ value: false, disabled: true }),
  });
  isEditMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
    @Inject(MatDialog) readonly dialog: MatDialog,
  ) {
    this.name = this.route.snapshot.paramMap.get('name');
  }

  ngOnInit(): void {
    this.refreshData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  refreshData(): void {
    this.cobblerApiService
      .get_profile(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          this.profile = value;
          this.profileFormGroup.controls.name.setValue(this.profile.name);
          this.profileFormGroup.controls.uid.setValue(this.profile.uid);
          this.profileFormGroup.controls.mtime.setValue(
            new Date(this.profile.mtime * 1000).toString(),
          );
          this.profileFormGroup.controls.ctime.setValue(
            new Date(this.profile.ctime * 1000).toString(),
          );
          this.profileFormGroup.controls.depth.setValue(this.profile.depth);
          this.profileFormGroup.controls.is_subobject.setValue(
            this.profile.is_subobject,
          );
          this.profileFormGroup.controls.comment.setValue(this.profile.comment);
          this.profileFormGroup.controls.redhat_management_key.setValue(
            this.profile.redhat_management_key,
          );
          this.profileFormGroup.controls.autoinstall.setValue(
            this.profile.autoinstall,
          );
          this.profileFormGroup.controls.dhcp_tag.setValue(
            this.profile.dhcp_tag,
          );
          this.profileFormGroup.controls.distro.setValue(this.profile.distro);
          this.profileFormGroup.controls.menu.setValue(this.profile.menu);
          this.profileFormGroup.controls.next_server_v4.setValue(
            this.profile.next_server_v4,
          );
          this.profileFormGroup.controls.next_server_v6.setValue(
            this.profile.next_server_v6,
          );
          this.profileFormGroup.controls.filename.setValue(
            this.profile.filename,
          );
          this.profileFormGroup.controls.parent.setValue(this.profile.parent);
          this.profileFormGroup.controls.proxy.setValue(this.profile.proxy);
          this.profileFormGroup.controls.server.setValue(this.profile.server);
          this.profileFormGroup.controls.name_servers.setValue(
            this.profile.name_servers,
          );
          this.profileFormGroup.controls.name_servers_search.setValue(
            this.profile.name_servers_search,
          );
          this.profileFormGroup.controls.repos.setValue(this.profile.repos);
          if (typeof this.profile.boot_loaders === 'string') {
            this.profileFormGroup.controls.bootloader_inherited.setValue(true);
          } else {
            this.profileFormGroup.controls.bootloader_inherited.setValue(false);
            this.profileFormGroup.controls.boot_loaders.setValue(
              this.profile.boot_loaders,
            );
          }
          if (typeof this.profile.owners === 'string') {
            this.profileFormGroup.controls.owners_inherited.setValue(true);
          } else {
            this.profileFormGroup.controls.owners_inherited.setValue(false);
            this.profileFormGroup.controls.owners.setValue(this.profile.owners);
          }
          if (typeof this.profile.autoinstall_meta === 'string') {
            this.profileFormGroup.controls.autoinstall_meta_inherited.setValue(
              true,
            );
          } else {
            this.profileFormGroup.controls.autoinstall_meta_inherited.setValue(
              false,
            );
            this.profileFormGroup.controls.autoinstall_meta.setValue(
              this.profile.autoinstall_meta,
            );
          }
          if (typeof this.profile.boot_files === 'string') {
            this.profileFormGroup.controls.boot_files_inherited.setValue(true);
          } else {
            this.profileFormGroup.controls.boot_files_inherited.setValue(false);
            this.profileFormGroup.controls.boot_files.setValue(
              this.profile.boot_files,
            );
          }
          if (typeof this.profile.fetchable_files === 'string') {
            this.profileFormGroup.controls.fetchable_files_inherited.setValue(
              true,
            );
          } else {
            this.profileFormGroup.controls.fetchable_files_inherited.setValue(
              false,
            );
            this.profileFormGroup.controls.fetchable_files.setValue(
              this.profile.fetchable_files,
            );
          }
          if (typeof this.profile.kernel_options === 'string') {
            this.profileFormGroup.controls.kernel_options_inherited.setValue(
              true,
            );
          } else {
            this.profileFormGroup.controls.kernel_options_inherited.setValue(
              false,
            );
            this.profileFormGroup.controls.kernel_options.setValue(
              this.profile.kernel_options,
            );
          }
          if (typeof this.profile.kernel_options_post === 'string') {
            this.profileFormGroup.controls.kernel_options_post_inherited.setValue(
              true,
            );
          } else {
            this.profileFormGroup.controls.kernel_options_post_inherited.setValue(
              false,
            );
            this.profileFormGroup.controls.kernel_options_post.setValue(
              this.profile.kernel_options_post,
            );
          }
          if (typeof this.profile.mgmt_classes === 'string') {
            this.profileFormGroup.controls.mgmt_classes_inherited.setValue(
              true,
            );
          } else {
            this.profileFormGroup.controls.mgmt_classes_inherited.setValue(
              false,
            );
            this.profileFormGroup.controls.mgmt_classes.setValue(
              this.profile.mgmt_classes,
            );
          }
          if (typeof this.profile.mgmt_parameters === 'string') {
            this.profileFormGroup.controls.mgmt_parameters_inherited.setValue(
              true,
            );
          } else {
            this.profileFormGroup.controls.mgmt_parameters_inherited.setValue(
              false,
            );
            this.profileFormGroup.controls.mgmt_parameters.setValue(
              this.profile.mgmt_parameters,
            );
          }
          if (typeof this.profile.template_files === 'string') {
            this.profileFormGroup.controls.template_files_inherited.setValue(
              true,
            );
          } else {
            this.profileFormGroup.controls.template_files_inherited.setValue(
              false,
            );
            this.profileFormGroup.controls.template_files.setValue(
              this.profile.template_files,
            );
          }
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }

  removeProfile(): void {
    this.cobblerApiService
      .remove_profile(this.name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          if (value) {
            this.router.navigate(['/items', 'profile']);
          }
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            'Delete failed! Check server logs for more information.',
            'Close',
          );
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }

  editProfile(): void {
    // TODO
    this._snackBar.open('Not implemented at the moment!', 'Close');
  }

  copyProfile(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemCopyComponent, {
      data: {
        itemType: 'Profile',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the profile
        return;
      }
      this.cobblerApiService
        .get_profile_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (profileHandle) => {
            this.cobblerApiService
              .copy_profile(profileHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                (value) => {
                  this.router.navigate(['/items', 'profile', newItemName]);
                },
                (error) => {
                  // HTML encode the error message since it originates from XML
                  this._snackBar.open(Utils.toHTML(error.message), 'Close');
                },
              );
          },
          (error) => {
            // HTML encode the error message since it originates from XML
            this._snackBar.open(Utils.toHTML(error.message), 'Close');
          },
        );
    });
  }

  saveProfile(): void {
    // TODO
  }

  get profileOwners(): string[] {
    if (this.profile && this.profile.owners) {
      const ownersResult = this.profile.owners;
      if (typeof ownersResult !== 'string') {
        return ownersResult;
      }
    }
    return [];
  }

  get profileAutoinstallMeta(): object {
    if (this.profile && this.profile.autoinstall_meta) {
      const autoinstallMetaResult = this.profile.autoinstall_meta;
      if (typeof autoinstallMetaResult !== 'string') {
        return autoinstallMetaResult;
      }
    }
    return {};
  }

  get profileKernelOptions(): object {
    if (this.profile && this.profile.kernel_options) {
      const kernelOptionsResult = this.profile.kernel_options;
      if (typeof kernelOptionsResult !== 'string') {
        return kernelOptionsResult;
      }
    }
    return {};
  }

  get profileKernelOptionsPost(): object {
    if (this.profile && this.profile.kernel_options_post) {
      const kernelOptionsPost = this.profile.kernel_options_post;
      if (typeof kernelOptionsPost !== 'string') {
        return kernelOptionsPost;
      }
    }
    return {};
  }

  get profileBootFiles(): object {
    if (this.profile && this.profile.boot_files) {
      const bootFilesResult = this.profile.boot_files;
      if (typeof bootFilesResult !== 'string') {
        return bootFilesResult;
      }
    }
    return {};
  }

  get profileFetchableFiles(): object {
    if (this.profile && this.profile.fetchable_files) {
      const fetchableFilesResult = this.profile.fetchable_files;
      if (typeof fetchableFilesResult !== 'string') {
        return fetchableFilesResult;
      }
    }
    return {};
  }

  get profileMgmtParameters(): object {
    if (this.profile && this.profile.mgmt_parameters) {
      const mgmtParametersResult = this.profile.mgmt_parameters;
      if (typeof mgmtParametersResult !== 'string') {
        return mgmtParametersResult;
      }
    }
    return {};
  }

  get profileTemplateFiles(): object {
    if (this.profile && this.profile.template_files) {
      const templateFilesResult = this.profile.template_files;
      if (typeof templateFilesResult !== 'string') {
        return templateFilesResult;
      }
    }
    return {};
  }
}
