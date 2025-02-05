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
import { CobblerApiService, File } from 'cobbler-api';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
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
  ],
  templateUrl: './file-edit.component.html',
  styleUrl: './file-edit.component.scss',
})
export class FileEditComponent implements OnInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  name: string;
  file: File;
  private readonly _formBuilder = inject(FormBuilder);
  fileReadonlyFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: false }),
    uid: new FormControl({ value: '', disabled: false }),
    mtime: new FormControl({ value: '', disabled: false }),
    ctime: new FormControl({ value: '', disabled: false }),
    depth: new FormControl({ value: 0, disabled: false }),
    is_subobject: new FormControl({ value: false, disabled: false }),
  });
  fileFormGroup = this._formBuilder.group({
    is_dir: new FormControl({ value: false, disabled: true }),
    comment: new FormControl({ value: '', disabled: true }),
    redhat_management_key: new FormControl({ value: '', disabled: true }),
    action: new FormControl({ value: '', disabled: true }),
    group: new FormControl({ value: '', disabled: true }),
    mode: new FormControl({ value: '', disabled: true }),
    owner: new FormControl({ value: '', disabled: true }),
    path: new FormControl({ value: '', disabled: true }),
    template: new FormControl({ value: '', disabled: true }),
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
      .get_file(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          this.file = value;
          this.fileReadonlyFormGroup.controls.name.setValue(this.file.name);
          this.fileReadonlyFormGroup.controls.uid.setValue(this.file.uid);
          this.fileReadonlyFormGroup.controls.mtime.setValue(
            new Date(this.file.mtime * 1000).toString(),
          );
          this.fileReadonlyFormGroup.controls.ctime.setValue(
            new Date(this.file.ctime * 1000).toString(),
          );
          this.fileReadonlyFormGroup.controls.depth.setValue(this.file.depth);
          this.fileReadonlyFormGroup.controls.is_subobject.setValue(
            this.file.is_subobject,
          );
          this.fileFormGroup.controls.comment.setValue(this.file.comment);
          this.fileFormGroup.controls.action.setValue(this.file.action);
          this.fileFormGroup.controls.group.setValue(this.file.group);
          this.fileFormGroup.controls.mode.setValue(this.file.mode);
          this.fileFormGroup.controls.owner.setValue(this.file.owner);
          this.fileFormGroup.controls.path.setValue(this.file.path);
          this.fileFormGroup.controls.template.setValue(this.file.template);
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }

  removeFile(): void {
    this.cobblerApiService
      .remove_file(this.name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          if (value) {
            this.router.navigate(['/items', 'file']);
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
        const dialogRef = this.dialog.open(DialogBoxItemRenderedComponent, {
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
        .subscribe(
          (fileHandle) => {
            this.cobblerApiService
              .copy_file(fileHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                (value) => {
                  this.router.navigate(['/items', 'file', newItemName]);
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

  saveFile(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.fileFormGroup,
      Utils.getDirtyValues(this.fileFormGroup),
    );
    this.cobblerApiService
      .get_file_handle(this.name, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (fileHandle) => {
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
          combineLatest(modifyObservables).subscribe(
            (value) => {
              this.cobblerApiService
                .save_file(fileHandle, this.userService.token)
                .subscribe(
                  (value1) => {
                    this.isEditMode = false;
                    this.fileFormGroup.disable();
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
