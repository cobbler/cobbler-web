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
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, Profile } from 'cobbler-api';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';
import { DialogBoxItemRenderedComponent } from '../../../common/dialog-box-item-rendered/dialog-box-item-rendered.component';

@Component({
  selector: 'cobbler-edit',
  standalone: true,
  imports: [
    MatIconButton,
    MatTooltip,
    FormsModule,
    MatButton,
    MatIconModule,
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
  profileReadonlyFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: false }),
    uid: new FormControl({ value: '', disabled: false }),
    mtime: new FormControl({ value: '', disabled: false }),
    ctime: new FormControl({ value: '', disabled: false }),
    depth: new FormControl({ value: 0, disabled: false }),
    is_subobject: new FormControl({ value: false, disabled: false }),
  });
  profileFormGroup = this._formBuilder.group({
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
    boot_loaders_inherited: new FormControl({ value: false, disabled: true }),
    owners: new FormControl({ value: [], disabled: true }),
    owners_inherited: new FormControl({ value: false, disabled: true }),
    autoinstall_meta: new FormControl({ value: new Map(), disabled: true }),
    autoinstall_meta_inherited: new FormControl({
      value: false,
      disabled: true,
    }),
    boot_files: new FormControl({ value: new Map(), disabled: true }),
    boot_files_inherited: new FormControl({ value: false, disabled: true }),
    fetchable_files: new FormControl({ value: new Map(), disabled: true }),
    fetchable_files_inherited: new FormControl({
      value: false,
      disabled: true,
    }),
    kernel_options: new FormControl({ value: new Map(), disabled: true }),
    kernel_options_inherited: new FormControl({ value: false, disabled: true }),
    kernel_options_post: new FormControl({ value: new Map(), disabled: true }),
    kernel_options_post_inherited: new FormControl({
      value: false,
      disabled: true,
    }),
    mgmt_classes: new FormControl({ value: [], disabled: true }),
    mgmt_classes_inherited: new FormControl({ value: false, disabled: true }),
    mgmt_parameters: new FormControl({ value: new Map(), disabled: true }),
    mgmt_parameters_inherited: new FormControl({
      value: false,
      disabled: true,
    }),
    name_servers: new FormControl({ value: [], disabled: true }),
    name_servers_search: new FormControl({ value: [], disabled: true }),
    repos: new FormControl({ value: [], disabled: true }),
    template_files: new FormControl({ value: new Map(), disabled: true }),
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
    // Observables for inherited properties
    this.profileFormGroup.controls.autoinstall_meta_inherited.valueChanges.subscribe(
      this.getInheritObservable(
        this.profileFormGroup.controls.autoinstall_meta,
      ),
    );
    this.profileFormGroup.controls.boot_files_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.profileFormGroup.controls.boot_files),
    );
    this.profileFormGroup.controls.boot_loaders_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.profileFormGroup.controls.boot_loaders),
    );
    this.profileFormGroup.controls.fetchable_files_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.profileFormGroup.controls.fetchable_files),
    );
    this.profileFormGroup.controls.kernel_options_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.profileFormGroup.controls.kernel_options),
    );
    this.profileFormGroup.controls.kernel_options_post_inherited.valueChanges.subscribe(
      this.getInheritObservable(
        this.profileFormGroup.controls.kernel_options_post,
      ),
    );
    this.profileFormGroup.controls.mgmt_classes_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.profileFormGroup.controls.mgmt_classes),
    );
    this.profileFormGroup.controls.mgmt_parameters_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.profileFormGroup.controls.mgmt_parameters),
    );
    this.profileFormGroup.controls.owners_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.profileFormGroup.controls.owners),
    );
    this.profileFormGroup.controls.template_files_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.profileFormGroup.controls.template_files),
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getInheritObservable(valueControl: FormControl): (value: boolean) => void {
    return (value: boolean): void => {
      if (!this.isEditMode) {
        // If we are not in edit-mode we want to discard processing the event
        return;
      }
      if (value) {
        valueControl.disable();
      } else {
        valueControl.enable();
      }
    };
  }

  goToAutoinstall() {
    this.router.navigate(['/items', 'profile', this.name, 'autoinstall']);
  }

  refreshData(): void {
    this.cobblerApiService
      .get_profile(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          this.profile = value;
          this.profileReadonlyFormGroup.controls.name.setValue(
            this.profile.name,
          );
          this.profileReadonlyFormGroup.controls.uid.setValue(this.profile.uid);
          this.profileReadonlyFormGroup.controls.mtime.setValue(
            new Date(this.profile.mtime * 1000).toString(),
          );
          this.profileReadonlyFormGroup.controls.ctime.setValue(
            new Date(this.profile.ctime * 1000).toString(),
          );
          this.profileReadonlyFormGroup.controls.depth.setValue(
            this.profile.depth,
          );
          this.profileReadonlyFormGroup.controls.is_subobject.setValue(
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
            this.profileFormGroup.controls.boot_loaders_inherited.setValue(
              true,
            );
          } else {
            this.profileFormGroup.controls.boot_loaders_inherited.setValue(
              false,
            );
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
    this.isEditMode = true;
    this.profileFormGroup.enable();
    // Inherit inputs
    if (typeof this.profile.autoinstall_meta === 'string') {
      this.profileFormGroup.controls.autoinstall_meta.disable();
    }
    if (typeof this.profile.boot_files === 'string') {
      this.profileFormGroup.controls.boot_files.disable();
    }
    if (typeof this.profile.boot_loaders === 'string') {
      this.profileFormGroup.controls.boot_loaders.disable();
    }
    if (typeof this.profile.fetchable_files === 'string') {
      this.profileFormGroup.controls.fetchable_files.disable();
    }
    if (typeof this.profile.kernel_options === 'string') {
      this.profileFormGroup.controls.kernel_options.disable();
    }
    if (typeof this.profile.kernel_options_post === 'string') {
      this.profileFormGroup.controls.kernel_options_post.disable();
    }
    if (typeof this.profile.mgmt_classes === 'string') {
      this.profileFormGroup.controls.mgmt_classes.disable();
    }
    if (typeof this.profile.mgmt_parameters === 'string') {
      this.profileFormGroup.controls.mgmt_parameters.disable();
    }
    if (typeof this.profile.owners === 'string') {
      this.profileFormGroup.controls.owners.disable();
    }
    if (typeof this.profile.template_files === 'string') {
      this.profileFormGroup.controls.template_files.disable();
    }
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmCancelEditComponent, {
      data: {
        name: this.profile.name,
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === false) {
        // False means the user want's to continue
        return;
      }
      this.isEditMode = false;
      this.profileFormGroup.disable();
      this.refreshData();
    });
  }

  showAsRendered(): void {
    this.cobblerApiService
      .get_profile_as_rendered(this.profile.name, this.userService.token)
      .subscribe((value) => {
        const dialogRef = this.dialog.open(DialogBoxItemRenderedComponent, {
          data: {
            itemType: 'Profile',
            uid: this.profile.uid,
            name: this.profile.name,
            renderedData: value,
          },
        });
      });
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
        .subscribe({
          next: (profileHandle) => {
            this.cobblerApiService
              .copy_profile(profileHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (value) => {
                  this.router.navigate(['/items', 'profile', newItemName]);
                },
                error: (error) => {
                  // HTML encode the error message since it originates from XML
                  this._snackBar.open(Utils.toHTML(error.message), 'Close');
                },
              });
          },
          error: (error) => {
            // HTML encode the error message since it originates from XML
            this._snackBar.open(Utils.toHTML(error.message), 'Close');
          },
        });
    });
  }

  saveProfile(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.profileFormGroup,
      Utils.getDirtyValues(this.profileFormGroup),
    );
    this.cobblerApiService
      .get_profile_handle(this.name, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (profileHandle) => {
          let modifyObservables: Observable<boolean>[] = [];
          dirtyValues.forEach((value, key) => {
            modifyObservables.push(
              this.cobblerApiService.modify_profile(
                profileHandle,
                key,
                value,
                this.userService.token,
              ),
            );
          });
          combineLatest(modifyObservables).subscribe({
            next: (value) => {
              this.cobblerApiService
                .save_profile(profileHandle, this.userService.token)
                .subscribe({
                  next: (value1) => {
                    this.isEditMode = false;
                    this.profileFormGroup.disable();
                    this.refreshData();
                  },
                  error: (error) => {
                    this._snackBar.open(Utils.toHTML(error.message), 'Close');
                  },
                });
            },
            error: (error) => {
              this._snackBar.open(Utils.toHTML(error.message), 'Close');
            },
          });
        },
        error: (error) => {
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }
}
