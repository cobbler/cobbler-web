import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, Distro } from 'cobbler-api';
import { combineLatest, forkJoin, Observable, Subject, of } from 'rxjs';
import { switchMap, map, takeUntil, debounceTime } from 'rxjs/operators';
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
import { MultiSelectStrictComponent } from '../../../common/multi-select-strict/multi-select-strict.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { TextAutocompleteComponent } from '../../../common/text-autocomplete/text-autocomplete.component';
import { HelpButtonComponent } from '../../../common/help-button/help-button.component';

@Component({
  selector: 'cobbler-distro-edit',
  imports: [
    MatIconModule,
    MatIconButton,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MultiSelectComponent,
    MultiSelectStrictComponent,
    KeyValueEditorComponent,
    MatAutocompleteModule,
    TextAutocompleteComponent,
    HelpButtonComponent,
  ],
  templateUrl: './distro-edit.component.html',
  styleUrl: './distro-edit.component.scss',
})
export class DistroEditComponent implements OnInit, OnDestroy {
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

  // Form Data
  distroReadonlyInputData: Array<CobblerInputData> = [
    ...cobblerItemReadonlyData,
    {
      formControlName: 'tree_build_time',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@distro.edit.label.tree_build_time:Tree Build Time`,
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@distro.edit.hint.tree_build_time:Timestamp of when this distribution was imported. Not meaningful for manually created distros.`,
    },
    {
      formControlName: 'remote_grub_initrd',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@distro.edit.label.remote_grub_initrd:Remote GRUB Initrd`,
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@distro.edit.hint.remote_grub_initrd:Computed GRUB-compatible URL for the remote initrd, derived from the Remote Boot Initrd field.`,
    },
    {
      formControlName: 'remote_grub_kernel',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@distro.edit.label.remote_grub_kernel:Remote GRUB Kernel`,
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@distro.edit.hint.remote_grub_kernel:Computed GRUB-compatible URL for the remote kernel, derived from the Remote Boot Kernel field.`,
    },
  ];
  distroEditableInputData: Array<CobblerInputData> = [
    ...cobblerItemEditableData,
    {
      formControlName: 'arch',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@distro.edit.label.arch:Architecture`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@distro.edit.hint.arch:CPU architecture of the distribution. Determines DHCP templates and bootloader configuration syntax.`,
    },
    {
      formControlName: 'autoinstall_meta',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@distro.edit.label.autoinstall_meta:Automatic Installation Template Metadata`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
      hint: $localize`:@@distro.edit.hint.autoinstall_meta:Key=value pairs substituted into the automatic installation template as variables before rendering. Supports <<inherit>>.`,
    },
    {
      formControlName: 'boot_files',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@distro.edit.label.boot_files:TFTP Boot Files`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
      hint: $localize`:@@distro.edit.hint.boot_files:Extra files to copy into tftpboot in addition to the kernel and initrd. Supports <<inherit>>.`,
    },
    {
      formControlName: 'boot_loaders',
      inputType: CobblerInputChoices.MULTI_SELECT_STRICT_DROPDOWN,
      label: $localize`:@@distro.edit.label.boot_loaders:Boot Loaders`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
      options: [],
      hint: $localize`:@@distro.edit.hint.boot_loaders:Bootloaders for which Cobbler generates PXE/GRUB boot entries. Supports <<inherit>>.`,
    },
    {
      formControlName: 'fetchable_files',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@distro.edit.label.fetchable_files:Fetchable Files`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
      hint: $localize`:@@distro.edit.hint.fetchable_files:Files clients can fetch via TFTP or HTTP, specified as "name=path" pairs. Supports <<inherit>>.`,
    },
    {
      formControlName: 'kernel',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@distro.edit.label.kernel:Kernel`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@distro.edit.hint.kernel:Full path to the kernel image, a filename in the configured kernel directory, or a directory containing a selectable kernel.`,
    },
    {
      formControlName: 'initrd',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@distro.edit.label.initrd:Initrd`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@distro.edit.hint.initrd:Full path to the initrd image. The filename must follow kernel naming conventions.`,
    },
    {
      formControlName: 'remote_boot_initrd',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@distro.edit.label.remote_boot_initrd:Remote Boot Initrd`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@distro.edit.hint.remote_boot_initrd:URL (tftp:// or http://) to an initrd that the bootloader fetches directly.`,
    },
    {
      formControlName: 'remote_boot_kernel',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@distro.edit.label.remote_boot_kernel:Remote Boot Kernel`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@distro.edit.hint.remote_boot_kernel:URL (tftp:// or http://) to a kernel that the bootloader fetches directly, without storing it on the Cobbler server.`,
    },
    {
      formControlName: 'kernel_options',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@distro.edit.label.kernel_options:Kernel Options`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
      hint: $localize`:@@distro.edit.hint.kernel_options:Space-delimited key=value pairs appended to the kernel command line during installation, e.g. "a=b c=d". Supports <<inherit>>.`,
    },
    {
      formControlName: 'kernel_options_post',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@distro.edit.label.kernel_options_post:Kernel Options (Post Install)`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
      hint: $localize`:@@distro.edit.hint.kernel_options_post:Space-delimited key=value pairs appended to the kernel command line after installation completes. Supports <<inherit>>.`,
    },
    {
      formControlName: 'breed',
      inputType: CobblerInputChoices.TEXT_AUTOCOMPLETE,
      label: $localize`:@@distro.edit.label.breed:Breed`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      options: [],
      hint: $localize`:@@distro.edit.hint.breed:Distribution family (e.g. redhat, debian, suse). Controls default behaviors for most Cobbler operations.`,
    },
    {
      formControlName: 'os_version',
      inputType: CobblerInputChoices.TEXT_AUTOCOMPLETE,
      label: $localize`:@@distro.edit.label.os_version:Operating System Version`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      options: [],
      hint: $localize`:@@distro.edit.hint.os_version:OS release identifier validated against distro_signatures.json (e.g. rhel9, jammy). Used for OS-specific provisioning steps.`,
    },
    {
      formControlName: 'owners',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@distro.edit.label.owners:Owners`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
      hint: $localize`:@@distro.edit.hint.owners:Cobbler user accounts allowed to manage this item. Cosmetic only — not validated against real users. Supports <<inherit>>.`,
    },
    {
      formControlName: 'redhat_management_key',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@distro.edit.label.redhat_management_key:RedHat Management Key`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@distro.edit.hint.redhat_management_key:Registration key for Red Hat management systems (Spacewalk, Uyuni, SUSE Manager). Supports <<inherit>>.`,
    },
    {
      formControlName: 'template_files',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@distro.edit.label.template_files:Template Files`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: true,
      hint: $localize`:@@distro.edit.hint.template_files:Source=destination file mappings for built-in configuration management.`,
    },
  ];

  // Form
  name: string;
  distro: Distro;
  private readonly _formBuilder = inject(FormBuilder);
  distroReadonlyFormGroup = this._formBuilder.group({});
  distroFormGroup = this._formBuilder.group({});
  isEditMode: boolean = false;

  constructor() {
    this.name = this.route.snapshot.paramMap.get('name');
    Utils.fillupItemFormGroup(
      this.distroReadonlyFormGroup,
      this.distroFormGroup,
      this.distroReadonlyInputData,
      this.distroEditableInputData,
    );
  }

  ngOnInit(): void {
    this.refreshData();

    // Observables for inherited properties
    this.distroFormGroup
      .get('autoinstall_meta_inherited')
      ?.valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('autoinstall_meta')),
      );
    this.distroFormGroup
      .get('autoinstall_meta_inherited')
      ?.valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('autoinstall_meta')),
      );
    this.distroFormGroup
      .get('boot_files_inherited')
      ?.valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('boot_files')),
      );
    this.distroFormGroup
      .get('boot_loaders_inherited')
      ?.valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('boot_loaders')),
      );
    this.distroFormGroup
      .get('fetchable_files_inherited')
      ?.valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('fetchable_files')),
      );
    this.distroFormGroup
      .get('kernel_options_inherited')
      ?.valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('kernel_options')),
      );
    this.distroFormGroup
      .get('kernel_options_post_inherited')
      ?.valueChanges.subscribe(
        this.getInheritObservable(
          this.distroFormGroup.get('kernel_options_post'),
        ),
      );
    this.distroFormGroup
      .get('owners_inherited')
      ?.valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('owners')),
      );
    this.distroFormGroup
      .get('template_files_inherited')
      ?.valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('template_files')),
      );
    this.distroFormGroup
      .get('breed')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((breed: string) => {
          const validBreeds =
            (this.distroEditableInputData.find(
              (d) => d.formControlName === 'breed',
            )?.options as string[]) ?? [];

          // If invalid breed, don't contact the API
          if (!validBreeds.includes(breed)) {
            return of([] as string[]);
          }

          return this.cobblerApiService.get_valid_os_versions_for_breed(
            breed,
            this.userService.token,
          );
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((osVersions) => {
        const osVersionInput = this.distroEditableInputData.find(
          (d) => d.formControlName === 'os_version',
        );
        if (osVersionInput) {
          osVersionInput.options = [...osVersions]; // New link to array;
        }
      });
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

  refreshData(): void {
    this.cobblerApiService
      .get_distro(this.name, false, false, this.userService.token)
      .pipe(
        switchMap((distro) => {
          return forkJoin({
            bootloaders: this.cobblerApiService.get_valid_distro_bootloaders(
              distro.name,
              this.userService.token,
            ),
            mgmt_classes: this.cobblerApiService.get_item_names('mgmtclass'),
            breeds: this.cobblerApiService.get_valid_breeds(
              this.userService.token,
            ),
          }).pipe(
            map(({ bootloaders, mgmt_classes, breeds }) => ({
              distro,
              bootloaders,
              mgmt_classes,
              breeds,
            })),
          );
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: ({ distro, bootloaders, mgmt_classes, breeds }) => {
          this.distro = distro;

          const bootloadersInput = this.distroEditableInputData.find(
            (d) => d.formControlName === 'boot_loaders',
          );
          const mgmtClassesInput = this.distroEditableInputData.find(
            (m) => m.formControlName === 'mgmt_classes',
          );
          const breedsInput = this.distroEditableInputData.find(
            (b) => b.formControlName === 'breed',
          );

          // Set the inputs to their form cotrol's options array
          if (bootloadersInput && mgmtClassesInput && breedsInput) {
            bootloadersInput.options = bootloaders;
            mgmtClassesInput.options = mgmt_classes;
            breedsInput.options = breeds;
          }

          this.distroReadonlyFormGroup.patchValue({
            name: this.distro.name,
            uid: this.distro.uid,
            mtime: Utils.floatToDate(this.distro.mtime).toString(),
            ctime: Utils.floatToDate(this.distro.ctime).toString(),
            depth: this.distro.depth,
            is_subobject: this.distro.is_subobject,
            tree_build_time: Utils.floatToDate(
              this.distro.tree_build_time,
            ).toString(),
            remote_grub_initrd: this.distro.remote_grub_initrd,
            remote_grub_kernel: this.distro.remote_grub_kernel,
          });
          this.distroFormGroup.patchValue({
            arch: this.distro.arch,
            breed: this.distro.breed,
            comment: this.distro.comment,
            kernel: this.distro.kernel,
            initrd: this.distro.initrd,
            remote_boot_kernel: this.distro.remote_boot_kernel,
            remote_boot_initrd: this.distro.remote_boot_initrd,
            os_version: this.distro.os_version,
            redhat_management_key: this.distro.redhat_management_key,
          });
          Utils.patchFormGroupInherited(
            this.distroFormGroup,
            this.distro.boot_loaders,
            'boot_loaders',
            bootloaders,
          );
          Utils.patchFormGroupInherited(
            this.distroFormGroup,
            this.distro.owners,
            'owners',
            [],
          );
          Utils.patchFormGroupInherited(
            this.distroFormGroup,
            this.distro.autoinstall_meta,
            'autoinstall_meta',
            new Map(),
          );
          Utils.patchFormGroupInherited(
            this.distroFormGroup,
            this.distro.fetchable_files,
            'fetchable_files',
            new Map(),
          );
          Utils.patchFormGroupInherited(
            this.distroFormGroup,
            this.distro.kernel_options,
            'kernel_options',
            new Map(),
          );
          Utils.patchFormGroupInherited(
            this.distroFormGroup,
            this.distro.kernel_options_post,
            'kernel_options_post',
            new Map(),
          );
          Utils.patchFormGroupInherited(
            this.distroFormGroup,
            this.distro.template_files,
            'template_files',
            new Map(),
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

  removeDistro(): void {
    this.cobblerApiService
      .remove_distro(this.name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this.router.navigate(['/items', 'distro']);
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

  editDistro(): void {
    this.isEditMode = true;
    this.distroFormGroup.enable();
    // Inherit inputs
    if (typeof this.distro.autoinstall_meta === 'string') {
      this.distroFormGroup.get('autoinstall_meta').disable();
    }
    if (typeof this.distro.boot_files === 'string') {
      this.distroFormGroup.get('boot_files').disable();
    }
    if (typeof this.distro.boot_loaders === 'string') {
      this.distroFormGroup.get('boot_loaders').disable();
    }
    if (typeof this.distro.fetchable_files === 'string') {
      this.distroFormGroup.get('fetchable_files').disable();
    }
    if (typeof this.distro.kernel_options === 'string') {
      this.distroFormGroup.get('kernel_options').disable();
    }
    if (typeof this.distro.kernel_options_post === 'string') {
      this.distroFormGroup.get('kernel_options_post').disable();
    }
    if (typeof this.distro.owners === 'string') {
      this.distroFormGroup.get('owners').disable();
    }
    if (typeof this.distro.template_files === 'string') {
      this.distroFormGroup.get('template_files').disable();
    }
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmCancelEditComponent, {
      data: {
        name: this.distro.name,
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === false) {
        // False means the user want's to continue
        return;
      }
      this.isEditMode = false;
      this.distroFormGroup.disable();
      this.refreshData();
    });
  }

  showAsRendered(): void {
    this.cobblerApiService
      .get_distro_as_rendered(this.distro.name, this.userService.token)
      .subscribe((value) => {
        this.dialog.open(DialogBoxItemRenderedComponent, {
          data: {
            itemType: 'Distro',
            uid: this.distro.uid,
            name: this.distro.name,
            renderedData: value,
          },
        });
      });
  }

  copyDistro(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemCopyComponent, {
      data: {
        itemType: 'Distro',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the distro
        return;
      }
      this.cobblerApiService
        .get_distro_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (distroHandle) => {
            this.cobblerApiService
              .copy_distro(distroHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.router.navigate(['/items', 'distro', newItemName]);
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

  saveDistro(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.distroFormGroup,
      Utils.getDirtyValues(this.distroFormGroup),
    );
    this.cobblerApiService
      .get_distro_handle(this.name, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (distroHandle) => {
          let modifyObservables: Observable<boolean>[] = [];
          dirtyValues.forEach((value, key) => {
            modifyObservables.push(
              this.cobblerApiService.modify_distro(
                distroHandle,
                key,
                value,
                this.userService.token,
              ),
            );
          });
          combineLatest(modifyObservables).subscribe({
            next: () => {
              this.cobblerApiService
                .save_distro(distroHandle, this.userService.token)
                .subscribe({
                  next: () => {
                    this.isEditMode = false;
                    this.distroFormGroup.disable();
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
