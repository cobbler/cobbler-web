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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, File } from 'cobbler-api';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
import { UserService } from '../../../services/user.service';
import Utils, { CobblerInputChoices, CobblerInputData } from '../../../utils';
import { DialogBoxItemRenderedComponent } from '../../../common/dialog-box-item-rendered/dialog-box-item-rendered.component';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';

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
    MatTooltip,
    ReactiveFormsModule,
    KeyValueEditorComponent,
    MultiSelectComponent,
  ],
  templateUrl: './file-edit.component.html',
  styleUrl: './file-edit.component.scss',
})
export class FileEditComponent implements OnInit, OnDestroy {
  // Bring Enum to HTML scope
  protected readonly CobblerInputChoices = CobblerInputChoices;

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form data
  fileReadonlyInputData: Array<CobblerInputData> = [
    {
      formControlName: 'name',
      inputType: CobblerInputChoices.TEXT,
      label: 'Name',
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'uid',
      inputType: CobblerInputChoices.TEXT,
      label: 'UID',
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'mtime',
      inputType: CobblerInputChoices.TEXT,
      label: 'Last modified time',
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'ctime',
      inputType: CobblerInputChoices.TEXT,
      label: 'Creation time',
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'depth',
      inputType: CobblerInputChoices.NUMBER,
      label: 'Depth',
      disabled: false,
      readonly: true,
      defaultValue: 0,
      inherited: false,
    },
    {
      formControlName: 'is_subobject',
      inputType: CobblerInputChoices.CHECKBOX,
      label: 'Is Subobject?',
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
    },
  ];
  fileEditableInputData: Array<CobblerInputData> = [
    {
      formControlName: 'is_dir',
      inputType: CobblerInputChoices.CHECKBOX,
      label: 'Is Subobject?',
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
    },
    {
      formControlName: 'comment',
      inputType: CobblerInputChoices.TEXT,
      label: 'Comment',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'action',
      inputType: CobblerInputChoices.TEXT,
      label: 'Action',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'group',
      inputType: CobblerInputChoices.TEXT,
      label: 'Group',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'mode',
      inputType: CobblerInputChoices.TEXT,
      label: 'Mode',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'owner',
      inputType: CobblerInputChoices.TEXT,
      label: 'Owner',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'path',
      inputType: CobblerInputChoices.TEXT,
      label: 'Path',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'template',
      inputType: CobblerInputChoices.TEXT,
      label: 'Template',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
  ];

  // Form
  name: string;
  file: File;
  private readonly _formBuilder = inject(FormBuilder);
  fileReadonlyFormGroup = this._formBuilder.group({});
  fileFormGroup = this._formBuilder.group({});
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
    this.fileReadonlyInputData.forEach((value) => {
      this.fileReadonlyFormGroup.addControl(
        value.formControlName,
        new FormControl({
          value: value.defaultValue,
          disabled: value.disabled,
        }),
      );
      if (value.inherited) {
        this.fileReadonlyFormGroup.addControl(
          value.formControlName + '_inherited',
          new FormControl({
            value: false,
            disabled: value.disabled,
          }),
        );
      }
    });
    this.fileEditableInputData.forEach((value) => {
      this.fileFormGroup.addControl(
        value.formControlName,
        new FormControl({
          value: value.defaultValue,
          disabled: value.disabled,
        }),
      );
      if (value.inherited) {
        this.fileFormGroup.addControl(
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
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  refreshData(): void {
    this.cobblerApiService
      .get_file(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.file = value;
          this.fileReadonlyFormGroup.patchValue({
            name: this.file.name,
            uid: this.file.uid,
            mtime: Utils.floatToDate(this.file.mtime).toString(),
            ctime: Utils.floatToDate(this.file.ctime).toString(),
            depth: this.file.depth,
            is_subobject: this.file.is_subobject,
          });
          this.fileFormGroup.patchValue({
            comment: this.file.comment,
            action: this.file.action,
            group: this.file.group,
            mode: this.file.mode,
            owner: this.file.owner,
            path: this.file.path,
            template: this.file.template,
          });
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }

  removeFile(): void {
    this.cobblerApiService
      .remove_file(this.name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this.router.navigate(['/items', 'file']);
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

  editFile(): void {
    this.isEditMode = true;
    this.fileFormGroup.enable();
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmCancelEditComponent, {
      data: {
        name: this.file.name,
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === false) {
        // False means the user want's to continue
        return;
      }
      this.isEditMode = false;
      this.fileFormGroup.disable();
      this.refreshData();
    });
  }

  showAsRendered(): void {
    this.cobblerApiService
      .get_file_as_rendered(this.file.name, this.userService.token)
      .subscribe((value) => {
        this.dialog.open(DialogBoxItemRenderedComponent, {
          data: {
            itemType: 'File',
            uid: this.file.uid,
            name: this.file.name,
            renderedData: value,
          },
        });
      });
  }

  copyFile(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemCopyComponent, {
      data: {
        itemType: 'File',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the file
        return;
      }
      this.cobblerApiService
        .get_file_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (fileHandle) => {
            this.cobblerApiService
              .copy_file(fileHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.router.navigate(['/items', 'file', newItemName]);
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

  saveFile(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.fileFormGroup,
      Utils.getDirtyValues(this.fileFormGroup),
    );
    this.cobblerApiService
      .get_file_handle(this.name, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (fileHandle) => {
          let modifyObservables: Observable<boolean>[] = [];
          dirtyValues.forEach((value, key) => {
            modifyObservables.push(
              this.cobblerApiService.modify_file(
                fileHandle,
                key,
                value,
                this.userService.token,
              ),
            );
          });
          combineLatest(modifyObservables).subscribe({
            next: () => {
              this.cobblerApiService
                .save_file(fileHandle, this.userService.token)
                .subscribe({
                  next: () => {
                    this.isEditMode = false;
                    this.fileFormGroup.disable();
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
