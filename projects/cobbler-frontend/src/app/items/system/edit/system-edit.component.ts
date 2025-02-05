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
import { CobblerApiService, System } from 'cobbler-api';
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
    FormsModule,
    MatButton,
    MatCheckbox,
    MatFormField,
    MatIconModule,
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
export class SystemEditComponent implements OnInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  name: string;
  system: System;
  private readonly _formBuilder = inject(FormBuilder);
  systemReadonlyFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: false }),
    uid: new FormControl({ value: '', disabled: false }),
    mtime: new FormControl({ value: '', disabled: false }),
    ctime: new FormControl({ value: '', disabled: false }),
    depth: new FormControl({ value: 0, disabled: false }),
    is_subobject: new FormControl({ value: false, disabled: false }),
  });
  systemFormGroup = this._formBuilder.group({
    virt_cpus: new FormControl({ value: 0, disabled: true }),
    virt_file_size: new FormControl({ value: 0, disabled: true }),
    virt_ram: new FormControl({ value: 0, disabled: true }),
    serial_device: new FormControl({ value: 0, disabled: true }),
    serial_baud_rate: new FormControl({ value: 0, disabled: true }),
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
    boot_loaders_inherited: new FormControl({ value: false, disabled: true }),
    ipv6_autoconfiguration: new FormControl({ value: false, disabled: true }),
    repos_enabled: new FormControl({ value: false, disabled: true }),
    netboot_enabled: new FormControl({ value: false, disabled: true }),
    virt_auto_boot: new FormControl({ value: false, disabled: true }),
    virt_pxe_boot: new FormControl({ value: false, disabled: true }),
    owners: new FormControl({ value: [], disabled: true }),
    owners_inherited: new FormControl({ value: false, disabled: true }),
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
    template_files: new FormControl({ value: new Map(), disabled: true }),
    template_files_inherited: new FormControl({ value: false, disabled: true }),
    autoinstall_meta: new FormControl({ value: new Map(), disabled: true }),
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
    @Inject(MatDialog) readonly dialog: MatDialog,
  ) {
    this.name = this.route.snapshot.paramMap.get('name');
  }

  ngOnInit(): void {
    this.refreshData();
    // Observables for inherited properties
    this.systemFormGroup.controls.autoinstall_meta_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.systemFormGroup.controls.autoinstall_meta),
    );
    this.systemFormGroup.controls.boot_files_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.systemFormGroup.controls.boot_files),
    );
    this.systemFormGroup.controls.boot_loaders_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.systemFormGroup.controls.boot_loaders),
    );
    this.systemFormGroup.controls.fetchable_files_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.systemFormGroup.controls.fetchable_files),
    );
    this.systemFormGroup.controls.kernel_options_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.systemFormGroup.controls.kernel_options),
    );
    this.systemFormGroup.controls.kernel_options_post_inherited.valueChanges.subscribe(
      this.getInheritObservable(
        this.systemFormGroup.controls.kernel_options_post,
      ),
    );
    this.systemFormGroup.controls.mgmt_classes_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.systemFormGroup.controls.mgmt_classes),
    );
    this.systemFormGroup.controls.mgmt_parameters_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.systemFormGroup.controls.mgmt_parameters),
    );
    this.systemFormGroup.controls.owners_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.systemFormGroup.controls.owners),
    );
    this.systemFormGroup.controls.template_files_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.systemFormGroup.controls.template_files),
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
    this.router.navigate(['/items', 'system', this.name, 'autoinstall']);
  }

  refreshData(): void {
    this.cobblerApiService
      .get_system(this.name, false, false, this.userService.token)
      .subscribe(
        (value) => {
          this.system = value;
          this.systemReadonlyFormGroup.controls.name.setValue(this.system.name);
          this.systemReadonlyFormGroup.controls.uid.setValue(this.system.uid);
          this.systemReadonlyFormGroup.controls.mtime.setValue(
            new Date(this.system.mtime * 1000).toString(),
          );
          this.systemReadonlyFormGroup.controls.ctime.setValue(
            new Date(this.system.ctime * 1000).toString(),
          );
          this.systemReadonlyFormGroup.controls.depth.setValue(
            this.system.depth,
          );
          this.systemReadonlyFormGroup.controls.is_subobject.setValue(
            this.system.is_subobject,
          );
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
            this.systemFormGroup.controls.boot_loaders_inherited.setValue(true);
            this.systemFormGroup.controls.boot_loaders.setValue([
              'ipxe',
              'grub',
              'pxe',
            ]);
          } else {
            this.systemFormGroup.controls.boot_loaders_inherited.setValue(
              false,
            );
            this.systemFormGroup.controls.boot_loaders.setValue(
              this.system.boot_loaders,
            );
          }
          if (typeof this.system.owners === 'string') {
            this.systemFormGroup.controls.owners_inherited.setValue(true);
            this.systemFormGroup.controls.owners.setValue([]);
          } else {
            this.systemFormGroup.controls.owners_inherited.setValue(false);
            this.systemFormGroup.controls.owners.setValue(this.system.owners);
          }
          if (typeof this.system.boot_files === 'string') {
            this.systemFormGroup.controls.boot_files_inherited.setValue(true);
            this.systemFormGroup.controls.boot_files.setValue(new Map());
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
            this.systemFormGroup.controls.kernel_options.setValue(new Map());
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
            this.systemFormGroup.controls.kernel_options_post.setValue(
              new Map(),
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
            this.systemFormGroup.controls.mgmt_classes.setValue([]);
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
            this.systemFormGroup.controls.mgmt_parameters.setValue(new Map());
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
            this.systemFormGroup.controls.template_files.setValue(new Map());
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
            this.systemFormGroup.controls.autoinstall_meta.setValue(new Map());
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
    this.isEditMode = true;
    this.systemFormGroup.enable();
    // Inherit inputs
    if (typeof this.system.autoinstall_meta === 'string') {
      this.systemFormGroup.controls.autoinstall_meta.disable();
    }
    if (typeof this.system.boot_files === 'string') {
      this.systemFormGroup.controls.boot_files.disable();
    }
    if (typeof this.system.boot_loaders === 'string') {
      this.systemFormGroup.controls.boot_loaders.disable();
    }
    if (typeof this.system.fetchable_files === 'string') {
      this.systemFormGroup.controls.fetchable_files.disable();
    }
    if (typeof this.system.kernel_options === 'string') {
      this.systemFormGroup.controls.kernel_options.disable();
    }
    if (typeof this.system.kernel_options_post === 'string') {
      this.systemFormGroup.controls.kernel_options_post.disable();
    }
    if (typeof this.system.mgmt_classes === 'string') {
      this.systemFormGroup.controls.mgmt_classes.disable();
    }
    if (typeof this.system.mgmt_parameters === 'string') {
      this.systemFormGroup.controls.mgmt_parameters.disable();
    }
    if (typeof this.system.owners === 'string') {
      this.systemFormGroup.controls.owners.disable();
    }
    if (typeof this.system.template_files === 'string') {
      this.systemFormGroup.controls.template_files.disable();
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
        const dialogRef = this.dialog.open(DialogBoxItemRenderedComponent, {
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
                next: (value) => {
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
            next: (value) => {
              this.cobblerApiService
                .save_system(systemHandle, this.userService.token)
                .subscribe({
                  next: (value1) => {
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
