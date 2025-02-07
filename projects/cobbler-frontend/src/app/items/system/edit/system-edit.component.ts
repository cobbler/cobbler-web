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
import { CobblerApiService, System } from 'cobbler-api';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';
import Utils, { CobblerInputChoices, CobblerInputData } from '../../../utils';
import { DialogBoxItemRenderedComponent } from '../../../common/dialog-box-item-rendered/dialog-box-item-rendered.component';

@Component({
  selector: 'cobbler-edit',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCheckbox,
    MatFormField,
    MatIconModule,
    MatIconButton,
    MatInput,
    MatLabel,
    MatTooltip,
    ReactiveFormsModule,
    MultiSelectComponent,
    KeyValueEditorComponent,
  ],
  templateUrl: './system-edit.component.html',
  styleUrl: './system-edit.component.scss',
})
export class SystemEditComponent implements OnInit, OnDestroy {
  // Bring Enum to HTML scope
  protected readonly CobblerInputChoices = CobblerInputChoices;

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form data
  systemReadonlyInputData: Array<CobblerInputData> = [
    {
      formControlName: 'name',
      inputType: CobblerInputChoices.TEXT,
      label: 'Name',
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'uid',
      inputType: CobblerInputChoices.TEXT,
      label: 'UID',
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'mtime',
      inputType: CobblerInputChoices.TEXT,
      label: 'Last modified time',
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'ctime',
      inputType: CobblerInputChoices.TEXT,
      label: 'Creation time',
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'depth',
      inputType: CobblerInputChoices.NUMBER,
      label: 'Depth',
      disabled: false,
      readonly: true,
      defaultValue: 0,
      inherited: false,
    },
    {
      formControlName: 'is_subobject',
      inputType: CobblerInputChoices.CHECKBOX,
      label: 'Is Subobject?',
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
    },
  ];
  systemEditableInputData: Array<CobblerInputData> = [
    {
      formControlName: 'virt_cpus',
      inputType: CobblerInputChoices.NUMBER,
      label: 'Virtual CPUs',
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: false,
    },
    {
      formControlName: 'virt_file_size',
      inputType: CobblerInputChoices.NUMBER,
      label: 'Virtual Disk File Size',
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: false,
    },
    {
      formControlName: 'virt_ram',
      inputType: CobblerInputChoices.NUMBER,
      label: 'Virtual RAM',
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: false,
    },
    {
      formControlName: 'serial_device',
      inputType: CobblerInputChoices.NUMBER,
      label: 'Serial Device Number',
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: false,
    },
    {
      formControlName: 'serial_baud_rate',
      inputType: CobblerInputChoices.NUMBER,
      label: 'Serial Device Baud Rate',
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: false,
    },
    {
      formControlName: 'comment',
      inputType: CobblerInputChoices.TEXT,
      label: 'Comment',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
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
      formControlName: 'parent',
      inputType: CobblerInputChoices.TEXT,
      label: 'Parent',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'gateway',
      inputType: CobblerInputChoices.TEXT,
      label: 'Gateway',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'hostname',
      inputType: CobblerInputChoices.TEXT,
      label: 'Hostname',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'image',
      inputType: CobblerInputChoices.TEXT,
      label: 'Image',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'ipv6_default_device',
      inputType: CobblerInputChoices.TEXT,
      label: 'IPv6 Default Device',
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
      formControlName: 'power_address',
      inputType: CobblerInputChoices.TEXT,
      label: 'Power Management Address',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'power_id',
      inputType: CobblerInputChoices.TEXT,
      label: 'Power Management Plug ID',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'power_pass',
      inputType: CobblerInputChoices.TEXT,
      label: 'Power Management Password',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'power_type',
      inputType: CobblerInputChoices.TEXT,
      label: 'Power Management Type',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'power_user',
      inputType: CobblerInputChoices.TEXT,
      label: 'Power Management Username',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'power_options',
      inputType: CobblerInputChoices.TEXT,
      label: 'Power Management Options',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'power_identity_file',
      inputType: CobblerInputChoices.TEXT,
      label: 'Power Management Identity File',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'profile',
      inputType: CobblerInputChoices.TEXT,
      label: 'Profile',
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
      formControlName: 'status',
      inputType: CobblerInputChoices.TEXT,
      label: 'Status',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'virt_disk_driver',
      inputType: CobblerInputChoices.TEXT,
      label: 'Virtual Disk Driver',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'virt_path',
      inputType: CobblerInputChoices.TEXT,
      label: 'Virtual Image Path',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'virt_type',
      inputType: CobblerInputChoices.TEXT,
      label: 'Virtual Machine Type',
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
      formControlName: 'ipv6_autoconfiguration',
      inputType: CobblerInputChoices.CHECKBOX,
      label: 'Use IPv6 Autoconfiguration?',
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
    },
    {
      formControlName: 'repos_enabled',
      inputType: CobblerInputChoices.CHECKBOX,
      label: 'Repositories enabled?',
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
    },
    {
      formControlName: 'netboot_enabled',
      inputType: CobblerInputChoices.CHECKBOX,
      label: 'Network Boot enabled?',
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
    },
    {
      formControlName: 'virt_auto_boot',
      inputType: CobblerInputChoices.CHECKBOX,
      label: 'Virtual Machine Auto Boot?',
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
    },
    {
      formControlName: 'virt_pxe_boot',
      inputType: CobblerInputChoices.CHECKBOX,
      label: 'Virtual PXE Boot?',
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
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
      formControlName: 'template_files',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: 'Template Files',
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
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
  ];

  // Form
  name: string;
  system: System;
  private readonly _formBuilder = inject(FormBuilder);
  systemReadonlyFormGroup = this._formBuilder.group({});
  systemFormGroup = this._formBuilder.group({});
  isEditMode: boolean = false;

  // Show disable netboot
  showDisableNetboot: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
    @Inject(MatDialog) readonly dialog: MatDialog,
  ) {
    this.name = this.route.snapshot.paramMap.get('name');
    this.systemReadonlyInputData.forEach((value) => {
      this.systemReadonlyFormGroup.addControl(
        value.formControlName,
        new FormControl({
          value: value.defaultValue,
          disabled: value.disabled,
        }),
      );
      if (value.inherited) {
        this.systemReadonlyFormGroup.addControl(
          value.formControlName + '_inherited',
          new FormControl({
            value: false,
            disabled: value.disabled,
          }),
        );
      }
    });
    this.systemEditableInputData.forEach((value) => {
      this.systemFormGroup.addControl(
        value.formControlName,
        new FormControl({
          value: value.defaultValue,
          disabled: value.disabled,
        }),
      );
      if (value.inherited) {
        this.systemFormGroup.addControl(
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
    this.systemFormGroup
      .get('autoinstall_meta_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('autoinstall_meta')),
      );
    this.systemFormGroup
      .get('boot_files_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('boot_files')),
      );
    this.systemFormGroup
      .get('boot_loaders_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('boot_loaders')),
      );
    this.systemFormGroup
      .get('fetchable_files_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('fetchable_files')),
      );
    this.systemFormGroup
      .get('kernel_options_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('kernel_options')),
      );
    this.systemFormGroup
      .get('kernel_options_post_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(
          this.systemFormGroup.get('kernel_options_post'),
        ),
      );
    this.systemFormGroup
      .get('mgmt_classes_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('mgmt_classes')),
      );
    this.systemFormGroup
      .get('mgmt_parameters_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('mgmt_parameters')),
      );
    this.systemFormGroup
      .get('owners_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('owners')),
      );
    this.systemFormGroup
      .get('template_files_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('template_files')),
      );
    // Check if PXE just once is enabled
    this.checkSettingsPxeJustOne();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private checkSettingsPxeJustOne() {
    this.cobblerApiService
      .get_settings(this.userService.token)
      .subscribe((value) => {
        this.showDisableNetboot = value.pxe_just_once;
      });
  }

  disableNetboot(): void {
    this.cobblerApiService
      .disable_netboot(this.system.name, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this._snackBar.open('Network boot successfully disabled.', 'Close');
            this.refreshData();
          } else {
            this._snackBar.open(
              'Disabling network boot was unsuccessful.',
              'Close',
            );
          }
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
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
    this.router.navigate(['/items', 'system', this.name, 'autoinstall']);
  }

  refreshData(): void {
    this.cobblerApiService
      .get_system(this.name, false, false, this.userService.token)
      .subscribe({
        next: (value) => {
          this.system = value;
          this.systemReadonlyFormGroup.patchValue({
            name: this.system.name,
            uid: this.system.uid,
            mtime: Utils.floatToDate(this.system.mtime).toString(),
            ctime: Utils.floatToDate(this.system.ctime).toString(),
            depth: this.system.depth,
            is_subobject: this.system.is_subobject,
          });
          this.systemFormGroup.patchValue({
            serial_device: this.system.serial_device,
            serial_baud_rate: this.system.serial_baud_rate,
            ipv6_autoconfiguration: this.system.ipv6_autoconfiguration,
            repos_enabled: this.system.repos_enabled,
            netboot_enabled: this.system.netboot_enabled,
            virt_pxe_boot: this.system.virt_pxe_boot,
            redhat_management_key: this.system.redhat_management_key,
            autoinstall: this.system.autoinstall,
            parent: this.system.parent,
            gateway: this.system.gateway,
            hostname: this.system.hostname,
            image: this.system.image,
            ipv6_default_device: this.system.ipv6_default_device,
            next_server_v4: this.system.next_server_v4,
            next_server_v6: this.system.next_server_v6,
            filename: this.system.filename,
            power_address: this.system.power_address,
            power_id: this.system.power_id,
            power_pass: this.system.power_pass,
            power_type: this.system.power_type,
            power_user: this.system.power_user,
            power_options: this.system.power_options,
            power_identity_file: this.system.power_identity_file,
            profile: this.system.profile,
            proxy: this.system.proxy,
            server: this.system.server,
            status: this.system.status,
            virt_disk_driver: this.system.virt_disk_driver,
            virt_path: this.system.virt_path,
            virt_type: this.system.virt_type,
            name_servers: this.system.name_servers,
            name_servers_search: this.system.name_servers_search,
          });
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.virt_cpus,
            'virt_cpus',
            0,
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.virt_file_size,
            'virt_file_size',
            0,
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.virt_ram,
            'virt_ram',
            0,
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.virt_auto_boot,
            'virt_auto_boot',
            false,
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.boot_loaders,
            'boot_loaders',
            ['ipxe', 'grub', 'pxe'],
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.owners,
            'owners',
            [],
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.boot_files,
            'boot_files',
            new Map<string, any>(),
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.fetchable_files,
            'fetchable_files',
            new Map<string, any>(),
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.kernel_options,
            'kernel_options',
            new Map<string, any>(),
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.kernel_options_post,
            'kernel_options_post',
            new Map<string, any>(),
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.mgmt_classes,
            'mgmt_classes',
            [],
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.mgmt_parameters,
            'mgmt_parameters',
            new Map<string, any>(),
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.template_files,
            'template_files',
            new Map<string, any>(),
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.autoinstall_meta,
            'autoinstall_meta',
            new Map<string, any>(),
          );
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }

  removeSystem(): void {
    this.cobblerApiService
      .remove_system(this.name, this.userService.token, false)
      .subscribe({
        next: (value) => {
          if (value) {
            this.router.navigate(['/items', 'system']);
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

  editSystem(): void {
    this.isEditMode = true;
    this.systemFormGroup.enable();
    // Inherit inputs
    if (typeof this.system.autoinstall_meta === 'string') {
      this.systemFormGroup.get('autoinstall_meta').disable();
    }
    if (typeof this.system.boot_files === 'string') {
      this.systemFormGroup.get('boot_files').disable();
    }
    if (typeof this.system.boot_loaders === 'string') {
      this.systemFormGroup.get('boot_loaders').disable();
    }
    if (typeof this.system.fetchable_files === 'string') {
      this.systemFormGroup.get('fetchable_files').disable();
    }
    if (typeof this.system.kernel_options === 'string') {
      this.systemFormGroup.get('kernel_options').disable();
    }
    if (typeof this.system.kernel_options_post === 'string') {
      this.systemFormGroup.get('kernel_options_post').disable();
    }
    if (typeof this.system.mgmt_classes === 'string') {
      this.systemFormGroup.get('mgmt_classes').disable();
    }
    if (typeof this.system.mgmt_parameters === 'string') {
      this.systemFormGroup.get('mgmt_parameters').disable();
    }
    if (typeof this.system.owners === 'string') {
      this.systemFormGroup.get('owners').disable();
    }
    if (typeof this.system.template_files === 'string') {
      this.systemFormGroup.get('template_files').disable();
    }
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmCancelEditComponent, {
      data: {
        name: this.system.name,
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === false) {
        // False means the user want's to continue
        return;
      }
      this.isEditMode = false;
      this.systemFormGroup.disable();
      this.refreshData();
    });
  }

  showAsRendered(): void {
    this.cobblerApiService
      .get_system_as_rendered(this.system.name, this.userService.token)
      .subscribe((value) => {
        this.dialog.open(DialogBoxItemRenderedComponent, {
          data: {
            itemType: 'System',
            uid: this.system.uid,
            name: this.system.name,
            renderedData: value,
          },
        });
      });
  }

  copySystem(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemCopyComponent, {
      data: {
        itemType: 'System',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the system
        return;
      }
      this.cobblerApiService
        .get_system_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (systemHandle) => {
            this.cobblerApiService
              .copy_system(systemHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.router.navigate(['/items', 'system', newItemName]);
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

  saveSystem(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.systemFormGroup,
      Utils.getDirtyValues(this.systemFormGroup),
    );
    this.cobblerApiService
      .get_system_handle(this.name, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (systemHandle) => {
          let modifyObservables: Observable<boolean>[] = [];
          dirtyValues.forEach((value, key) => {
            modifyObservables.push(
              this.cobblerApiService.modify_system(
                systemHandle,
                key,
                value,
                this.userService.token,
              ),
            );
          });
          combineLatest(modifyObservables).subscribe({
            next: () => {
              this.cobblerApiService
                .save_system(systemHandle, this.userService.token)
                .subscribe({
                  next: () => {
                    this.isEditMode = false;
                    this.systemFormGroup.disable();
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
