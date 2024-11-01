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
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, Image } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';

@Component({
  selector: 'cobbler-image-edit',
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
  ],
  templateUrl: './image-edit.component.html',
  styleUrl: './image-edit.component.scss',
})
export class ImageEditComponent implements OnInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  name: string;
  image: Image;
  private readonly _formBuilder = inject(FormBuilder);
  imageFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: true }),
    uid: new FormControl({ value: '', disabled: true }),
    mtime: new FormControl({ value: '', disabled: true }),
    ctime: new FormControl({ value: '', disabled: true }),
    depth: new FormControl({ value: 0, disabled: true }),
    network_count: new FormControl({ value: 0, disabled: true }),
    is_subobject: new FormControl({ value: false, disabled: true }),
    comment: new FormControl({ value: '', disabled: true }),
    redhat_management_key: new FormControl({ value: '', disabled: true }),
    parent: new FormControl({ value: '', disabled: true }),
    arch: new FormControl({ value: '', disabled: true }),
    autoinstall: new FormControl({ value: '', disabled: true }),
    breed: new FormControl({ value: '', disabled: true }),
    file: new FormControl({ value: '', disabled: true }),
    image_type: new FormControl({ value: '', disabled: true }),
    os_version: new FormControl({ value: '', disabled: true }),
    boot_loaders: new FormControl({ value: [], disabled: true }),
    bootloader_inherited: new FormControl({ value: false, disabled: true }),
    owners: new FormControl({ value: [], disabled: true }),
    owners_inherited: new FormControl({ value: false, disabled: true }),
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
      .get_image(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          this.image = value;
          this.imageFormGroup.controls.name.setValue(this.image.name);
          this.imageFormGroup.controls.uid.setValue(this.image.uid);
          this.imageFormGroup.controls.mtime.setValue(
            new Date(this.image.mtime * 1000).toString(),
          );
          this.imageFormGroup.controls.ctime.setValue(
            new Date(this.image.ctime * 1000).toString(),
          );
          this.imageFormGroup.controls.depth.setValue(this.image.depth);
          this.imageFormGroup.controls.network_count.setValue(
            this.image.network_count,
          );
          this.imageFormGroup.controls.is_subobject.setValue(
            this.image.is_subobject,
          );
          this.imageFormGroup.controls.comment.setValue(this.image.comment);
          this.imageFormGroup.controls.parent.setValue(this.image.parent);
          this.imageFormGroup.controls.arch.setValue(this.image.arch);
          this.imageFormGroup.controls.autoinstall.setValue(
            this.image.autoinstall,
          );
          this.imageFormGroup.controls.breed.setValue(this.image.breed);
          this.imageFormGroup.controls.file.setValue(this.image.file);
          this.imageFormGroup.controls.image_type.setValue(
            this.image.image_type,
          );
          this.imageFormGroup.controls.os_version.setValue(
            this.image.os_version,
          );
          if (typeof this.image.boot_loaders === 'string') {
            this.imageFormGroup.controls.bootloader_inherited.setValue(true);
          } else {
            this.imageFormGroup.controls.bootloader_inherited.setValue(false);
            this.imageFormGroup.controls.boot_loaders.setValue(
              this.image.boot_loaders,
            );
          }
          if (typeof this.image.owners === 'string') {
            this.imageFormGroup.controls.owners_inherited.setValue(true);
          } else {
            this.imageFormGroup.controls.owners_inherited.setValue(false);
            this.imageFormGroup.controls.owners.setValue(this.image.owners);
          }
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }

  removeImage(): void {
    this.cobblerApiService
      .remove_image(this.name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          if (value) {
            this.router.navigate(['/items', 'image']);
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

  editImage(): void {
    // TODO
    this._snackBar.open('Not implemented at the moment!', 'Close');
  }

  copyImage(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemCopyComponent, {
      data: {
        itemType: 'Image',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the image
        return;
      }
      this.cobblerApiService
        .get_image_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (imageHandle) => {
            this.cobblerApiService
              .copy_image(imageHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                (value) => {
                  this.router.navigate(['/items', 'image', newItemName]);
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

  saveImage(): void {
    // TODO
  }

  get imageOwners(): string[] {
    if (this.image && this.image.owners) {
      const ownersResult = this.image.owners;
      if (typeof ownersResult !== 'string') {
        return ownersResult;
      }
    }
    return [];
  }
}
