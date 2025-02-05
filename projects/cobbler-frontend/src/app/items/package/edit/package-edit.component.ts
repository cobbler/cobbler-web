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
import { CobblerApiService, Package } from 'cobbler-api';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
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
  templateUrl: './package-edit.component.html',
  styleUrl: './package-edit.component.scss',
})
export class PackageEditComponent implements OnInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  name: string;
  package: Package;
  private readonly _formBuilder = inject(FormBuilder);
  packageReadonlyFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: false }),
    uid: new FormControl({ value: '', disabled: false }),
    mtime: new FormControl({ value: '', disabled: false }),
    ctime: new FormControl({ value: '', disabled: false }),
    depth: new FormControl({ value: 0, disabled: false }),
    is_subobject: new FormControl({ value: false, disabled: false }),
  });
  packageFormGroup = this._formBuilder.group({
    comment: new FormControl({ value: '', disabled: true }),
    redhat_management_key: new FormControl({ value: '', disabled: true }),
    mode: new FormControl({ value: '', disabled: true }),
    owner: new FormControl({ value: '', disabled: true }),
    group: new FormControl({ value: '', disabled: true }),
    path: new FormControl({ value: '', disabled: true }),
    template: new FormControl({ value: '', disabled: true }),
    action: new FormControl({ value: '', disabled: true }),
    installer: new FormControl({ value: '', disabled: true }),
    version: new FormControl({ value: '', disabled: true }),
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
    // Observables for inherited properties
    this.packageFormGroup.controls.owners_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.packageFormGroup.controls.owners),
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
      .get_package(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          this.package = value;
          this.packageReadonlyFormGroup.controls.name.setValue(
            this.package.name,
          );
          this.packageReadonlyFormGroup.controls.uid.setValue(this.package.uid);
          this.packageReadonlyFormGroup.controls.mtime.setValue(
            new Date(this.package.mtime * 1000).toString(),
          );
          this.packageReadonlyFormGroup.controls.ctime.setValue(
            new Date(this.package.ctime * 1000).toString(),
          );
          this.packageReadonlyFormGroup.controls.depth.setValue(
            this.package.depth,
          );
          this.packageReadonlyFormGroup.controls.is_subobject.setValue(
            this.package.is_subobject,
          );
          this.packageFormGroup.controls.comment.setValue(this.package.comment);
          this.packageFormGroup.controls.mode.setValue(this.package.mode);
          this.packageFormGroup.controls.owner.setValue(this.package.owner);
          this.packageFormGroup.controls.group.setValue(this.package.group);
          this.packageFormGroup.controls.path.setValue(this.package.path);
          this.packageFormGroup.controls.template.setValue(
            this.package.template,
          );
          this.packageFormGroup.controls.action.setValue(this.package.action);
          this.packageFormGroup.controls.installer.setValue(
            this.package.installer,
          );
          this.packageFormGroup.controls.version.setValue(this.package.version);
          if (typeof this.package.owners === 'string') {
            this.packageFormGroup.controls.owners_inherited.setValue(true);
            this.packageFormGroup.controls.owners.setValue([]);
          } else {
            this.packageFormGroup.controls.owners_inherited.setValue(false);
            this.packageFormGroup.controls.owners.setValue(this.package.owners);
          }
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }

  removePackage(): void {
    this.cobblerApiService
      .remove_package(this.name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          if (value) {
            this.router.navigate(['/items', 'package']);
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

  editPackage(): void {
    this.isEditMode = true;
    this.packageFormGroup.enable();
    // Inherit inputs
    if (typeof this.package.owners === 'string') {
      this.packageFormGroup.controls.owners.disable();
    }
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmCancelEditComponent, {
      data: {
        name: this.package.name,
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === false) {
        // False means the user want's to continue
        return;
      }
      this.isEditMode = false;
      this.packageFormGroup.disable();
      this.refreshData();
    });
  }

  showAsRendered(): void {
    this.cobblerApiService
      .get_package_as_rendered(this.package.name, this.userService.token)
      .subscribe((value) => {
        const dialogRef = this.dialog.open(DialogBoxItemRenderedComponent, {
          data: {
            itemType: 'Package',
            uid: this.package.uid,
            name: this.package.name,
            renderedData: value,
          },
        });
      });
  }

  copyPackage(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemCopyComponent, {
      data: {
        itemType: 'Package',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the package
        return;
      }
      this.cobblerApiService
        .get_package_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (packageHandle) => {
            this.cobblerApiService
              .copy_package(packageHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                (value) => {
                  this.router.navigate(['/items', 'package', newItemName]);
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

  savePackage(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.packageFormGroup,
      Utils.getDirtyValues(this.packageFormGroup),
    );
    this.cobblerApiService
      .get_package_handle(this.name, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (packageHandle) => {
          let modifyObservables: Observable<boolean>[] = [];
          dirtyValues.forEach((value, key) => {
            modifyObservables.push(
              this.cobblerApiService.modify_package(
                packageHandle,
                key,
                value,
                this.userService.token,
              ),
            );
          });
          combineLatest(modifyObservables).subscribe(
            (value) => {
              this.cobblerApiService
                .save_package(packageHandle, this.userService.token)
                .subscribe(
                  (value1) => {
                    this.isEditMode = false;
                    this.packageFormGroup.disable();
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
