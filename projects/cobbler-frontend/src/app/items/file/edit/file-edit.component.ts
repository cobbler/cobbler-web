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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
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
  fileFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: true }),
    uid: new FormControl({ value: '', disabled: true }),
    mtime: new FormControl({ value: '', disabled: true }),
    ctime: new FormControl({ value: '', disabled: true }),
    depth: new FormControl({ value: 0, disabled: true }),
    is_subobject: new FormControl({ value: false, disabled: true }),
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
          this.fileFormGroup.controls.name.setValue(this.file.name);
          this.fileFormGroup.controls.uid.setValue(this.file.uid);
          this.fileFormGroup.controls.mtime.setValue(
            new Date(this.file.mtime * 1000).toString(),
          );
          this.fileFormGroup.controls.ctime.setValue(
            new Date(this.file.ctime * 1000).toString(),
          );
          this.fileFormGroup.controls.depth.setValue(this.file.depth);
          this.fileFormGroup.controls.is_subobject.setValue(
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
    // TODO
    this._snackBar.open('Not implemented at the moment!', 'Close');
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
    // TODO
  }
}
