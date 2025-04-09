import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
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
import Utils, { CobblerInputChoices, CobblerInputData } from '../../../utils';
import { DialogBoxItemRenderedComponent } from '../../../common/dialog-box-item-rendered/dialog-box-item-rendered.component';
import {
  cobblerItemEditableData,
  cobblerItemReadonlyData,
} from '../../metadata';

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
    ReactiveFormsModule,
    MultiSelectComponent,
    KeyValueEditorComponent,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  // Bring Enum to HTML scope
  protected readonly CobblerInputChoices = CobblerInputChoices;

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form data
  profileReadonlyInputData = cobblerItemReadonlyData;
  profileEditableInputData: Array<CobblerInputData> = [
    ...cobblerItemEditableData,
    {
      formControlName: 'redhat_management_key',
      inputType: CobblerInputChoices.TEXT,
      label: 'RedHat Management Key',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'autoinstall',
      inputType: CobblerInputChoices.TEXT,
      label: 'Autoinstallation Template',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'dhcp_tag',
      inputType: CobblerInputChoices.TEXT,
      label: 'DHCP Tag',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'distro',
      inputType: CobblerInputChoices.TEXT,
      label: 'Distro',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'menu',
      inputType: CobblerInputChoices.TEXT,
      label: 'Menu',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'next_server_v4',
      inputType: CobblerInputChoices.TEXT,
      label: 'Next Server IPv4',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'next_server_v6',
      inputType: CobblerInputChoices.TEXT,
      label: 'Next Server IPv6',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'filename',
      inputType: CobblerInputChoices.TEXT,
      label: 'DHCP Filename',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'parent',
      inputType: CobblerInputChoices.TEXT,
      label: 'Parent',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'proxy',
      inputType: CobblerInputChoices.TEXT,
      label: 'Proxy',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'server',
      inputType: CobblerInputChoices.TEXT,
      label: 'Server',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'boot_loaders',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'Boot Loaders',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
    },
    {
      formControlName: 'owners',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'Owners',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
    },
    {
      formControlName: 'autoinstall_meta',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: 'Automatic Installation Template Metadata',
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
    },
    {
      formControlName: 'boot_files',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: 'TFTP Boot Files',
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
    },
    {
      formControlName: 'fetchable_files',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: 'Fetchable Files',
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
    },
    {
      formControlName: 'kernel_options',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: 'Kernel Options',
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
    },
    {
      formControlName: 'kernel_options_post',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: 'Kernel Options (Post Install)',
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
    },
    {
      formControlName: 'mgmt_classes',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'Management Classes',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
    },
    {
      formControlName: 'mgmt_parameters',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: 'Management Parameters',
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
    },
    {
      formControlName: 'name_servers',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'Name Servers',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
    },
    {
      formControlName: 'name_servers_search',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'Name Servers Search',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
    },
    {
      formControlName: 'repos',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'Repositories',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
    },
    {
      formControlName: 'template_files',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: 'Template Files',
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
    },
  ];

  // Form
  name: string;
  profile: Profile;
  private readonly _formBuilder = inject(FormBuilder);
  profileReadonlyFormGroup = this._formBuilder.group({});
  profileFormGroup = this._formBuilder.group({});
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
    this.profileReadonlyInputData.forEach((value) => {
      this.profileReadonlyFormGroup.addControl(
        value.formControlName,
        new FormControl({
          value: value.defaultValue,
          disabled: value.disabled,
        }),
      );
      if (value.inherited) {
        this.profileReadonlyFormGroup.addControl(
          value.formControlName + '_inherited',
          new FormControl({
            value: false,
            disabled: value.disabled,
          }),
        );
      }
    });
    this.profileEditableInputData.forEach((value) => {
      this.profileFormGroup.addControl(
        value.formControlName,
        new FormControl({
          value: value.defaultValue,
          disabled: value.disabled,
        }),
      );
      if (value.inherited) {
        this.profileFormGroup.addControl(
          value.formControlName + '_inherited',
          new FormControl({
            value: false,
            disabled: value.disabled,
          }),
        );
      }
    });
  }

  ngOnInit(): void {
    this.refreshData();
    // Observables for inherited properties
    this.profileFormGroup
      .get('autoinstall_meta_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(
          this.profileFormGroup.get('autoinstall_meta'),
        ),
      );
    this.profileFormGroup
      .get('boot_files_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.profileFormGroup.get('boot_files')),
      );
    this.profileFormGroup
      .get('boot_loaders_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.profileFormGroup.get('boot_loaders')),
      );
    this.profileFormGroup
      .get('fetchable_files_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.profileFormGroup.get('fetchable_files')),
      );
    this.profileFormGroup
      .get('kernel_options_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.profileFormGroup.get('kernel_options')),
      );
    this.profileFormGroup
      .get('kernel_options_post_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(
          this.profileFormGroup.get('kernel_options_post'),
        ),
      );
    this.profileFormGroup
      .get('mgmt_classes_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.profileFormGroup.get('mgmt_classes')),
      );
    this.profileFormGroup
      .get('mgmt_parameters_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.profileFormGroup.get('mgmt_parameters')),
      );
    this.profileFormGroup
      .get('owners_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.profileFormGroup.get('owners')),
      );
    this.profileFormGroup
      .get('template_files_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.profileFormGroup.get('template_files')),
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getInheritObservable(
    valueControl: AbstractControl,
  ): (value: boolean) => void {
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
      .subscribe({
        next: (value) => {
          this.profile = value;
          this.profileReadonlyFormGroup.patchValue({
            name: this.profile.name,
            uid: this.profile.uid,
            mtime: Utils.floatToDate(this.profile.mtime).toString(),
            ctime: Utils.floatToDate(this.profile.ctime).toString(),
            depth: this.profile.depth,
            is_subobject: this.profile.is_subobject,
          });
          this.profileFormGroup.patchValue({
            comment: this.profile.comment,
            redhat_management_key: this.profile.redhat_management_key,
            autoinstall: this.profile.autoinstall,
            dhcp_tag: this.profile.dhcp_tag,
            distro: this.profile.distro,
            menu: this.profile.menu,
            next_server_v4: this.profile.next_server_v4,
            next_server_v6: this.profile.next_server_v6,
            filename: this.profile.filename,
            parent: this.profile.parent,
            proxy: this.profile.proxy,
            server: this.profile.server,
            name_servers: this.profile.name_servers,
            name_servers_search: this.profile.name_servers_search,
            repos: this.profile.repos,
          });
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.boot_loaders,
            'boot_loaders',
            [],
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.owners,
            'owners',
            [],
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.autoinstall_meta,
            'autoinstall_meta',
            new Map<string, any>(),
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.boot_files,
            'boot_files',
            new Map<string, any>(),
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.fetchable_files,
            'fetchable_files',
            new Map<string, any>(),
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.kernel_options,
            'kernel_options',
            new Map<string, any>(),
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.kernel_options_post,
            'kernel_options_post',
            new Map<string, any>(),
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.mgmt_classes,
            'mgmt_classes',
            [],
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.mgmt_parameters,
            'mgmt_parameters',
            new Map<string, any>(),
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.template_files,
            'template_files',
            new Map<string, any>(),
          );
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }

  removeProfile(): void {
    this.cobblerApiService
      .remove_profile(this.name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this.router.navigate(['/items', 'profile']);
          }
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            'Delete failed! Check server logs for more information.',
            'Close',
          );
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }

  editProfile(): void {
    this.isEditMode = true;
    this.profileFormGroup.enable();
    // Inherit inputs
    if (typeof this.profile.autoinstall_meta === 'string') {
      this.profileFormGroup.get('autoinstall_meta').disable();
    }
    if (typeof this.profile.boot_files === 'string') {
      this.profileFormGroup.get('boot_files').disable();
    }
    if (typeof this.profile.boot_loaders === 'string') {
      this.profileFormGroup.get('boot_loaders').disable();
    }
    if (typeof this.profile.fetchable_files === 'string') {
      this.profileFormGroup.get('fetchable_files').disable();
    }
    if (typeof this.profile.kernel_options === 'string') {
      this.profileFormGroup.get('kernel_options').disable();
    }
    if (typeof this.profile.kernel_options_post === 'string') {
      this.profileFormGroup.get('kernel_options_post').disable();
    }
    if (typeof this.profile.mgmt_classes === 'string') {
      this.profileFormGroup.get('mgmt_classes').disable();
    }
    if (typeof this.profile.mgmt_parameters === 'string') {
      this.profileFormGroup.get('mgmt_parameters').disable();
    }
    if (typeof this.profile.owners === 'string') {
      this.profileFormGroup.get('owners').disable();
    }
    if (typeof this.profile.template_files === 'string') {
      this.profileFormGroup.get('template_files').disable();
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
        this.dialog.open(DialogBoxItemRenderedComponent, {
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
                next: () => {
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
            next: () => {
              this.cobblerApiService
                .save_profile(profileHandle, this.userService.token)
                .subscribe({
                  next: () => {
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
