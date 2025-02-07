import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
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
import { CobblerApiService, Repo } from 'cobbler-api';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';
import Utils, { CobblerInputChoices, CobblerInputData } from '../../../utils';
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
    MatTooltip,
    ReactiveFormsModule,
    MultiSelectComponent,
    KeyValueEditorComponent,
  ],
  templateUrl: './repository-edit.component.html',
  styleUrl: './repository-edit.component.scss',
})
export class RepositoryEditComponent implements OnInit, OnDestroy {
  // Bring Enum to HTML scope
  protected readonly CobblerInputChoices = CobblerInputChoices;

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form data
  repositoryReadonlyInputData: Array<CobblerInputData> = [
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
  repositoryEditableInputData: Array<CobblerInputData> = [
    {
      formControlName: 'priority',
      inputType: CobblerInputChoices.NUMBER,
      label: 'Priority',
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: false,
    },
    {
      formControlName: 'keep_updated',
      inputType: CobblerInputChoices.CHECKBOX,
      label: 'Keep Updated?',
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
    },
    {
      formControlName: 'mirror_locally',
      inputType: CobblerInputChoices.CHECKBOX,
      label: 'Mirror locally?',
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
      formControlName: 'redhat_management_key',
      inputType: CobblerInputChoices.TEXT,
      label: 'RedHat Management Key',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'mirror_type',
      inputType: CobblerInputChoices.TEXT,
      label: 'Mirror Type',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'mirror',
      inputType: CobblerInputChoices.TEXT,
      label: 'Mirror',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'breed',
      inputType: CobblerInputChoices.TEXT,
      label: 'Breed',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'os_version',
      inputType: CobblerInputChoices.TEXT,
      label: 'OS Version',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'proxy',
      inputType: CobblerInputChoices.TEXT,
      label: 'Proxy',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'createrepo_flags',
      inputType: CobblerInputChoices.TEXT,
      label: 'createrepo Flags',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'owners',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'Owners',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
    },
    {
      formControlName: 'apt_components',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'APT Components',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
    },
    {
      formControlName: 'apt_dists',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'APT Dists',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
    },
    {
      formControlName: 'rpm_list',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'RPM List',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
    },
    {
      formControlName: 'environment',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: 'Environment Variables',
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: false,
    },
    {
      formControlName: 'yumopts',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: 'YUM Options',
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: false,
    },
    {
      formControlName: 'rsyncopts',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: 'rsync Options',
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: false,
    },
  ];

  // Form
  name: string;
  repository: Repo;
  private readonly _formBuilder = inject(FormBuilder);
  repositoryReadonlyFormGroup = this._formBuilder.group({});
  repositoryFormGroup = this._formBuilder.group({});
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
    this.repositoryReadonlyInputData.forEach((value) => {
      this.repositoryReadonlyFormGroup.addControl(
        value.formControlName,
        new FormControl({
          value: value.defaultValue,
          disabled: value.disabled,
        }),
      );
      if (value.inherited) {
        this.repositoryReadonlyFormGroup.addControl(
          value.formControlName + '_inherited',
          new FormControl({
            value: false,
            disabled: value.disabled,
          }),
        );
      }
    });
    this.repositoryEditableInputData.forEach((value) => {
      this.repositoryFormGroup.addControl(
        value.formControlName,
        new FormControl({
          value: value.defaultValue,
          disabled: value.disabled,
        }),
      );
      if (value.inherited) {
        this.repositoryFormGroup.addControl(
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
    // Observables for inherited properties
    this.repositoryFormGroup
      .get('owners_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.repositoryFormGroup.get('owners')),
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
      .get_repo(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.repository = value;
          this.repositoryReadonlyFormGroup.patchValue({
            name: this.repository.name,
            uid: this.repository.uid,
            mtime: Utils.floatToDate(this.repository.mtime).toString(),
            ctime: Utils.floatToDate(this.repository.ctime).toString(),
            depth: this.repository.depth,
            is_subobject: this.repository.is_subobject,
          });
          this.repositoryFormGroup.patchValue({
            priority: this.repository.priority,
            keep_updated: this.repository.keep_updated,
            mirror_locally: this.repository.mirror_locally,
            comment: this.repository.comment,
            proxy: this.repository.proxy,
            mirror_type: this.repository.mirror_type,
            mirror: this.repository.mirror,
            breed: this.repository.breed,
            os_version: this.repository.os_version,
            creatrepo_flags: this.repository.createrepo_flags,
            rpm_list: this.repository.rpm_list,
            apt_dists: this.repository.apt_dists,
            apt_components: this.repository.apt_components,
          });
          Utils.patchFormGroupInherited(
            this.repositoryFormGroup,
            this.repository.owners,
            'owners',
            [],
          );
          Utils.patchFormGroupInherited(
            this.repositoryFormGroup,
            this.repository.environment,
            'environment',
            new Map(),
          );
          Utils.patchFormGroupInherited(
            this.repositoryFormGroup,
            this.repository.yumopts,
            'yumopts',
            new Map(),
          );
          Utils.patchFormGroupInherited(
            this.repositoryFormGroup,
            this.repository.rsyncopts,
            'rsyncopts',
            new Map(),
          );
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }

  removeRepository(): void {
    this.cobblerApiService
      .remove_repo(this.name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this.router.navigate(['/items', 'repository']);
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

  editRepository(): void {
    this.isEditMode = true;
    this.repositoryFormGroup.enable();
    // Inherit inputs
    if (typeof this.repository.owners === 'string') {
      this.repositoryFormGroup.get('owners').disable();
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

  showAsRendered(): void {
    this.cobblerApiService
      .get_repo_as_rendered(this.repository.name, this.userService.token)
      .subscribe((value) => {
        this.dialog.open(DialogBoxItemRenderedComponent, {
          data: {
            itemType: 'Repository',
            uid: this.repository.uid,
            name: this.repository.name,
            renderedData: value,
          },
        });
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
        .subscribe({
          next: (repositoryHandle) => {
            this.cobblerApiService
              .copy_repo(repositoryHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.router.navigate(['/items', 'repository', newItemName]);
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

  saveRepository(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.repositoryFormGroup,
      Utils.getDirtyValues(this.repositoryFormGroup),
    );
    this.cobblerApiService
      .get_repo_handle(this.name, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (repositoryHandle) => {
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
          combineLatest(modifyObservables).subscribe({
            next: () => {
              this.cobblerApiService
                .save_repo(repositoryHandle, this.userService.token)
                .subscribe({
                  next: () => {
                    this.isEditMode = false;
                    this.repositoryFormGroup.disable();
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
