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
import { CobblerApiService, Repo } from 'cobbler-api';
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
  templateUrl: './repository-edit.component.html',
  styleUrl: './repository-edit.component.scss',
})
export class RepositoryEditComponent implements OnInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  name: string;
  repository: Repo;
  private readonly _formBuilder = inject(FormBuilder);
  repositoryReadonlyFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: false }),
    uid: new FormControl({ value: '', disabled: false }),
    mtime: new FormControl({ value: '', disabled: false }),
    ctime: new FormControl({ value: '', disabled: false }),
    depth: new FormControl({ value: 0, disabled: false }),
    is_subobject: new FormControl({ value: false, disabled: false }),
  });
  repositoryFormGroup = this._formBuilder.group({
    priority: new FormControl({ value: 0, disabled: true }),
    keep_updated: new FormControl({ value: false, disabled: true }),
    mirror_locally: new FormControl({ value: false, disabled: true }),
    comment: new FormControl({ value: '', disabled: true }),
    redhat_management_key: new FormControl({ value: '', disabled: true }),
    mirror_type: new FormControl({ value: '', disabled: true }),
    mirror: new FormControl({ value: '', disabled: true }),
    breed: new FormControl({ value: '', disabled: true }),
    os_version: new FormControl({ value: '', disabled: true }),
    proxy: new FormControl({ value: '', disabled: true }),
    createrepo_flags: new FormControl({ value: '', disabled: true }),
    owners: new FormControl({ value: [], disabled: true }),
    owners_inherited: new FormControl({ value: false, disabled: true }),
    apt_components: new FormControl({ value: [], disabled: true }),
    apt_dists: new FormControl({ value: [], disabled: true }),
    rpm_list: new FormControl({ value: [], disabled: true }),
    environment: new FormControl({ value: new Map(), disabled: true }),
    yumopts: new FormControl({ value: new Map(), disabled: true }),
    rsyncopts: new FormControl({ value: new Map(), disabled: true }),
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
    this.repositoryFormGroup.controls.owners_inherited.valueChanges.subscribe(
      this.getInheritObservable(this.repositoryFormGroup.controls.owners),
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
      .get_repo(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          this.repository = value;
          this.repositoryReadonlyFormGroup.controls.name.setValue(
            this.repository.name,
          );
          this.repositoryReadonlyFormGroup.controls.uid.setValue(
            this.repository.uid,
          );
          this.repositoryReadonlyFormGroup.controls.mtime.setValue(
            new Date(this.repository.mtime * 1000).toString(),
          );
          this.repositoryReadonlyFormGroup.controls.ctime.setValue(
            new Date(this.repository.ctime * 1000).toString(),
          );
          this.repositoryReadonlyFormGroup.controls.depth.setValue(
            this.repository.depth,
          );
          this.repositoryReadonlyFormGroup.controls.is_subobject.setValue(
            this.repository.is_subobject,
          );
          this.repositoryFormGroup.controls.priority.setValue(
            this.repository.priority,
          );
          this.repositoryFormGroup.controls.keep_updated.setValue(
            this.repository.keep_updated,
          );
          this.repositoryFormGroup.controls.mirror_locally.setValue(
            this.repository.mirror_locally,
          );
          this.repositoryFormGroup.controls.comment.setValue(
            this.repository.comment,
          );
          this.repositoryFormGroup.controls.proxy.setValue(
            this.repository.proxy,
          );
          this.repositoryFormGroup.controls.mirror_type.setValue(
            this.repository.mirror_type,
          );
          this.repositoryFormGroup.controls.mirror.setValue(
            this.repository.mirror,
          );
          this.repositoryFormGroup.controls.breed.setValue(
            this.repository.breed,
          );
          this.repositoryFormGroup.controls.os_version.setValue(
            this.repository.os_version,
          );
          this.repositoryFormGroup.controls.createrepo_flags.setValue(
            this.repository.createrepo_flags,
          );
          this.repositoryFormGroup.controls.rpm_list.setValue(
            this.repository.rpm_list,
          );
          this.repositoryFormGroup.controls.apt_dists.setValue(
            this.repository.apt_dists,
          );
          this.repositoryFormGroup.controls.apt_components.setValue(
            this.repository.apt_components,
          );
          if (typeof this.repository.owners === 'string') {
            this.repositoryFormGroup.controls.owners_inherited.setValue(true);
            this.repositoryFormGroup.controls.owners.setValue([]);
          } else {
            this.repositoryFormGroup.controls.owners_inherited.setValue(false);
            this.repositoryFormGroup.controls.owners.setValue(
              this.repository.owners,
            );
          }
          if (typeof this.repository.environment === 'string') {
            this.repositoryFormGroup.controls.environment.setValue(new Map());
          } else {
            this.repositoryFormGroup.controls.environment.setValue(
              this.repository.environment,
            );
          }
          if (typeof this.repository.yumopts === 'string') {
            this.repositoryFormGroup.controls.yumopts.setValue(new Map());
          } else {
            this.repositoryFormGroup.controls.yumopts.setValue(
              this.repository.yumopts,
            );
          }
          if (typeof this.repository.rsyncopts === 'string') {
            this.repositoryFormGroup.controls.rsyncopts.setValue(new Map());
          } else {
            this.repositoryFormGroup.controls.rsyncopts.setValue(
              this.repository.rsyncopts,
            );
          }
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }

  removeRepository(): void {
    this.cobblerApiService
      .remove_repo(this.name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          if (value) {
            this.router.navigate(['/items', 'repository']);
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

  editRepository(): void {
    this.isEditMode = true;
    this.repositoryFormGroup.enable();
    // Inherit inputs
    if (typeof this.repository.owners === 'string') {
      this.repositoryFormGroup.controls.owners.disable();
    }
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmCancelEditComponent, {
      data: {
        name: this.repository.name,
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === false) {
        // False means the user want's to continue
        return;
      }
      this.isEditMode = false;
      this.repositoryFormGroup.disable();
      this.refreshData();
    });
  }

  copyRepository(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemCopyComponent, {
      data: {
        itemType: 'Repository',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the repository
        return;
      }
      this.cobblerApiService
        .get_repo_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (repositoryHandle) => {
            this.cobblerApiService
              .copy_repo(repositoryHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                (value) => {
                  this.router.navigate(['/items', 'repository', newItemName]);
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

  saveRepository(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.repositoryFormGroup,
      Utils.getDirtyValues(this.repositoryFormGroup),
    );
    this.cobblerApiService
      .get_repo_handle(this.name, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (repositoryHandle) => {
          let modifyObservables: Observable<boolean>[] = [];
          dirtyValues.forEach((value, key) => {
            modifyObservables.push(
              this.cobblerApiService.modify_repo(
                repositoryHandle,
                key,
                value,
                this.userService.token,
              ),
            );
          });
          combineLatest(modifyObservables).subscribe(
            (value) => {
              this.cobblerApiService
                .save_repo(repositoryHandle, this.userService.token)
                .subscribe(
                  (value1) => {
                    this.isEditMode = false;
                    this.repositoryFormGroup.disable();
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
