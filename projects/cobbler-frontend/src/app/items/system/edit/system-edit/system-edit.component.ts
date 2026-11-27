import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CobblerApiService, System } from 'cobbler-api';
import { forkJoin, of, Subject } from 'rxjs';
import { switchMap, takeUntil, finalize } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from 'projects/cobbler-frontend/src/app/common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from 'projects/cobbler-frontend/src/app/common/dialog-item-copy/dialog-item-copy.component';
import { ItemReferenceComponent } from 'projects/cobbler-frontend/src/app/common/item-reference/item-reference.component';
import { KeyValueEditorComponent } from 'projects/cobbler-frontend/src/app/common/key-value-editor/key-value-editor.component';
import { MultiSelectComponent } from 'projects/cobbler-frontend/src/app/common/multi-select/multi-select.component';
import { UserService } from 'projects/cobbler-frontend/src/app/services/user.service';
import Utils, {
  CobblerInputChoices,
  CobblerInputData,
  GroupedInputData,
} from '../../../../utils';
import { DialogBoxItemRenderedComponent } from '../../../../common/dialog-box-item-rendered/dialog-box-item-rendered.component';
import {
  cobblerItemEditableData,
  cobblerItemReadonlyData,
} from '../../../metadata';
import { MultiSelectStrictComponent } from 'projects/cobbler-frontend/src/app/common/multi-select-strict/multi-select-strict.component';
import { HelpButtonComponent } from '../../../../common/help-button/help-button.component';
import { OptionGroupComponent } from '../../../../common/option-group/option-group.component';

