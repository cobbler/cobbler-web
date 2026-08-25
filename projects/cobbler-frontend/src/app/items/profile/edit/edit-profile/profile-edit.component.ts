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
import { combineLatest, forkJoin, Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from 'projects/cobbler-frontend/src/app/common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from 'projects/cobbler-frontend/src/app/common/dialog-item-copy/dialog-item-copy.component';
import { ItemReferenceComponent } from 'projects/cobbler-frontend/src/app/common/item-reference/item-reference.component';
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
    ItemReferenceComponent,
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
      inputType: CobblerInputChoices.ITEM_REFERENCE,
      label: $localize`:@@profile.edit.label.distro:Distro`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      options: [],
      itemRoute: ['/items', 'distro'],
      hint: $localize`:@@profile.edit.hint.distro:UID of the parent distro. Required unless this is a sub-profile.`,
    },
    {
      formControlName: 'menu',
      inputType: CobblerInputChoices.ITEM_REFERENCE,
      label: $localize`:@@profile.edit.label.menu:Menu`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      options: [],
      itemRoute: ['/items', 'menu'],
      hint: $localize`:@@profile.edit.hint.menu:UID of the boot menu this profile will appear in.`,
    },
    {
      formControlName: 'next_server_v4',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.next_server_v4:Next Server IPv4`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.next_server_v4:IPv4 address of the TFTP/next-boot server. Overrides the global setting for this profile. Supports <<inherit>>.`,
    },
    {
      formControlName: 'next_server_v6',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.next_server_v6:Next Server IPv6`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.next_server_v6:IPv6 address of the TFTP/next-boot server. Overrides the global setting for this profile. Supports <<inherit>>.`,
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
      inputType: CobblerInputChoices.ITEM_REFERENCE,
      label: $localize`:@@profile.edit.label.parent:Parent`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      options: [],
      itemRoute: ['/items', 'profile'],
      hint: $localize`:@@profile.edit.hint.parent:UID of the parent profile for sub-profile inheritance.`,
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
      formControlName: 'virt_cpus',
      inputType: CobblerInputChoices.NUMBER,
      label: $localize`:@@profile.edit.label.virt_cpus:Virtual CPUs`,
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: true,
      hint: $localize`:@@profile.edit.hint.virt_cpus:Number of vCPU cores for VMs using this profile. Supports <<inherit>>.`,
    },
    {
      formControlName: 'virt_file_size',
      inputType: CobblerInputChoices.NUMBER,
      label: $localize`:@@profile.edit.label.virt_file_size:Virtual Disk File Size`,
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: true,
      hint: $localize`:@@profile.edit.hint.virt_file_size:Disk image size in gigabytes for VMs. Supports <<inherit>>.`,
    },
    {
      formControlName: 'virt_ram',
      inputType: CobblerInputChoices.NUMBER,
      label: $localize`:@@profile.edit.label.virt_ram:Virtual RAM`,
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: true,
      hint: $localize`:@@profile.edit.hint.virt_ram:RAM in megabytes for VMs using this profile. Supports <<inherit>>.`,
    },
    {
      formControlName: 'virt_disk_driver',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.virt_disk_driver:Virtual Disk Driver`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.virt_disk_driver:Disk driver for VM images (e.g. raw, qcow2). Supports <<inherit>>.`,
    },
    {
      formControlName: 'virt_path',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.virt_path:Virtual Image Path`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.virt_path:Filesystem path where VM disk images are stored. Supports <<inherit>>.`,
    },
    {
      formControlName: 'virt_type',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile.edit.label.virt_type:Virtual Machine Type`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile.edit.hint.virt_type:Hypervisor type for VMs (e.g. kvm, xen, vmware). Supports <<inherit>>.`,
    },
    {
      formControlName: 'virt_auto_boot',
      inputType: CobblerInputChoices.CHECKBOX,
      label: $localize`:@@profile.edit.label.virt_auto_boot:Virtual Machine Auto Boot?`,
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: true,
      hint: $localize`:@@profile.edit.hint.virt_auto_boot:Automatically start the VM when the host boots. Supports <<inherit>>.`,
    },
    {
      formControlName: 'virt_pxe_boot',
      inputType: CobblerInputChoices.CHECKBOX,
      label: $localize`:@@profile.edit.label.virt_pxe_boot:Virtual PXE Boot?`,
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
      hint: $localize`:@@profile.edit.hint.virt_pxe_boot:Boot VMs using this profile from PXE rather than from disk.`,
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
      defaultValue: {},
      inherited: true,
      hint: $localize`:@@profile.edit.hint.autoinstall_meta:Key=value pairs substituted into the automatic installation template as variables before rendering. Supports <<inherit>>.`,
    },
    {
      formControlName: 'kernel_options',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@profile.edit.label.kernel_options:Kernel Options`,
      disabled: true,
      readonly: false,
      defaultValue: {},
      inherited: true,
      hint: $localize`:@@profile.edit.hint.kernel_options:Space-delimited key=value pairs appended to the kernel command line during installation, e.g. "a=b c=d". Supports <<inherit>>.`,
    },
    {
      formControlName: 'kernel_options_post',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@profile.edit.label.kernel_options_post:Kernel Options (Post Install)`,
      disabled: true,
      readonly: false,
      defaultValue: {},
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
      defaultValue: {},
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
      .get('boot_loaders_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.profileFormGroup.get('boot_loaders')),
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
    this.profileFormGroup
      .get('virt_cpus_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.profileFormGroup.get('virt_cpus')),
      );
    this.profileFormGroup
      .get('virt_file_size_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.profileFormGroup.get('virt_file_size')),
      );
    this.profileFormGroup
      .get('virt_ram_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.profileFormGroup.get('virt_ram')),
      );
    this.profileFormGroup
      .get('virt_auto_boot_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.profileFormGroup.get('virt_auto_boot')),
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
      .pipe(
        switchMap((profile) => {
          return forkJoin({
            profile: of(profile),
            bootloaders: this.cobblerApiService.get_valid_profile_bootloaders(
              profile.name,
              this.userService.token,
            ),
            distros: this.cobblerApiService.get_distros(),
            menus: this.cobblerApiService.get_menus(),
            profiles: this.cobblerApiService.get_profiles(),
          });
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: ({ profile, bootloaders, distros, menus, profiles }) => {
          this.profile = profile;
          const bootloadersInput = this.profileEditableInputData.find(
            (p) => p.formControlName === 'boot_loaders',
          );
          if (bootloadersInput) {
            bootloadersInput.options = bootloaders;
          }
          const distroInput = this.profileEditableInputData.find(
            (p) => p.formControlName === 'distro',
          );
          if (distroInput) {
            distroInput.options = distros.map((distro) => ({
              value: distro.uid,
              label: distro.name,
            }));
          }
          const menuInput = this.profileEditableInputData.find(
            (p) => p.formControlName === 'menu',
          );
          if (menuInput) {
            menuInput.options = menus.map((menu) => ({
              value: menu.uid,
              label: menu.name,
            }));
          }
          const parentInput = this.profileEditableInputData.find(
            (p) => p.formControlName === 'parent',
          );
          if (parentInput) {
            // A profile cannot be its own parent.
            parentInput.options = profiles
              .filter((otherProfile) => otherProfile.uid !== profile.uid)
              .map((otherProfile) => ({
                value: otherProfile.uid,
                label: otherProfile.name,
              }));
          }
          this.profileReadonlyFormGroup.patchValue({
            name: this.profile.name,
            uid: this.profile.uid,
            mtime: Utils.floatToDate(this.profile.mtime).toString(),
            ctime: Utils.floatToDate(this.profile.ctime).toString(),
          });
          this.profileFormGroup.patchValue({
            comment: this.profile.comment,
            redhat_management_key: this.profile.redhat_management_key,
            autoinstall: this.profile.autoinstall,
            dhcp_tag: this.profile.dhcp_tag,
            distro: this.profile.distro,
            menu: this.profile.menu,
            // Previously never patched at all, so the field was always shown empty regardless of
            // the real value — the form control existed but was simply never populated.
            parent: this.profile.parent,
            proxy: this.profile.proxy,
            server: this.profile.server,
            repos: this.profile.repos,
            virt_pxe_boot: this.profile.virt.pxe_boot,
            name_servers: this.profile.dns.name_servers,
            name_servers_search: this.profile.dns.name_servers_search,
            // These fields are typed as a bare string (or the literal `<<inherit>>` sentinel)
            // rather than a proper array/object + sentinel union, so — like the existing
            // redhat_management_key field — they are displayed as a plain raw string (which may
            // literally read "<<inherit>>") rather than through Utils.patchFormGroupInherited().
            // patchFormGroupInherited() discriminates solely on `typeof value === 'string'`, which
            // would incorrectly treat every real, concrete value of these fields as "inherited".
            next_server_v4: this.profile.tftp.next_server_v4,
            next_server_v6: this.profile.tftp.next_server_v6,
            virt_disk_driver: this.profile.virt.disk_driver,
            virt_path: this.profile.virt.path,
            virt_type: this.profile.virt.type,
          });
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.virt.cpus,
            'virt_cpus',
            0,
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.virt.file_size,
            'virt_file_size',
            0,
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.virt.ram,
            'virt_ram',
            0,
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.virt.auto_boot,
            'virt_auto_boot',
            false,
          );
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
            {},
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.kernel_options,
            'kernel_options',
            {},
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.kernel_options_post,
            'kernel_options_post',
            {},
          );
          Utils.patchFormGroupInherited(
            this.profileFormGroup,
            this.profile.template_files,
            'template_files',
            {},
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
      .remove_profile(this.profile.uid, this.userService.token, false)
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
    if (typeof this.profile.boot_loaders === 'string') {
      this.profileFormGroup.get('boot_loaders').disable();
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
    if (typeof this.profile.virt.cpus === 'string') {
      this.profileFormGroup.get('virt_cpus').disable();
    }
    if (typeof this.profile.virt.file_size === 'string') {
      this.profileFormGroup.get('virt_file_size').disable();
    }
    if (typeof this.profile.virt.ram === 'string') {
      this.profileFormGroup.get('virt_ram').disable();
    }
    if (typeof this.profile.virt.auto_boot === 'string') {
      this.profileFormGroup.get('virt_auto_boot').disable();
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
        .get_profile_handle(name)
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

  // Fields whose real backend attribute is a nested path under the profile's virt/dns/tftp
  // sub-objects (introduced in Cobbler 4.0.0). The form control names below are kept flat for the
  // UI, but must be written back via their real nested `attribute` path in `modify_profile`.
  private static readonly NESTED_ATTRIBUTE_PATHS: Record<string, string[]> = {
    next_server_v4: ['tftp', 'next_server_v4'],
    next_server_v6: ['tftp', 'next_server_v6'],
    virt_cpus: ['virt', 'cpus'],
    virt_file_size: ['virt', 'file_size'],
    virt_ram: ['virt', 'ram'],
    virt_disk_driver: ['virt', 'disk_driver'],
    virt_path: ['virt', 'path'],
    virt_type: ['virt', 'type'],
    virt_auto_boot: ['virt', 'auto_boot'],
    virt_pxe_boot: ['virt', 'pxe_boot'],
    name_servers: ['dns', 'name_servers'],
    name_servers_search: ['dns', 'name_servers_search'],
  };

  saveProfile(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.profileFormGroup,
      Utils.getDirtyValues(this.profileFormGroup),
    );
    this.cobblerApiService
      .get_profile_handle(this.name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (profileHandle) => {
          let modifyObservables: Observable<boolean>[] = [];
          dirtyValues.forEach((value, key) => {
            modifyObservables.push(
              this.cobblerApiService.modify_profile(
                profileHandle,
                ProfileEditComponent.NESTED_ATTRIBUTE_PATHS[key] ?? [key],
                value,
                this.userService.token,
              ),
            );
          });
          if (modifyObservables.length === 0) {
            // combineLatest([]) completes without ever emitting, so short-circuit to the save.
            this.persistProfile(profileHandle);
            return;
          }
          combineLatest(modifyObservables).subscribe({
            next: () => {
              this.persistProfile(profileHandle);
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

  private persistProfile(profileHandle: string): void {
    this.cobblerApiService
      .save_profile(profileHandle, false, false, '', this.userService.token)
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
  }
}
