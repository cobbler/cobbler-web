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
import { CobblerApiService, System } from 'cobbler-api';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';

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
    KeyValueEditorComponent,
  ],
  templateUrl: './system-edit.component.html',
  styleUrl: './system-edit.component.scss',
})
export class SystemEditComponent implements OnInit {
  name: string;
  system: System;
  private readonly _formBuilder = inject(FormBuilder);
  systemFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: true }),
    uid: new FormControl({ value: '', disabled: true }),
    mtime: new FormControl({ value: '', disabled: true }),
    ctime: new FormControl({ value: '', disabled: true }),
    depth: new FormControl({ value: 0, disabled: true }),
    virt_cpus: new FormControl({ value: 0, disabled: true }),
    virt_file_size: new FormControl({ value: 0, disabled: true }),
    virt_ram: new FormControl({ value: 0, disabled: true }),
    serial_device: new FormControl({ value: 0, disabled: true }),
    serial_baud_rate: new FormControl({ value: 0, disabled: true }),
    is_subobject: new FormControl({ value: false, disabled: true }),
    comment: new FormControl({ value: '', disabled: true }),
    redhat_management_key: new FormControl({ value: '', disabled: true }),
    autoinstall: new FormControl({ value: '', disabled: true }),
    parent: new FormControl({ value: '', disabled: true }),
    gateway: new FormControl({ value: '', disabled: true }),
    hostname: new FormControl({ value: '', disabled: true }),
    image: new FormControl({ value: '', disabled: true }),
    ipv6_default_device: new FormControl({ value: '', disabled: true }),
    next_server_v4: new FormControl({ value: '', disabled: true }),
    next_server_v6: new FormControl({ value: '', disabled: true }),
    filename: new FormControl({ value: '', disabled: true }),
    power_address: new FormControl({ value: '', disabled: true }),
    power_id: new FormControl({ value: '', disabled: true }),
    power_pass: new FormControl({ value: '', disabled: true }),
    power_type: new FormControl({ value: '', disabled: true }),
    power_user: new FormControl({ value: '', disabled: true }),
    power_options: new FormControl({ value: '', disabled: true }),
    power_identity_file: new FormControl({ value: '', disabled: true }),
    profile: new FormControl({ value: '', disabled: true }),
    proxy: new FormControl({ value: '', disabled: true }),
    server: new FormControl({ value: '', disabled: true }),
    status: new FormControl({ value: '', disabled: true }),
    virt_disk_driver: new FormControl({ value: '', disabled: true }),
    virt_path: new FormControl({ value: '', disabled: true }),
    virt_type: new FormControl({ value: '', disabled: true }),
    boot_loaders: new FormControl({ value: [], disabled: true }),
    bootloader_inherited: new FormControl({ value: false, disabled: true }),
    ipv6_autoconfiguration: new FormControl({ value: false, disabled: true }),
    repos_enabled: new FormControl({ value: false, disabled: true }),
    netboot_enabled: new FormControl({ value: false, disabled: true }),
    virt_auto_boot: new FormControl({ value: false, disabled: true }),
    virt_pxe_boot: new FormControl({ value: false, disabled: true }),
    owners: new FormControl({ value: [], disabled: true }),
    owners_inherited: new FormControl({ value: false, disabled: true }),
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
    template_files: new FormControl({ value: {}, disabled: true }),
    template_files_inherited: new FormControl({ value: false, disabled: true }),
    autoinstall_meta: new FormControl({ value: {}, disabled: true }),
    autoinstall_meta_inherited: new FormControl({
      value: false,
      disabled: true,
    }),
    name_servers: new FormControl({ value: [], disabled: true }),
    name_servers_search: new FormControl({ value: [], disabled: true }),
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
      .get_system(this.name, false, false, this.userService.token)
      .subscribe(
        (value) => {
          this.system = value;
          this.systemFormGroup.controls.name.setValue(this.system.name);
          this.systemFormGroup.controls.uid.setValue(this.system.uid);
          this.systemFormGroup.controls.mtime.setValue(
            new Date(this.system.mtime * 1000).toString(),
          );
          this.systemFormGroup.controls.ctime.setValue(
            new Date(this.system.ctime * 1000).toString(),
          );
          this.systemFormGroup.controls.depth.setValue(this.system.depth);
          if (typeof this.system.virt_cpus !== 'string') {
            this.systemFormGroup.controls.virt_cpus.setValue(
              this.system.virt_cpus,
            );
          }
          if (typeof this.system.virt_file_size !== 'string') {
            this.systemFormGroup.controls.virt_file_size.setValue(
              this.system.virt_file_size,
            );
          }
          if (typeof this.system.virt_ram !== 'string') {
            this.systemFormGroup.controls.virt_ram.setValue(
              this.system.virt_ram,
            );
          }
          this.systemFormGroup.controls.serial_device.setValue(
            this.system.serial_device,
          );
          this.systemFormGroup.controls.serial_baud_rate.setValue(
            this.system.serial_baud_rate,
          );
          this.systemFormGroup.controls.is_subobject.setValue(
            this.system.is_subobject,
          );
          this.systemFormGroup.controls.ipv6_autoconfiguration.setValue(
            this.system.ipv6_autoconfiguration,
          );
          this.systemFormGroup.controls.repos_enabled.setValue(
            this.system.repos_enabled,
          );
          this.systemFormGroup.controls.netboot_enabled.setValue(
            this.system.netboot_enabled,
          );
          if (typeof this.system.virt_auto_boot !== 'string') {
            // TODO: Show inheritance if string
            this.systemFormGroup.controls.virt_auto_boot.setValue(
              this.system.virt_auto_boot,
            );
          }
          this.systemFormGroup.controls.virt_pxe_boot.setValue(
            this.system.virt_pxe_boot,
          );
          this.systemFormGroup.controls.redhat_management_key.setValue(
            this.system.redhat_management_key,
          );
          this.systemFormGroup.controls.autoinstall.setValue(
            this.system.autoinstall,
          );
          this.systemFormGroup.controls.parent.setValue(this.system.parent);
          this.systemFormGroup.controls.gateway.setValue(this.system.gateway);
          this.systemFormGroup.controls.hostname.setValue(this.system.hostname);
          this.systemFormGroup.controls.image.setValue(this.system.image);
          this.systemFormGroup.controls.ipv6_default_device.setValue(
            this.system.ipv6_default_device,
          );
          this.systemFormGroup.controls.next_server_v4.setValue(
            this.system.next_server_v4,
          );
          this.systemFormGroup.controls.next_server_v6.setValue(
            this.system.next_server_v6,
          );
          this.systemFormGroup.controls.filename.setValue(this.system.filename);
          this.systemFormGroup.controls.power_address.setValue(
            this.system.power_address,
          );
          this.systemFormGroup.controls.power_id.setValue(this.system.power_id);
          this.systemFormGroup.controls.power_pass.setValue(
            this.system.power_pass,
          );
          this.systemFormGroup.controls.power_type.setValue(
            this.system.power_type,
          );
          this.systemFormGroup.controls.power_user.setValue(
            this.system.power_user,
          );
          this.systemFormGroup.controls.power_options.setValue(
            this.system.power_options,
          );
          this.systemFormGroup.controls.power_identity_file.setValue(
            this.system.power_identity_file,
          );
          this.systemFormGroup.controls.profile.setValue(this.system.profile);
          this.systemFormGroup.controls.proxy.setValue(this.system.proxy);
          this.systemFormGroup.controls.server.setValue(this.system.server);
          this.systemFormGroup.controls.status.setValue(this.system.status);
          this.systemFormGroup.controls.virt_disk_driver.setValue(
            this.system.virt_disk_driver,
          );
          this.systemFormGroup.controls.virt_path.setValue(
            this.system.virt_path,
          );
          this.systemFormGroup.controls.virt_type.setValue(
            this.system.virt_type,
          );
          this.systemFormGroup.controls.name_servers.setValue(
            this.system.name_servers,
          );
          this.systemFormGroup.controls.name_servers_search.setValue(
            this.system.name_servers_search,
          );
          if (typeof this.system.boot_loaders === 'string') {
            this.systemFormGroup.controls.bootloader_inherited.setValue(true);
          } else {
            this.systemFormGroup.controls.bootloader_inherited.setValue(false);
            this.systemFormGroup.controls.boot_loaders.setValue(
              this.system.boot_loaders,
            );
          }
          if (typeof this.system.owners === 'string') {
            this.systemFormGroup.controls.owners_inherited.setValue(true);
          } else {
            this.systemFormGroup.controls.owners_inherited.setValue(false);
            this.systemFormGroup.controls.owners.setValue(this.system.owners);
          }
          if (typeof this.system.boot_files === 'string') {
            this.systemFormGroup.controls.boot_files_inherited.setValue(true);
          } else {
            this.systemFormGroup.controls.boot_files_inherited.setValue(false);
            this.systemFormGroup.controls.boot_files.setValue(
              this.system.boot_files,
            );
          }
          if (typeof this.system.fetchable_files === 'string') {
            this.systemFormGroup.controls.fetchable_files_inherited.setValue(
              true,
            );
          } else {
            this.systemFormGroup.controls.fetchable_files_inherited.setValue(
              false,
            );
            this.systemFormGroup.controls.fetchable_files.setValue(
              this.system.fetchable_files,
            );
          }
          if (typeof this.system.kernel_options === 'string') {
            this.systemFormGroup.controls.kernel_options_inherited.setValue(
              true,
            );
          } else {
            this.systemFormGroup.controls.kernel_options_inherited.setValue(
              false,
            );
            this.systemFormGroup.controls.kernel_options.setValue(
              this.system.kernel_options,
            );
          }
          if (typeof this.system.kernel_options_post === 'string') {
            this.systemFormGroup.controls.kernel_options_post_inherited.setValue(
              true,
            );
          } else {
            this.systemFormGroup.controls.kernel_options_post_inherited.setValue(
              false,
            );
            this.systemFormGroup.controls.kernel_options_post.setValue(
              this.system.kernel_options_post,
            );
          }
          if (typeof this.system.mgmt_classes === 'string') {
            this.systemFormGroup.controls.mgmt_classes_inherited.setValue(true);
          } else {
            this.systemFormGroup.controls.mgmt_classes_inherited.setValue(
              false,
            );
            this.systemFormGroup.controls.mgmt_classes.setValue(
              this.system.mgmt_classes,
            );
          }
          if (typeof this.system.mgmt_parameters === 'string') {
            this.systemFormGroup.controls.mgmt_parameters_inherited.setValue(
              true,
            );
          } else {
            this.systemFormGroup.controls.mgmt_parameters_inherited.setValue(
              false,
            );
            this.systemFormGroup.controls.mgmt_parameters.setValue(
              this.system.mgmt_parameters,
            );
          }
          if (typeof this.system.template_files === 'string') {
            this.systemFormGroup.controls.template_files_inherited.setValue(
              true,
            );
          } else {
            this.systemFormGroup.controls.template_files_inherited.setValue(
              false,
            );
            this.systemFormGroup.controls.template_files.setValue(
              this.system.template_files,
            );
          }
          if (typeof this.system.autoinstall_meta === 'string') {
            this.systemFormGroup.controls.autoinstall_meta_inherited.setValue(
              true,
            );
          } else {
            this.systemFormGroup.controls.autoinstall_meta_inherited.setValue(
              false,
            );
            this.systemFormGroup.controls.autoinstall_meta.setValue(
              this.system.autoinstall_meta,
            );
          }
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }

  removeSystem(): void {
    this.cobblerApiService
      .remove_system(this.name, this.userService.token, false)
      .subscribe(
        (value) => {
          if (value) {
            this.router.navigate(['/items', 'system']);
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

  editSystem(): void {
    // TODO
    this._snackBar.open('Not implemented at the moment!', 'Close');
  }

  copySystem(): void {
    this.cobblerApiService
      .copy_system('', '', this.userService.token)
      .subscribe(
        (value) => {
          // TODO
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }

  saveSystem(): void {
    // TODO
  }

  get systemOwners(): string[] {
    if (this.system && this.system.owners) {
      const ownersResult = this.system.owners;
      if (typeof ownersResult !== 'string') {
        return ownersResult;
      }
    }
    return [];
  }

  get systemAutoinstallMeta(): object {
    if (this.system && this.system.autoinstall_meta) {
      const autoinstallMetaResult = this.system.autoinstall_meta;
      if (typeof autoinstallMetaResult !== 'string') {
        return autoinstallMetaResult;
      }
    }
    return {};
  }

  get systemKernelOptions(): object {
    if (this.system && this.system.boot_files) {
      const kernelOptionsResult = this.system.boot_files;
      if (typeof kernelOptionsResult !== 'string') {
        return kernelOptionsResult;
      }
    }
    return {};
  }

  get systemKernelOptionsPost(): object {
    if (this.system && this.system.boot_files) {
      const kernelOptionsPost = this.system.boot_files;
      if (typeof kernelOptionsPost !== 'string') {
        return kernelOptionsPost;
      }
    }
    return {};
  }

  get systemBootFiles(): object {
    if (this.system && this.system.boot_files) {
      const bootFilesResult = this.system.boot_files;
      if (typeof bootFilesResult !== 'string') {
        return bootFilesResult;
      }
    }
    return {};
  }

  get systemFetchableFiles(): object {
    if (this.system && this.system.fetchable_files) {
      const fetchableFilesResult = this.system.fetchable_files;
      if (typeof fetchableFilesResult !== 'string') {
        return fetchableFilesResult;
      }
    }
    return {};
  }

  get systemMgmtParameters(): object {
    if (this.system && this.system.mgmt_parameters) {
      const mgmtParametersResult = this.system.mgmt_parameters;
      if (typeof mgmtParametersResult !== 'string') {
        return mgmtParametersResult;
      }
    }
    return {};
  }

  get systemTemplateFiles(): object {
    if (this.system && this.system.template_files) {
      const templateFilesResult = this.system.template_files;
      if (typeof templateFilesResult !== 'string') {
        return templateFilesResult;
      }
    }
    return {};
  }
}