@Component({
  selector: 'cobbler-system-edit',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatLabel,
    MatTooltipModule,
    ReactiveFormsModule,
    MultiSelectComponent,
    KeyValueEditorComponent,
    RouterLink,
    MultiSelectStrictComponent,
    HelpButtonComponent,
    NgTemplateOutlet,
    OptionGroupComponent,
    ItemReferenceComponent,
  ],
  templateUrl: './system-edit.component.html',
  styleUrl: './system-edit.component.scss',
})
export class SystemEditComponent implements OnInit, OnDestroy {
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
  systemReadonlyInputData = cobblerItemReadonlyData;
  systemEditableInputData: Array<CobblerInputData> = [
    ...cobblerItemEditableData,
    {
      formControlName: 'virt_cpus',
      inputType: CobblerInputChoices.NUMBER,
      label: $localize`:@@system.edit.label.virt_cpus:CPUs`,
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: true,
      hint: $localize`:@@system.edit.hint.virt_cpus:Number of vCPU cores for VMs using this system definition. Supports <<inherit>>.`,
      group: $localize`:@@option-group.virt:Virtualization`,
    },
    {
      formControlName: 'virt_file_size',
      inputType: CobblerInputChoices.NUMBER,
      label: $localize`:@@system.edit.label.virt_file_size:Disk File Size`,
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: true,
      hint: $localize`:@@system.edit.hint.virt_file_size:Disk image size in gigabytes for VMs. Supports <<inherit>>.`,
      group: $localize`:@@option-group.virt:Virtualization`,
    },
    {
      formControlName: 'virt_ram',
      inputType: CobblerInputChoices.NUMBER,
      label: $localize`:@@system.edit.label.virt_ram:RAM`,
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: true,
      hint: $localize`:@@system.edit.hint.virt_ram:RAM in megabytes for VMs using this system definition. Supports <<inherit>>.`,
      group: $localize`:@@option-group.virt:Virtualization`,
    },
    {
      formControlName: 'serial_device',
      inputType: CobblerInputChoices.NUMBER,
      label: $localize`:@@system.edit.label.serial_device:Serial Device Number`,
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: false,
      hint: $localize`:@@system.edit.hint.serial_device:Serial port number (0, 1, …) for console access. Set to -1 to disable.`,
    },
    {
      formControlName: 'serial_baud_rate',
      inputType: CobblerInputChoices.NUMBER,
      label: $localize`:@@system.edit.label.serial_baud_rate:Serial Device Baud Rate`,
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: false,
      hint: $localize`:@@system.edit.hint.serial_baud_rate:Baud rate for the serial console. Set to "disabled" to disable.`,
    },
    {
      formControlName: 'redhat_management_key',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.redhat_management_key:RedHat Management Key`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.redhat_management_key:Registration key for Red Hat management systems (Spacewalk, Uyuni, SUSE Manager). Supports <<inherit>>.`,
    },
    {
      formControlName: 'autoinstall',
      inputType: CobblerInputChoices.ITEM_REFERENCE,
      label: $localize`:@@system.edit.label.autoinstall:Autoinstallation Template`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      options: [],
      itemRoute: ['/items', 'template'],
      hint: $localize`:@@system.edit.hint.autoinstall:Name or UID of the automatic installation template. Overrides the profile's template. Supports <<inherit>>.`,
    },
    {
      formControlName: 'parent',
      inputType: CobblerInputChoices.ITEM_REFERENCE,
      label: $localize`:@@system.edit.label.parent:Parent`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      options: [],
      itemRoute: ['/items', 'system'],
      hint: $localize`:@@system.edit.hint.parent:UID of the parent system for sub-system inheritance.`,
    },
    {
      formControlName: 'gateway',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.gateway:Gateway`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.gateway:Default IPv4 gateway address for the system.`,
    },
    {
      formControlName: 'hostname',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.hostname:Hostname`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.hostname:Fully qualified domain name of the system.`,
    },
    {
      formControlName: 'image',
      inputType: CobblerInputChoices.ITEM_REFERENCE,
      label: $localize`:@@system.edit.label.image:Image`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      options: [],
      itemRoute: ['/items', 'image'],
      hint: $localize`:@@system.edit.hint.image:UID of the image to provision this system with. Cannot be set at the same time as profile.`,
    },
    {
      formControlName: 'ipv6_default_device',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.ipv6_default_device:IPv6 Default Device`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.ipv6_default_device:Name of the network interface used as the default IPv6 route.`,
    },
    {
      formControlName: 'next_server_v4',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.next_server_v4:IPv4`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.next_server_v4:IPv4 address of the TFTP/next-boot server for this system. Supports <<inherit>>.`,
      group: $localize`:@@option-group.tftp:TFTP / Next Server`,
    },
    {
      formControlName: 'next_server_v6',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.next_server_v6:IPv6`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.next_server_v6:IPv6 address of the TFTP/next-boot server for this system. Supports <<inherit>>.`,
      group: $localize`:@@option-group.tftp:TFTP / Next Server`,
    },
    {
      formControlName: 'filename',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.filename:DHCP Filename`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.filename:Filename fetched from the TFTP server by the client bootloader.`,
    },
    {
      formControlName: 'power_address',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.power_address:Address`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.power_address:IP or hostname of the power management controller.`,
      group: $localize`:@@option-group.power:Power Management`,
    },
    {
      formControlName: 'power_id',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.power_id:Plug ID`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.power_id:Port, blade ID, or outlet number on the power management device.`,
      group: $localize`:@@option-group.power:Power Management`,
    },
    {
      formControlName: 'power_pass',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.power_pass:Password`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.power_pass:Password for the power management controller.`,
      group: $localize`:@@option-group.power:Power Management`,
    },
    {
      formControlName: 'power_type',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.power_type:Type`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.power_type:Power management type (e.g. ipmilanplus, apc, drac).`,
      group: $localize`:@@option-group.power:Power Management`,
    },
    {
      formControlName: 'power_user',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.power_user:Username`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.power_user:Username for the power management controller.`,
      group: $localize`:@@option-group.power:Power Management`,
    },
    {
      formControlName: 'power_options',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.power_options:Options`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.power_options:Additional options passed to the power management tool.`,
      group: $localize`:@@option-group.power:Power Management`,
    },
    {
      formControlName: 'power_identity_file',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.power_identity_file:Identity File`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.power_identity_file:Path to the SSH identity file for power management authentication.`,
      group: $localize`:@@option-group.power:Power Management`,
    },
    {
      formControlName: 'profile',
      inputType: CobblerInputChoices.ITEM_REFERENCE,
      label: $localize`:@@system.edit.label.profile:Profile`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      options: [],
      itemRoute: ['/items', 'profile'],
      hint: $localize`:@@system.edit.hint.profile:UID of the profile to provision this system with. Cannot be set at the same time as image.`,
    },
    {
      formControlName: 'proxy',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.proxy:Proxy`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.proxy:HTTP proxy URL used during package installation. Overrides the profile setting.`,
    },
    {
      formControlName: 'server',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.server:Server`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.server:Cobbler server hostname/IP as reachable by this system. Overrides the profile setting.`,
    },
    {
      formControlName: 'status',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.status:Status`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.status:Provisioning status of this system (e.g. production, testing, development).`,
    },
    {
      formControlName: 'virt_disk_driver',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.virt_disk_driver:Disk Driver`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.virt_disk_driver:Disk driver for VM images (e.g. raw, qcow2). Supports <<inherit>>.`,
      group: $localize`:@@option-group.virt:Virtualization`,
    },
    {
      formControlName: 'virt_path',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.virt_path:Image Path`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.virt_path:Filesystem path where VM disk images are stored. Supports <<inherit>>.`,
      group: $localize`:@@option-group.virt:Virtualization`,
    },
    {
      formControlName: 'virt_type',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system.edit.label.virt_type:Machine Type`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system.edit.hint.virt_type:Hypervisor type for VMs (e.g. kvm, xen, vmware). Supports <<inherit>>.`,
      group: $localize`:@@option-group.virt:Virtualization`,
    },
    {
      formControlName: 'boot_loaders',
      inputType: CobblerInputChoices.MULTI_SELECT_STRICT_DROPDOWN,
      label: $localize`:@@system.edit.label.boot_loaders:Boot Loaders`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
      options: [],
      hint: $localize`:@@system.edit.hint.boot_loaders:Bootloaders for which Cobbler generates PXE/GRUB boot entries. Supports <<inherit>>.`,
    },
    {
      formControlName: 'ipv6_autoconfiguration',
      inputType: CobblerInputChoices.CHECKBOX,
      label: $localize`:@@system.edit.label.ipv6_autoconfiguration:Use IPv6 Autoconfiguration?`,
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
      hint: $localize`:@@system.edit.hint.ipv6_autoconfiguration:Use stateless address autoconfiguration (SLAAC) for IPv6 on this system.`,
    },
    {
      formControlName: 'repos_enabled',
      inputType: CobblerInputChoices.CHECKBOX,
      label: $localize`:@@system.edit.label.repos_enabled:Repositories enabled?`,
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
      hint: $localize`:@@system.edit.hint.repos_enabled:Enable repository management for this system after provisioning.`,
    },
    {
      formControlName: 'netboot_enabled',
      inputType: CobblerInputChoices.CHECKBOX,
      label: $localize`:@@system.edit.label.netboot_enabled:Network Boot enabled?`,
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
      hint: $localize`:@@system.edit.hint.netboot_enabled:Allow PXE boot files to be generated on sync. Disable after installation to prevent reinstall loops.`,
    },
    {
      formControlName: 'virt_auto_boot',
      inputType: CobblerInputChoices.CHECKBOX,
      label: $localize`:@@system.edit.label.virt_auto_boot:Auto Boot?`,
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: true,
      hint: $localize`:@@system.edit.hint.virt_auto_boot:Automatically start the VM when the host boots. Supports <<inherit>>.`,
      group: $localize`:@@option-group.virt:Virtualization`,
    },
    {
      formControlName: 'virt_pxe_boot',
      inputType: CobblerInputChoices.CHECKBOX,
      label: $localize`:@@system.edit.label.virt_pxe_boot:PXE Boot?`,
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
      hint: $localize`:@@system.edit.hint.virt_pxe_boot:Boot this VM from PXE rather than from its disk.`,
      group: $localize`:@@option-group.virt:Virtualization`,
    },
    {
      formControlName: 'owners',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@system.edit.label.owners:Owners`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
      hint: $localize`:@@system.edit.hint.owners:Cobbler user accounts allowed to manage this item. Cosmetic only — not validated against real users. Supports <<inherit>>.`,
    },
    {
      formControlName: 'kernel_options',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@system.edit.label.kernel_options:Kernel Options`,
      disabled: true,
      readonly: false,
      defaultValue: {},
      inherited: true,
      hint: $localize`:@@system.edit.hint.kernel_options:Space-delimited key=value pairs appended to the kernel command line during installation. Supports <<inherit>>.`,
    },
    {
      formControlName: 'kernel_options_post',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@system.edit.label.kernel_options_post:Kernel Options (Post Install)`,
      disabled: true,
      readonly: false,
      defaultValue: {},
      inherited: true,
      hint: $localize`:@@system.edit.hint.kernel_options_post:Space-delimited key=value pairs appended to the kernel command line after installation. Supports <<inherit>>.`,
    },
    {
      formControlName: 'template_files',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@system.edit.label.template_files:Template Files`,
      disabled: true,
      readonly: false,
      defaultValue: {},
      inherited: false,
      hint: $localize`:@@system.edit.hint.template_files:Source=destination file mappings for built-in configuration management.`,
    },
    {
      formControlName: 'autoinstall_meta',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@system.edit.label.autoinstall_meta:Automatic Installation Template Metadata`,
      disabled: true,
      readonly: false,
      defaultValue: {},
      inherited: true,
      hint: $localize`:@@system.edit.hint.autoinstall_meta:Key=value pairs substituted into the automatic installation template as variables. Supports <<inherit>>.`,
    },
    {
      formControlName: 'name_servers',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@system.edit.label.name_servers:Servers`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      hint: $localize`:@@system.edit.hint.name_servers:DNS name server addresses configured on this system.`,
      group: $localize`:@@option-group.dns:DNS`,
    },
    {
      formControlName: 'name_servers_search',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@system.edit.label.name_servers_search:Search Domains`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      hint: $localize`:@@system.edit.hint.name_servers_search:DNS search domains configured on this system.`,
      group: $localize`:@@option-group.dns:DNS`,
    },
  ];

  groupedSystemEditableInputData: GroupedInputData = Utils.groupInputData(
    this.systemEditableInputData,
  );

  // Setting a profile clears the image and vice versa, and the boot loaders are validated against
  // that parent, so these attributes are modified first and in this order.
  private static readonly MODIFY_PRIORITY = [
    'profile',
    'image',
    'boot_loaders',
  ];

  // Form
  name: string;
  system: System;
  private readonly _formBuilder = inject(FormBuilder);
  systemReadonlyFormGroup = this._formBuilder.group({});
  systemFormGroup = this._formBuilder.group({});
  isEditMode: boolean = false;
  saving: boolean = false;

  // Show disable netboot
  showDisableNetboot: boolean = true;

  constructor() {
    Utils.fillupItemFormGroup(
      this.systemReadonlyFormGroup,
      this.systemFormGroup,
      this.systemReadonlyInputData,
      this.systemEditableInputData,
    );
  }

  ngOnInit(): void {
    // Copying navigates to the copy's URL, which reuses this component: reload on every name change.
    Utils.routeParamChanges(this.route, 'name')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((name) => {
        this.name = name;
        this.isEditMode = false;
        this.systemFormGroup.disable();
        this.systemFormGroup.markAsPristine();
        this.refreshData();
      });
    // Observables for inherited properties
    this.systemFormGroup
      .get('autoinstall_meta_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('autoinstall_meta')),
      );
    this.systemFormGroup
      .get('boot_loaders_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('boot_loaders')),
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
      .get('owners_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('owners')),
      );
    this.systemFormGroup
      .get('virt_cpus_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('virt_cpus')),
      );
    this.systemFormGroup
      .get('virt_file_size_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('virt_file_size')),
      );
    this.systemFormGroup
      .get('virt_ram_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('virt_ram')),
      );
    this.systemFormGroup
      .get('virt_auto_boot_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.systemFormGroup.get('virt_auto_boot')),
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
      .disable_netboot(this.system.uid, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this._snackBar.open(
              $localize`:@@system.netboot.disabled:Network boot successfully disabled.`,
              $localize`:@@snackbar.action.close:Close`,
            );
            this.refreshData();
          } else {
            this._snackBar.open(
              $localize`:@@system.netboot.disable-failed:Disabling network boot was unsuccessful.`,
              $localize`:@@snackbar.action.close:Close`,
            );
          }
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
      .get_system_handle(this.name)
      .pipe(
        switchMap((uid) =>
          this.cobblerApiService.get_system(
            uid,
            false,
            false,
            this.userService.token,
          ),
        ),
        switchMap((system) => {
          return forkJoin({
            system: of(system),
            bootloaders: this.cobblerApiService.get_valid_system_bootloaders(
              system.uid,
              this.userService.token,
            ),
            profiles: this.cobblerApiService.get_profiles(),
            images: this.cobblerApiService.get_images(),
            systems: this.cobblerApiService.get_systems(),
            templates: this.cobblerApiService.get_templates(),
          });
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: ({
          system,
          bootloaders,
          profiles,
          images,
          systems,
          templates,
        }) => {
          this.system = system;
          const bootloadersInput = this.systemEditableInputData.find(
            (s) => s.formControlName === 'boot_loaders',
          );
          if (bootloadersInput) {
            bootloadersInput.options = bootloaders;
          }
          const profileInput = this.systemEditableInputData.find(
            (s) => s.formControlName === 'profile',
          );
          if (profileInput) {
            profileInput.options = profiles.map((profile) => ({
              value: profile.uid,
              label: profile.name,
            }));
          }
          const imageInput = this.systemEditableInputData.find(
            (s) => s.formControlName === 'image',
          );
          if (imageInput) {
            imageInput.options = images.map((image) => ({
              value: image.uid,
              label: image.name,
            }));
          }
          const parentInput = this.systemEditableInputData.find(
            (s) => s.formControlName === 'parent',
          );
          if (parentInput) {
            // A system cannot be its own parent.
            parentInput.options = systems
              .filter((otherSystem) => otherSystem.uid !== system.uid)
              .map((otherSystem) => ({
                value: otherSystem.uid,
                label: otherSystem.name,
              }));
          }
          const autoinstallInput = this.systemEditableInputData.find(
            (s) => s.formControlName === 'autoinstall',
          );
          if (autoinstallInput) {
            autoinstallInput.options =
              Utils.templateReferenceOptions(templates);
          }
          this.systemReadonlyFormGroup.patchValue({
            name: this.system.name,
            uid: this.system.uid,
            mtime: Utils.floatToDate(this.system.mtime).toString(),
            ctime: Utils.floatToDate(this.system.ctime).toString(),
            depth: this.system.depth,
            is_subobject: this.system.is_subobject,
          });
          this.systemFormGroup.patchValue({
            comment: this.system.comment,
            serial_device: this.system.serial_device,
            serial_baud_rate: this.system.serial_baud_rate,
            ipv6_autoconfiguration: this.system.ipv6_autoconfiguration,
            repos_enabled: this.system.repos_enabled,
            netboot_enabled: this.system.netboot_enabled,
            redhat_management_key: this.system.redhat_management_key,
            autoinstall: this.system.autoinstall,
            filename: this.system.filename,
            gateway: this.system.gateway,
            hostname: this.system.hostname,
            image: this.system.image,
            ipv6_default_device: this.system.ipv6_default_device,
            profile: this.system.profile,
            // Previously never patched at all, so the field was always shown empty regardless of
            // the real value — the form control existed but was simply never populated.
            parent: this.system.parent,
            proxy: this.system.proxy,
            server: this.system.server,
            status: this.system.status,
            power_address: this.system.power.address,
            power_id: this.system.power.id,
            power_pass: this.system.power.password,
            power_type: this.system.power.type,
            power_user: this.system.power.user,
            power_options: this.system.power.options,
            power_identity_file: this.system.power.identity_file,
            virt_pxe_boot: this.system.virt.pxe_boot,
            name_servers: this.system.dns.name_servers,
            name_servers_search: this.system.dns.name_servers_search,
            // These fields are typed as a bare string (or the literal `<<inherit>>` sentinel)
            // rather than a proper array/object + sentinel union, so — like the existing
            // redhat_management_key field — they are displayed as a plain raw string (which may
            // literally read "<<inherit>>") rather than through Utils.patchFormGroupInherited().
            // patchFormGroupInherited() decides via Utils.isInherited() and would add an
            // `_inherited` control these plain-string fields don't have.
            next_server_v4: this.system.tftp.next_server_v4,
            next_server_v6: this.system.tftp.next_server_v6,
            virt_disk_driver: this.system.virt.disk_driver,
            virt_path: this.system.virt.path,
            virt_type: this.system.virt.type,
          });
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.virt.cpus,
            'virt_cpus',
            0,
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.virt.file_size,
            'virt_file_size',
            0,
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.virt.ram,
            'virt_ram',
            0,
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.virt.auto_boot,
            'virt_auto_boot',
            false,
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.boot_loaders,
            'boot_loaders',
            bootloaders,
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.owners,
            'owners',
            [],
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.kernel_options,
            'kernel_options',
            {},
          );
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.kernel_options_post,
            'kernel_options_post',
            {},
          );
          // template_files cannot be inherited (the backend setter does not accept <<inherit>>).
          this.systemFormGroup.patchValue({
            template_files: this.system.template_files,
          });
          Utils.patchFormGroupInherited(
            this.systemFormGroup,
            this.system.autoinstall_meta,
            'autoinstall_meta',
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

  removeSystem(): void {
    this.cobblerApiService
      .remove_system(this.system.uid, this.userService.token, false)
      .subscribe({
        next: (value) => {
          if (value) {
            this.router.navigate(['/items', 'system']);
            return;
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

  editSystem(): void {
    this.isEditMode = true;
    this.systemFormGroup.enable();
    // Inherit inputs
    if (Utils.isInherited(this.system.autoinstall_meta)) {
      this.systemFormGroup.get('autoinstall_meta').disable();
    }
    if (Utils.isInherited(this.system.boot_loaders)) {
      this.systemFormGroup.get('boot_loaders').disable();
    }
    if (Utils.isInherited(this.system.kernel_options)) {
      this.systemFormGroup.get('kernel_options').disable();
    }
    if (Utils.isInherited(this.system.kernel_options_post)) {
      this.systemFormGroup.get('kernel_options_post').disable();
    }
    if (Utils.isInherited(this.system.owners)) {
      this.systemFormGroup.get('owners').disable();
    }
    if (Utils.isInherited(this.system.virt.cpus)) {
      this.systemFormGroup.get('virt_cpus').disable();
    }
    if (Utils.isInherited(this.system.virt.file_size)) {
      this.systemFormGroup.get('virt_file_size').disable();
    }
    if (Utils.isInherited(this.system.virt.ram)) {
      this.systemFormGroup.get('virt_ram').disable();
    }
    if (Utils.isInherited(this.system.virt.auto_boot)) {
      this.systemFormGroup.get('virt_auto_boot').disable();
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
      this.systemFormGroup.markAsPristine();
      this.refreshData();
    });
  }

  showAsRendered(): void {
    this.cobblerApiService
      .get_system_as_rendered(this.system.uid, this.userService.token)
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
        .get_system_handle(name)
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

  // Fields whose real backend attribute is a nested path under the system's power/virt/dns/tftp
  // sub-objects (introduced in Cobbler 4.0.0). The form control names below are kept flat for the
  // UI, but must be written back via their real nested `attribute` path in `modify_system`.
  private static readonly NESTED_ATTRIBUTE_PATHS: Record<string, string[]> = {
    power_address: ['power', 'address'],
    power_id: ['power', 'id'],
    power_pass: ['power', 'password'],
    power_type: ['power', 'type'],
    power_user: ['power', 'user'],
    power_options: ['power', 'options'],
    power_identity_file: ['power', 'identity_file'],
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

  saveSystem(): void {
    if (this.saving) {
      // A save is already in flight; a second modify/save sequence would race it on the server.
      return;
    }
    this.saving = true;
    const dirtyValues = Utils.deduplicateDirtyValues(
      this.systemFormGroup,
      Utils.getDirtyValues(this.systemFormGroup),
    );
    this.cobblerApiService
      .get_system_handle(this.name)
      .pipe(
        switchMap((systemHandle) =>
          Utils.modifySequentially(
            dirtyValues,
            (attribute, value) =>
              this.cobblerApiService.modify_system(
                systemHandle,
                SystemEditComponent.NESTED_ATTRIBUTE_PATHS[attribute] ?? [
                  attribute,
                ],
                value,
                this.userService.token,
              ),
            SystemEditComponent.MODIFY_PRIORITY,
          ).pipe(
            switchMap(() =>
              this.cobblerApiService.save_system(
                systemHandle,
                true,
                true,
                'bypass',
                this.userService.token,
              ),
            ),
          ),
        ),
        finalize(() => (this.saving = false)),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: () => {
          this.isEditMode = false;
          this.systemFormGroup.disable();
          this.systemFormGroup.markAsPristine();
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
