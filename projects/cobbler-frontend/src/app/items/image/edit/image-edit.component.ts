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
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, Image } from 'cobbler-api';
import { combineLatest, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, map } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
import { HelpButtonComponent } from '../../../common/help-button/help-button.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';
import Utils, { CobblerInputChoices, CobblerInputData } from '../../../utils';
import { DialogBoxItemRenderedComponent } from '../../../common/dialog-box-item-rendered/dialog-box-item-rendered.component';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import {
  cobblerItemEditableData,
  cobblerItemReadonlyData,
} from '../../metadata';
import { MultiSelectStrictComponent } from '../../../common/multi-select-strict/multi-select-strict.component';

@Component({
  selector: 'cobbler-image-edit',
  imports: [
    FormsModule,
    MatButton,
    MatCheckbox,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatTooltip,
    ReactiveFormsModule,
    MultiSelectComponent,
    KeyValueEditorComponent,
    MultiSelectStrictComponent,
    HelpButtonComponent,
  ],
  templateUrl: './image-edit.component.html',
  styleUrl: './image-edit.component.scss',
})
export class ImageEditComponent implements OnInit, OnDestroy {
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
  imageReadonlyInputData = cobblerItemReadonlyData;
  imageEditableInputData: Array<CobblerInputData> = [
    ...cobblerItemEditableData,
    {
      formControlName: 'network_count',
      inputType: CobblerInputChoices.NUMBER,
      label: $localize`:@@image.edit.label.network_count:Network Count`,
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: false,
      hint: $localize`:@@image.edit.hint.network_count:Number of virtual NICs this image has. Deprecated since 3.3.0 — not used anywhere in the project.`,
    },
    {
      formControlName: 'redhat_management_key',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@image.edit.label.redhat_management_key:RedHat Management Key`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@image.edit.hint.redhat_management_key:Registration key for Red Hat management systems (Spacewalk, Uyuni, SUSE Manager). Supports <<inherit>>.`,
    },
    {
      formControlName: 'parent',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@image.edit.label.parent:Parent`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@image.edit.hint.parent:Name of the parent image for inheritance.`,
    },
    {
      formControlName: 'arch',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@image.edit.label.arch:Arch`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@image.edit.hint.arch:CPU architecture the image was built for. Enforced on physical deployments.`,
    },
    {
      formControlName: 'autoinstall',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@image.edit.label.autoinstall:Autoinstall`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@image.edit.hint.autoinstall:Path to an answer file for automated installation (e.g. a Windows SIF or kickstart). Only used when image_type is "iso".`,
    },
    {
      formControlName: 'breed',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@image.edit.label.breed:Operating System Breed`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@image.edit.hint.breed:Operating system family of the image.`,
    },
    {
      formControlName: 'file',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@image.edit.label.file:Image File`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@image.edit.hint.file:Location of the image file, accessible on all nodes that need it. Format: [user@]host:/path or /local/path.`,
    },
    {
      formControlName: 'image_type',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@image.edit.label.image_type:Image Type`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@image.edit.hint.image_type:Image kind: direct (memdisk, physical only), iso (bootable ISO), virt-clone (cloned virtual disk), or memdisk (HDD image).`,
    },
    {
      formControlName: 'os_version',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@image.edit.label.os_version:Operating System Version`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@image.edit.hint.os_version:OS release version the image contains.`,
    },
    {
      formControlName: 'boot_loaders',
      inputType: CobblerInputChoices.MULTI_SELECT_STRICT_DROPDOWN,
      label: $localize`:@@image.edit.label.boot_loaders:Boot Loaders`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
      options: [],
      hint: $localize`:@@image.edit.hint.boot_loaders:Bootloaders able to boot this image type.`,
    },
    {
      formControlName: 'owners',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@image.edit.label.owners:Owners`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
      hint: $localize`:@@image.edit.hint.owners:Cobbler user accounts allowed to manage this item. Cosmetic only — not validated against real users. Supports <<inherit>>.`,
    },
  ];

  // Form
  name: string;
  image: Image;
  private readonly _formBuilder = inject(FormBuilder);
  imageReadonlyFormGroup = this._formBuilder.group({});
  imageFormGroup = this._formBuilder.group({});
  isEditMode: boolean = false;

  constructor() {
    this.name = this.route.snapshot.paramMap.get('name');
    Utils.fillupItemFormGroup(
      this.imageReadonlyFormGroup,
      this.imageFormGroup,
      this.imageReadonlyInputData,
      this.imageEditableInputData,
    );
  }

  ngOnInit(): void {
    this.refreshData();
    // Observables for inherited properties
    this.imageFormGroup
      .get('boot_loaders_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.imageFormGroup.get('boot_loaders')),
      );
    this.imageFormGroup
      .get('owners_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.imageFormGroup.get('owners')),
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
      .get_image(this.name, false, false, this.userService.token)
      .pipe(
        switchMap((image) => {
          return this.cobblerApiService
            .get_valid_image_bootloaders(image.name, this.userService.token)
            .pipe(map((bootloaders) => ({ image, bootloaders })));
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: ({ image, bootloaders }) => {
          this.image = image;
          const bootloadersInput = this.imageEditableInputData.find(
            (i) => i.formControlName === 'boot_loaders',
          );
          if (bootloadersInput) {
            bootloadersInput.options = bootloaders;
          }
          this.imageReadonlyFormGroup.patchValue({
            name: this.image.name,
            uid: this.image.uid,
            mtime: Utils.floatToDate(this.image.mtime).toString(),
            ctime: Utils.floatToDate(this.image.ctime).toString(),
            depth: this.image.depth,
            is_subobject: this.image.is_subobject,
          });
          this.imageFormGroup.patchValue({
            network_count: this.image.network_count,
            comment: this.image.comment,
            parent: this.image.parent,
            arch: this.image.arch,
            autoinstall: this.image.autoinstall,
            breed: this.image.breed,
            file: this.image.file,
            image_type: this.image.image_type,
            os_version: this.image.os_version,
          });
          Utils.patchFormGroupInherited(
            this.imageFormGroup,
            this.image.boot_loaders,
            'boot_loaders',
            bootloaders,
          );
          Utils.patchFormGroupInherited(
            this.imageFormGroup,
            this.image.owners,
            'owners',
            [],
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

  removeImage(): void {
    this.cobblerApiService
      .remove_image(this.name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this.router.navigate(['/items', 'image']);
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

  editImage(): void {
    this.isEditMode = true;
    this.imageFormGroup.enable();
    // Inherit inputs
    if (typeof this.image.boot_loaders === 'string') {
      this.imageFormGroup.get('boot_loaders').disable();
    }
    if (typeof this.image.owners === 'string') {
      this.imageFormGroup.get('owners').disable();
    }
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmCancelEditComponent, {
      data: {
        name: this.image.name,
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === false) {
        // False means the user want's to continue
        return;
      }
      this.isEditMode = false;
      this.imageFormGroup.disable();
      this.refreshData();
    });
  }

  showAsRendered(): void {
    this.cobblerApiService
      .get_image_as_rendered(this.image.name, this.userService.token)
      .subscribe((value) => {
        this.dialog.open(DialogBoxItemRenderedComponent, {
          data: {
            itemType: 'Image',
            uid: this.image.uid,
            name: this.image.name,
            renderedData: value,
          },
        });
      });
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
        .subscribe({
          next: (imageHandle) => {
            this.cobblerApiService
              .copy_image(imageHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.router.navigate(['/items', 'image', newItemName]);
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

  saveImage(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.imageFormGroup,
      Utils.getDirtyValues(this.imageFormGroup),
    );
    this.cobblerApiService
      .get_image_handle(this.name, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (imageHandle) => {
          let modifyObservables: Observable<boolean>[] = [];
          dirtyValues.forEach((value, key) => {
            modifyObservables.push(
              this.cobblerApiService.modify_image(
                imageHandle,
                key,
                value,
                this.userService.token,
              ),
            );
          });
          combineLatest(modifyObservables).subscribe({
            next: () => {
              this.cobblerApiService
                .save_image(imageHandle, this.userService.token)
                .subscribe({
                  next: () => {
                    this.isEditMode = false;
                    this.imageFormGroup.disable();
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
