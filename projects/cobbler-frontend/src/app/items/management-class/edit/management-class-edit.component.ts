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
import { CobblerApiService, Mgmgtclass } from 'cobbler-api';
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
  templateUrl: './management-class-edit.component.html',
  styleUrl: './management-class-edit.component.scss',
})
export class ManagementClassEditComponent implements OnInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  name: string;
  managementClass: Mgmgtclass;
  private readonly _formBuilder = inject(FormBuilder);
  managementClassFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: true }),
    uid: new FormControl({ value: '', disabled: true }),
    mtime: new FormControl({ value: '', disabled: true }),
    ctime: new FormControl({ value: '', disabled: true }),
    depth: new FormControl({ value: 0, disabled: true }),
    is_subobject: new FormControl({ value: false, disabled: true }),
    is_definition: new FormControl({ value: false, disabled: true }),
    comment: new FormControl({ value: '', disabled: true }),
    redhat_management_key: new FormControl({ value: '', disabled: true }),
    class_name: new FormControl({ value: '', disabled: true }),
    owners: new FormControl({ value: [], disabled: true }),
    owners_inherited: new FormControl({ value: false, disabled: true }),
    params: new FormControl({ value: {}, disabled: true }),
    files: new FormControl({ value: [], disabled: true }),
    packages: new FormControl({ value: [], disabled: true }),
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
      .get_mgmtclass(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          this.managementClass = value;
          this.managementClassFormGroup.controls.name.setValue(
            this.managementClass.name,
          );
          this.managementClassFormGroup.controls.uid.setValue(
            this.managementClass.uid,
          );
          this.managementClassFormGroup.controls.mtime.setValue(
            new Date(this.managementClass.mtime * 1000).toString(),
          );
          this.managementClassFormGroup.controls.ctime.setValue(
            new Date(this.managementClass.ctime * 1000).toString(),
          );
          this.managementClassFormGroup.controls.depth.setValue(
            this.managementClass.depth,
          );
          this.managementClassFormGroup.controls.is_subobject.setValue(
            this.managementClass.is_subobject,
          );
          this.managementClassFormGroup.controls.is_definition.setValue(
            this.managementClass.is_definition,
          );
          this.managementClassFormGroup.controls.comment.setValue(
            this.managementClass.comment,
          );
          this.managementClassFormGroup.controls.class_name.setValue(
            this.managementClass.class_name,
          );
          if (typeof this.managementClass.owners === 'string') {
            this.managementClassFormGroup.controls.owners_inherited.setValue(
              true,
            );
          } else {
            this.managementClassFormGroup.controls.owners_inherited.setValue(
              false,
            );
            this.managementClassFormGroup.controls.owners.setValue(
              this.managementClass.owners,
            );
          }
          this.managementClassFormGroup.controls.params.setValue(
            this.managementClass.params,
          );
          this.managementClassFormGroup.controls.files.setValue(
            this.managementClass.files,
          );
          this.managementClassFormGroup.controls.packages.setValue(
            this.managementClass.packages,
          );
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }

  removeManagementClass(): void {
    this.cobblerApiService
      .remove_mgmtclass(this.name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          if (value) {
            this.router.navigate(['/items', 'profile']);
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

  editProfile(): void {
    // TODO
    this._snackBar.open('Not implemented at the moment!', 'Close');
  }

  copyMgmtClass(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemCopyComponent, {
      data: {
        itemType: 'Mangement Class',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the management class
        return;
      }
      this.cobblerApiService
        .get_mgmtclass_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (mgmtClassHandle) => {
            this.cobblerApiService
              .copy_mgmtclass(
                mgmtClassHandle,
                newItemName,
                this.userService.token,
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                (value) => {
                  this.router.navigate([
                    '/items',
                    'management-class',
                    newItemName,
                  ]);
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

  saveProfile(): void {
    // TODO
  }

  get mgmtClassOwners(): string[] {
    if (this.managementClass && this.managementClass.owners) {
      const ownersResult = this.managementClass.owners;
      if (typeof ownersResult !== 'string') {
        return ownersResult;
      }
    }
    return [];
  }
}
