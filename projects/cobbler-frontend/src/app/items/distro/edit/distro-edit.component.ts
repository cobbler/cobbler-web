import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, Distro } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';

@Component({
  selector: 'cobbler-edit',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    FormsModule,
    MatTooltip,
    MatButton,
    MatCheckbox,
    MatSelect,
    MatOption,
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
  distroFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: true }),
    uid: new FormControl({ value: '', disabled: true }),
    mtime: new FormControl({ value: '', disabled: true }),
    ctime: new FormControl({ value: '', disabled: true }),
    depth: new FormControl({ value: 0, disabled: true }),
    arch: new FormControl({ value: '', disabled: true }),
    is_subobject: new FormControl({ value: false, disabled: true }),
    tree_build_time: new FormControl({ value: '', disabled: true }),
    breed: new FormControl({ value: '', disabled: true }),
    comment: new FormControl({ value: '', disabled: true }),
    kernel: new FormControl({ value: '', disabled: true }),
    initrd: new FormControl({ value: '', disabled: true }),
    remote_boot_initrd: new FormControl({ value: '', disabled: true }),
    remote_boot_kernel: new FormControl({ value: '', disabled: true }),
    remote_grub_initrd: new FormControl({ value: '', disabled: true }),
    remote_grub_kernel: new FormControl({ value: '', disabled: true }),
    os_version: new FormControl({ value: '', disabled: true }),
    redhat_management_key: new FormControl({ value: '', disabled: true }),
    boot_loaders: new FormControl({ value: [], disabled: true }),
    bootloader_inherited: new FormControl({ value: false, disabled: true }),
    owners: new FormControl({ value: [], disabled: true }),
    owners_inherited: new FormControl({ value: false, disabled: true }),
    mgmt_classes: new FormControl({ value: [], disabled: true }),
    mgmt_classes_inherited: new FormControl({ value: false, disabled: true }),
    autoinstall_meta: new FormControl({ value: {}, disabled: true }),
    autoinstall_meta_inherited: new FormControl({
      value: false,
      disabled: true,
    }),
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
    template_files: new FormControl({ value: {}, disabled: true }),
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
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  refreshData(): void {
    this.cobblerApiService
      .get_distro(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          this.distro = value;
          this.distroFormGroup.controls.name.setValue(this.distro.name);
          this.distroFormGroup.controls.uid.setValue(this.distro.uid);
          this.distroFormGroup.controls.mtime.setValue(
            new Date(this.distro.mtime * 1000).toString(),
          );
          this.distroFormGroup.controls.ctime.setValue(
            new Date(this.distro.ctime * 1000).toString(),
          );
          this.distroFormGroup.controls.depth.setValue(this.distro.depth);
          this.distroFormGroup.controls.arch.setValue(this.distro.arch);
          this.distroFormGroup.controls.is_subobject.setValue(
            this.distro.is_subobject,
          );
          this.distroFormGroup.controls.tree_build_time.setValue(
            new Date(this.distro.tree_build_time * 1000).toString(),
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
          this.distroFormGroup.controls.remote_grub_initrd.setValue(
            this.distro.remote_grub_initrd,
          );
          this.distroFormGroup.controls.remote_grub_kernel.setValue(
            this.distro.remote_grub_kernel,
          );
          this.distroFormGroup.controls.os_version.setValue(
            this.distro.os_version,
          );
          this.distroFormGroup.controls.redhat_management_key.setValue(
            this.distro.redhat_management_key,
          );
          if (typeof this.distro.boot_loaders === 'string') {
            this.distroFormGroup.controls.bootloader_inherited.setValue(true);
          } else {
            this.distroFormGroup.controls.bootloader_inherited.setValue(false);
            this.distroFormGroup.controls.boot_loaders.setValue(
              this.distro.boot_loaders,
            );
          }
          if (typeof this.distro.owners === 'string') {
            this.distroFormGroup.controls.owners_inherited.setValue(true);
          } else {
            this.distroFormGroup.controls.owners_inherited.setValue(false);
            this.distroFormGroup.controls.owners.setValue(this.distro.owners);
          }
          if (typeof this.distro.autoinstall_meta === 'string') {
            this.distroFormGroup.controls.autoinstall_meta_inherited.setValue(
              true,
            );
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
    // TODO
    this._snackBar.open('Not implemented at the moment!', 'Close');
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
    // TODO
  }

  get distroOwners(): string[] {
    if (this.distro && this.distro.owners) {
      const ownersResult = this.distro.owners;
      if (typeof ownersResult !== 'string') {
        return ownersResult;
      }
    }
    return [];
  }

  get distroAutoinstallMeta(): object {
    if (this.distro && this.distro.autoinstall_meta) {
      const autoinstallMetaResult = this.distro.autoinstall_meta;
      if (typeof autoinstallMetaResult !== 'string') {
        return autoinstallMetaResult;
      }
    }
    return {};
  }

  get distroBootFiles(): object {
    if (this.distro && this.distro.boot_files) {
      const bootFilesResult = this.distro.boot_files;
      if (typeof bootFilesResult !== 'string') {
        return bootFilesResult;
      }
    }
    return {};
  }

  get distroFetchableFiles(): object {
    if (this.distro && this.distro.fetchable_files) {
      const fetchableFilesResult = this.distro.fetchable_files;
      if (typeof fetchableFilesResult !== 'string') {
        return fetchableFilesResult;
      }
    }
    return {};
  }

  get distroKernelOptions(): object {
    if (this.distro && this.distro.kernel_options) {
      const kernelOptionsResult = this.distro.kernel_options;
      if (typeof kernelOptionsResult !== 'string') {
        return kernelOptionsResult;
      }
    }
    return {};
  }

  get distroKernelOptionsPost(): object {
    if (this.distro && this.distro.kernel_options_post) {
      const kernelOptionsPostResult = this.distro.kernel_options_post;
      if (typeof kernelOptionsPostResult !== 'string') {
        return kernelOptionsPostResult;
      }
    }
    return {};
  }

  get distroTemplateFiles(): object {
    if (this.distro && this.distro.template_files) {
      const templateFilesResult = this.distro.template_files;
      if (typeof templateFilesResult !== 'string') {
        return templateFilesResult;
      }
    }
    return {};
  }
}
