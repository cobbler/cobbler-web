import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import {
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
import Utils from '../../../utils';

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
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  name: string;
  distro: Distro;
  private readonly _formBuilder = inject(FormBuilder);
  distroReadonlyFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: false }),
    uid: new FormControl({ value: '', disabled: false }),
    mtime: new FormControl({ value: '', disabled: false }),
    ctime: new FormControl({ value: '', disabled: false }),
    depth: new FormControl({ value: 0, disabled: false }),
    is_subobject: new FormControl({ value: false, disabled: false }),
    tree_build_time: new FormControl({ value: '', disabled: false }),
    remote_grub_initrd: new FormControl({ value: '', disabled: false }),
    remote_grub_kernel: new FormControl({ value: '', disabled: false }),
  });
  distroFormGroup = this._formBuilder.group({
    arch: new FormControl({ value: '', disabled: true }),
    breed: new FormControl({ value: '', disabled: true }),
    comment: new FormControl({ value: '', disabled: true }),
    kernel: new FormControl({ value: '', disabled: true }),
    initrd: new FormControl({ value: '', disabled: true }),
    remote_boot_initrd: new FormControl({ value: '', disabled: true }),
    remote_boot_kernel: new FormControl({ value: '', disabled: true }),
    os_version: new FormControl({ value: '', disabled: true }),
    redhat_management_key: new FormControl({ value: '', disabled: true }),
    boot_loaders: new FormControl({ value: [], disabled: true }),
    boot_loaders_inherited: new FormControl({ value: false, disabled: true }),
    owners: new FormControl({ value: [], disabled: true }),
    owners_inherited: new FormControl({ value: false, disabled: true }),
    mgmt_classes: new FormControl({ value: [], disabled: true }),
    mgmt_classes_inherited: new FormControl({ value: false, disabled: true }),
    autoinstall_meta: new FormControl({
      value: new Map<string, any>(),
      disabled: true,
    }),
    autoinstall_meta_inherited: new FormControl({
      value: false,
      disabled: true,
    }),
    boot_files: new FormControl({
      value: new Map<string, any>(),
      disabled: true,
    }),
    boot_files_inherited: new FormControl({ value: false, disabled: true }),
    fetchable_files: new FormControl({
      value: new Map<string, any>(),
      disabled: true,
    }),
    fetchable_files_inherited: new FormControl({
      value: false,
      disabled: true,
    }),
    kernel_options: new FormControl({
      value: new Map<string, any>(),
      disabled: true,
    }),
    kernel_options_inherited: new FormControl({ value: false, disabled: true }),
    kernel_options_post: new FormControl({
      value: new Map<string, any>(),
      disabled: true,
    }),
    kernel_options_post_inherited: new FormControl({
      value: false,
      disabled: true,
    }),
    template_files: new FormControl({
      value: new Map<string, any>(),
      disabled: true,
    }),
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
    this.distroFormGroup.controls.autoinstall_meta_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.distroFormGroup.controls.autoinstall_meta),
    );
    this.distroFormGroup.controls.boot_files_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.distroFormGroup.controls.boot_files),
    );
    this.distroFormGroup.controls.boot_loaders_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.distroFormGroup.controls.boot_loaders),
    );
    this.distroFormGroup.controls.fetchable_files_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.distroFormGroup.controls.fetchable_files),
    );
    this.distroFormGroup.controls.kernel_options_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.distroFormGroup.controls.kernel_options),
    );
    this.distroFormGroup.controls.kernel_options_post_inherited.valueChanges.subscribe(
      this.getInheritObservable(
        this.distroFormGroup.controls.kernel_options_post,
      ),
    );
    this.distroFormGroup.controls.mgmt_classes_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.distroFormGroup.controls.mgmt_classes),
    );
    this.distroFormGroup.controls.owners_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.distroFormGroup.controls.owners),
    );
    this.distroFormGroup.controls.template_files_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.distroFormGroup.controls.template_files),
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

  refreshData(): void {
    this.cobblerApiService
      .get_distro(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          this.distro = value;
          this.distroReadonlyFormGroup.controls.name.setValue(this.distro.name);
          this.distroReadonlyFormGroup.controls.uid.setValue(this.distro.uid);
          this.distroReadonlyFormGroup.controls.mtime.setValue(
            Utils.floatToDate(this.distro.mtime).toString(),
          );
          this.distroReadonlyFormGroup.controls.ctime.setValue(
            Utils.floatToDate(this.distro.ctime).toString(),
          );
          this.distroReadonlyFormGroup.controls.depth.setValue(
            this.distro.depth,
          );
          this.distroFormGroup.controls.arch.setValue(this.distro.arch);
          this.distroReadonlyFormGroup.controls.is_subobject.setValue(
            this.distro.is_subobject,
          );
          this.distroReadonlyFormGroup.controls.tree_build_time.setValue(
            Utils.floatToDate(this.distro.tree_build_time).toString(),
          );
          this.distroReadonlyFormGroup.controls.remote_grub_initrd.setValue(
            this.distro.remote_grub_initrd,
          );
          this.distroReadonlyFormGroup.controls.remote_grub_kernel.setValue(
            this.distro.remote_grub_kernel,
          );

          this.distroFormGroup.controls.breed.setValue(this.distro.breed);
          this.distroFormGroup.controls.comment.setValue(this.distro.comment);
          this.distroFormGroup.controls.kernel.setValue(this.distro.kernel);
          this.distroFormGroup.controls.initrd.setValue(this.distro.initrd);
          this.distroFormGroup.controls.remote_boot_initrd.setValue(
            this.distro.remote_boot_initrd,
          );
          this.distroFormGroup.controls.remote_boot_kernel.setValue(
            this.distro.remote_boot_kernel,
          );
          this.distroFormGroup.controls.os_version.setValue(
            this.distro.os_version,
          );
          this.distroFormGroup.controls.redhat_management_key.setValue(
            this.distro.redhat_management_key,
          );
          if (typeof this.distro.boot_loaders === 'string') {
            this.distroFormGroup.controls.boot_loaders.setValue([
              'ipxe',
              'grub',
              'pxe',
            ]);
            this.distroFormGroup.controls.boot_loaders_inherited.setValue(true);
          } else {
            this.distroFormGroup.controls.boot_loaders_inherited.setValue(
              false,
            );
            this.distroFormGroup.controls.boot_loaders.setValue(
              this.distro.boot_loaders,
            );
          }
          if (typeof this.distro.owners === 'string') {
            this.distroFormGroup.controls.owners_inherited.setValue(true);
            this.distroFormGroup.controls.owners.setValue([]);
          } else {
            this.distroFormGroup.controls.owners_inherited.setValue(false);
            this.distroFormGroup.controls.owners.setValue(this.distro.owners);
          }
          if (typeof this.distro.autoinstall_meta === 'string') {
            this.distroFormGroup.controls.autoinstall_meta_inherited.setValue(
              true,
            );
            this.distroFormGroup.controls.autoinstall_meta.setValue(new Map());
          } else {
            this.distroFormGroup.controls.autoinstall_meta_inherited.setValue(
              false,
            );
            this.distroFormGroup.controls.autoinstall_meta.setValue(
              this.distro.autoinstall_meta,
            );
          }
          if (typeof this.distro.fetchable_files === 'string') {
            this.distroFormGroup.controls.fetchable_files_inherited.setValue(
              true,
            );
            this.distroFormGroup.controls.fetchable_files.setValue(new Map());
          } else {
            this.distroFormGroup.controls.fetchable_files_inherited.setValue(
              false,
            );
            this.distroFormGroup.controls.fetchable_files.setValue(
              this.distro.fetchable_files,
            );
          }
          if (typeof this.distro.kernel_options === 'string') {
            this.distroFormGroup.controls.kernel_options_inherited.setValue(
              true,
            );
            this.distroFormGroup.controls.kernel_options.setValue(new Map());
          } else {
            this.distroFormGroup.controls.kernel_options_inherited.setValue(
              false,
            );
            this.distroFormGroup.controls.kernel_options.setValue(
              this.distro.kernel_options,
            );
          }
          if (typeof this.distro.kernel_options_post === 'string') {
            this.distroFormGroup.controls.kernel_options_post_inherited.setValue(
              true,
            );
            this.distroFormGroup.controls.kernel_options_post.setValue(
              new Map(),
            );
          } else {
            this.distroFormGroup.controls.kernel_options_post_inherited.setValue(
              false,
            );
            this.distroFormGroup.controls.kernel_options_post.setValue(
              this.distro.kernel_options_post,
            );
          }
          if (typeof this.distro.template_files === 'string') {
            this.distroFormGroup.controls.template_files_inherited.setValue(
              true,
            );
            this.distroFormGroup.controls.template_files.setValue(new Map());
          } else {
            this.distroFormGroup.controls.template_files_inherited.setValue(
              false,
            );
            this.distroFormGroup.controls.template_files.setValue(
              this.distro.template_files,
            );
          }
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }

  removeDistro(): void {
    this.cobblerApiService
      .remove_distro(this.name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          if (value) {
            this.router.navigate(['/items', 'distro']);
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

  editDistro(): void {
    this.isEditMode = true;
    this.distroFormGroup.enable();
    // Inherit inputs
    if (typeof this.distro.autoinstall_meta === 'string') {
      this.distroFormGroup.controls.autoinstall_meta.disable();
    }
    if (typeof this.distro.boot_files === 'string') {
      this.distroFormGroup.controls.boot_files.disable();
    }
    if (typeof this.distro.boot_loaders === 'string') {
      this.distroFormGroup.controls.boot_loaders.disable();
    }
    if (typeof this.distro.fetchable_files === 'string') {
      this.distroFormGroup.controls.fetchable_files.disable();
    }
    if (typeof this.distro.kernel_options === 'string') {
      this.distroFormGroup.controls.kernel_options.disable();
    }
    if (typeof this.distro.kernel_options_post === 'string') {
      this.distroFormGroup.controls.kernel_options_post.disable();
    }
    if (typeof this.distro.mgmt_classes === 'string') {
      this.distroFormGroup.controls.mgmt_classes.disable();
    }
    if (typeof this.distro.owners === 'string') {
      this.distroFormGroup.controls.owners.disable();
    }
    if (typeof this.distro.template_files === 'string') {
      this.distroFormGroup.controls.template_files.disable();
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
        .subscribe(
          (distroHandle) => {
            this.cobblerApiService
              .copy_distro(distroHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                (value) => {
                  this.router.navigate(['/items', 'distro', newItemName]);
                },
                (error) => {
                  // HTML encode the error message since it originates from XML
                  this._snackBar.open(Utils.toHTML(error.message), 'Close');
                },
              );
          },
          (error) => {
            // HTML encode the error message since it originates from XML
            this._snackBar.open(Utils.toHTML(error.message), 'Close');
          },
        );
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
      .subscribe(
        (distroHandle) => {
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
          combineLatest(modifyObservables).subscribe(
            (value) => {
              this.cobblerApiService
                .save_distro(distroHandle, this.userService.token)
                .subscribe(
                  (value1) => {
                    this.isEditMode = false;
                    this.distroFormGroup.disable();
                    this.refreshData();
                  },
                  (error) => {
                    this._snackBar.open(Utils.toHTML(error.message), 'Close');
                  },
                );
            },
            (error) => {
              this._snackBar.open(Utils.toHTML(error.message), 'Close');
            },
          );
        },
        (error) => {
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }
}
