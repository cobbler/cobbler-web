import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
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
import { switchMap, takeUntil, map } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from 'projects/cobbler-frontend/src/app/common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from 'projects/cobbler-frontend/src/app/common/dialog-item-copy/dialog-item-copy.component';
import { KeyValueEditorComponent } from 'projects/cobbler-frontend/src/app/common/key-value-editor/key-value-editor.component';
import { MultiSelectComponent } from 'projects/cobbler-frontend/src/app/common/multi-select/multi-select.component';
import { UserService } from 'projects/cobbler-frontend/src/app/services/user.service';
import Utils, {
  CobblerInputChoices,
  CobblerInputData,
} from '../../../../utils';
import { DialogBoxItemRenderedComponent } from '../../../../common/dialog-box-item-rendered/dialog-box-item-rendered.component';
import {
  cobblerItemEditableData,
  cobblerItemReadonlyData,
} from '../../../metadata';
import { MultiSelectStrictComponent } from 'projects/cobbler-frontend/src/app/common/multi-select-strict/multi-select-strict.component';
import { HelpButtonComponent } from '../../../../common/help-button/help-button.component';

@Component({
  selector: 'cobbler-profile-edit',
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
    MultiSelectStrictComponent,
    HelpButtonComponent,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  readonly dialog = inject<MatDialog>(MatDialog);

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
      label: $localize`:@@profile.edit.label.redhat_management_key:RedHat Management Key`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.redhat_management_key:Registration key for Red Hat management systems (Spacewalk, Uyuni, SUSE Manager). Supports <<inherit>>.`,
    },
    {
      formControlName: 'autoinstall',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.autoinstall:Autoinstallation Template`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.autoinstall:Path to the automatic installation template file on the Cobbler server (e.g. /var/lib/cobbler/templates/default.ks).`,
    },
    {
      formControlName: 'dhcp_tag',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.dhcp_tag:DHCP Tag`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.dhcp_tag:VLAN tag identifying the DHCP network segment this profile's systems are provisioned from.`,
    },
    {
      formControlName: 'distro',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.distro:Distro`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.distro:Name of the parent distro. Required unless this is a sub-profile.`,
    },
    {
      formControlName: 'menu',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.menu:Menu`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.menu:Name of the boot menu this profile will appear in.`,
    },
    {
      formControlName: 'next_server_v4',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.next_server_v4:Next Server IPv4`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.next_server_v4:IPv4 address of the TFTP/next-boot server. Overrides the global setting for this profile.`,
    },
    {
      formControlName: 'next_server_v6',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.next_server_v6:Next Server IPv6`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.next_server_v6:IPv6 address of the TFTP/next-boot server. Overrides the global setting for this profile.`,
    },
    {
      formControlName: 'filename',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.filename:DHCP Filename`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.filename:Filename fetched from the TFTP server by the client bootloader.`,
    },
    {
      formControlName: 'parent',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.parent:Parent`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.parent:Name of the parent profile for sub-profile inheritance.`,
    },
    {
      formControlName: 'proxy',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.proxy:Proxy`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.proxy:HTTP proxy URL used during package installation. Overrides the global proxy setting.`,
    },
    {
      formControlName: 'server',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.server:Server`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.server:Hostname or IP of the Cobbler server as reachable by clients on this network. Overrides the global server setting.`,
    },
    {
      formControlName: 'boot_loaders',
      inputType: CobblerInputChoices.MULTI_SELECT_STRICT_DROPDOWN,
      label: $localize`:@@profile.edit.label.boot_loaders:Boot Loaders`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
      options: [],
      hint: $localize`:@@profile.edit.hint.boot_loaders:Bootloaders for which Cobbler generates PXE/GRUB boot entries. Supports <<inherit>>.`,
    },
    {
      formControlName: 'owners',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@profile.edit.label.owners:Owners`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
      hint: $localize`:@@profile.edit.hint.owners:Cobbler user accounts allowed to manage this item. Cosmetic only — not validated against real users. Supports <<inherit>>.`,
    },
    {
      formControlName: 'autoinstall_meta',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@profile.edit.label.autoinstall_meta:Automatic Installation Template Metadata`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
      hint: $localize`:@@profile.edit.hint.autoinstall_meta:Key=value pairs substituted into the automatic installation template as variables before rendering. Supports <<inherit>>.`,
    },
    {
      formControlName: 'boot_files',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@profile.edit.label.boot_files:TFTP Boot Files`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
      hint: $localize`:@@profile.edit.hint.boot_files:Extra files to copy into tftpboot in addition to the kernel and initrd. Supports <<inherit>>.`,
    },
    {
      formControlName: 'fetchable_files',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@profile.edit.label.fetchable_files:Fetchable Files`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
      hint: $localize`:@@profile.edit.hint.fetchable_files:Files clients can fetch via TFTP or HTTP, specified as "name=path" pairs. Supports <<inherit>>.`,
    },
    {
      formControlName: 'kernel_options',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@profile.edit.label.kernel_options:Kernel Options`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
      hint: $localize`:@@profile.edit.hint.kernel_options:Space-delimited key=value pairs appended to the kernel command line during installation, e.g. "a=b c=d". Supports <<inherit>>.`,
    },
    {
      formControlName: 'kernel_options_post',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@profile.edit.label.kernel_options_post:Kernel Options (Post Install)`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
      hint: $localize`:@@profile.edit.hint.kernel_options_post:Space-delimited key=value pairs appended to the kernel command line after installation completes. Supports <<inherit>>.`,
    },
    {
      formControlName: 'name_servers',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@profile.edit.label.name_servers:Name Servers`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      hint: $localize`:@@profile.edit.hint.name_servers:DNS name server addresses configured on provisioned systems.`,
    },
    {
      formControlName: 'name_servers_search',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@profile.edit.label.name_servers_search:Name Servers Search`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      hint: $localize`:@@profile.edit.hint.name_servers_search:DNS search domains configured on provisioned systems.`,
    },
    {
      formControlName: 'repos',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@profile.edit.label.repos:Repositories`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      hint: $localize`:@@profile.edit.hint.repos:Yum/APT repositories configured on systems after provisioning completes.`,
    },
    {
      formControlName: 'template_files',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@profile.edit.label.template_files:Template Files`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
      hint: $localize`:@@profile.edit.hint.template_files:Source=destination file mappings for built-in configuration management.`,
    },
  ];

  // Form
  name: string;
  profile: Profile;
  private readonly _formBuilder = inject(FormBuilder);
  profileReadonlyFormGroup = this._formBuilder.group({});
  profileFormGroup = this._formBuilder.group({});
  isEditMode: boolean = false;

  constructor() {
    this.name = this.route.snapshot.paramMap.get('name');
    Utils.fillupItemFormGroup(
      this.profileReadonlyFormGroup,
      this.profileFormGroup,
      this.profileReadonlyInputData,
      this.profileEditableInputData,
    );
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
    this.router.navigate([
      '/manage',
      'items',
      'profile',
      this.name,
      'autoinstall',
    ]);
  }

  refreshData(): void {
    this.cobblerApiService
      .get_profile(this.name, false, false, this.userService.token)
      .pipe(
        switchMap((profile) => {
          return this.cobblerApiService
            .get_valid_profile_bootloaders(profile.name, this.userService.token)
            .pipe(map((bootloaders) => ({ profile, bootloaders })));
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: ({ profile, bootloaders }) => {
          this.profile = profile;
          const bootloadersInput = this.profileEditableInputData.find(
            (p) => p.formControlName === 'boot_loaders',
          );
          if (bootloadersInput) {
            bootloadersInput.options = bootloaders;
          }
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
            bootloaders,
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
            this.profile.template_files,
            'template_files',
            new Map<string, any>(),
          );
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
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
            $localize`:@@error.delete-failed:Delete failed! Check server logs for more information.`,
            $localize`:@@snackbar.action.close:Close`,
          );
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
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
                  this.router.navigate([
                    '/manage',
                    'items',
                    'profile',
                    newItemName,
                  ]);
                },
                error: (error) => {
                  // HTML encode the error message since it originates from XML
                  this._snackBar.open(
                    Utils.toHTML(error.message),
                    $localize`:@@snackbar.action.close:Close`,
                  );
                },
              });
          },
          error: (error) => {
            // HTML encode the error message since it originates from XML
            this._snackBar.open(
              Utils.toHTML(error.message),
              $localize`:@@snackbar.action.close:Close`,
            );
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
                    this._snackBar.open(
                      Utils.toHTML(error.message),
                      $localize`:@@snackbar.action.close:Close`,
                    );
                  },
                });
            },
            error: (error) => {
              this._snackBar.open(
                Utils.toHTML(error.message),
                $localize`:@@snackbar.action.close:Close`,
              );
            },
          });
        },
        error: (error) => {
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
  }
}
