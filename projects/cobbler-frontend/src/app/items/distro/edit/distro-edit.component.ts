import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
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
    KeyValueEditorComponent,
  ],
  templateUrl: './distro-edit.component.html',
  styleUrl: './distro-edit.component.scss',
})
export class DistroEditComponent implements OnInit, OnDestroy {
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
      label: 'Tree Build Time',
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'remote_grub_initrd',
      inputType: CobblerInputChoices.TEXT,
      label: 'Remote GRUB Initrd',
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'remote_grub_kernel',
      inputType: CobblerInputChoices.TEXT,
      label: 'Remote GRUB Kernel',
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
    },
  ];
  distroEditableInputData: Array<CobblerInputData> = [
    ...cobblerItemEditableData,
    {
      formControlName: 'arch',
      inputType: CobblerInputChoices.TEXT,
      label: 'Architecture',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
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
      formControlName: 'boot_loaders',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'Boot Loaders',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
    },
    {
      formControlName: 'breed',
      inputType: CobblerInputChoices.TEXT,
      label: 'Breed',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
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
      formControlName: 'kernel',
      inputType: CobblerInputChoices.TEXT,
      label: 'Kernel',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'initrd',
      inputType: CobblerInputChoices.TEXT,
      label: 'Initrd',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'remote_boot_initrd',
      inputType: CobblerInputChoices.TEXT,
      label: 'Remote Boot Initrd',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'remote_boot_kernel',
      inputType: CobblerInputChoices.TEXT,
      label: 'Remote Boot Kernel',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
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
      formControlName: 'os_version',
      inputType: CobblerInputChoices.TEXT,
      label: 'Operating System Version',
      disabled: true,
      readonly: false,
      defaultValue: '',
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
      formControlName: 'redhat_management_key',
      inputType: CobblerInputChoices.TEXT,
      label: 'RedHat Management Key',
      disabled: true,
      readonly: false,
      defaultValue: '',
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
  distro: Distro;
  private readonly _formBuilder = inject(FormBuilder);
  distroReadonlyFormGroup = this._formBuilder.group({});
  distroFormGroup = this._formBuilder.group({});
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
    this.distroReadonlyInputData.forEach((value) => {
      this.distroReadonlyFormGroup.addControl(
        value.formControlName,
        new FormControl({
          value: value.defaultValue,
          disabled: value.disabled,
        }),
      );
      if (value.inherited) {
        this.distroReadonlyFormGroup.addControl(
          value.formControlName + '_inherited',
          new FormControl({
            value: false,
            disabled: value.disabled,
          }),
        );
      }
    });
    this.distroEditableInputData.forEach((value) => {
      this.distroFormGroup.addControl(
        value.formControlName,
        new FormControl({
          value: value.defaultValue,
          disabled: value.disabled,
        }),
      );
      if (value.inherited) {
        this.distroFormGroup.addControl(
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
    this.distroFormGroup
      .get('autoinstall_meta_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('autoinstall_meta')),
      );
    this.distroFormGroup
      .get('autoinstall_meta_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('autoinstall_meta')),
      );
    this.distroFormGroup
      .get('boot_files_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('boot_files')),
      );
    this.distroFormGroup
      .get('boot_loaders_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('boot_loaders')),
      );
    this.distroFormGroup
      .get('fetchable_files_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('fetchable_files')),
      );
    this.distroFormGroup
      .get('kernel_options_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('kernel_options')),
      );
    this.distroFormGroup
      .get('kernel_options_post_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(
          this.distroFormGroup.get('kernel_options_post'),
        ),
      );
    this.distroFormGroup
      .get('mgmt_classes_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('mgmt_classes')),
      );
    this.distroFormGroup
      .get('owners_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('owners')),
      );
    this.distroFormGroup
      .get('template_files_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.distroFormGroup.get('template_files')),
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

  refreshData(): void {
    this.cobblerApiService
      .get_distro(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.distro = value;
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
            ['ipxe', 'grub', 'pxe'],
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
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
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
    if (typeof this.distro.mgmt_classes === 'string') {
      this.distroFormGroup.get('mgmt_classes').disable();
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
