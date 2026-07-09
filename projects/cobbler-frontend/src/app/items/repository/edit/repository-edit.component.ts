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
import { CobblerApiService, Repo } from 'cobbler-api';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import { HelpButtonComponent } from '../../../common/help-button/help-button.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';
import Utils, { CobblerInputChoices, CobblerInputData } from '../../../utils';
import { DialogBoxItemRenderedComponent } from '../../../common/dialog-box-item-rendered/dialog-box-item-rendered.component';
import {
  cobblerItemEditableData,
  cobblerItemReadonlyData,
} from '../../metadata';

@Component({
  selector: 'cobbler-repository-edit',
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
    HelpButtonComponent,
  ],
  templateUrl: './repository-edit.component.html',
  styleUrl: './repository-edit.component.scss',
})
export class RepositoryEditComponent implements OnInit, OnDestroy {
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
  repositoryReadonlyInputData = cobblerItemReadonlyData;
  repositoryEditableInputData: Array<CobblerInputData> = [
    ...cobblerItemEditableData,
    {
      formControlName: 'priority',
      inputType: CobblerInputChoices.NUMBER,
      label: $localize`:@@repo.edit.label.priority:Priority`,
      disabled: true,
      readonly: false,
      defaultValue: 0,
      inherited: false,
      hint: $localize`:@@repo.edit.hint.priority:Yum priority (1 = highest, 99 = default lowest). Only effective when the yum-priorities plugin is installed.`,
    },
    {
      formControlName: 'keep_updated',
      inputType: CobblerInputChoices.CHECKBOX,
      label: $localize`:@@repo.edit.label.keep_updated:Keep Updated?`,
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
      hint: $localize`:@@repo.edit.hint.keep_updated:Synchronize this repository on every cobbler reposync run. Uncheck to freeze the current snapshot.`,
    },
    {
      formControlName: 'mirror_locally',
      inputType: CobblerInputChoices.CHECKBOX,
      label: $localize`:@@repo.edit.label.mirror_locally:Mirror locally?`,
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
      hint: $localize`:@@repo.edit.hint.mirror_locally:Download and store all repository content locally. Requires significant disk space.`,
    },
    {
      formControlName: 'redhat_management_key',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@repo.edit.label.redhat_management_key:RedHat Management Key`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'mirror_type',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@repo.edit.label.mirror_type:Mirror Type`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@repo.edit.hint.mirror_type:Protocol type used for reposync (overrides the default).`,
    },
    {
      formControlName: 'mirror',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@repo.edit.label.mirror:Mirror`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@repo.edit.hint.mirror:URL to the upstream source to sync from (rsync, http, ftp, or yum).`,
    },
    {
      formControlName: 'breed',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@repo.edit.label.breed:Breed`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@repo.edit.hint.breed:Repository system family (e.g. yum, apt, rsync). Controls default reposync behavior.`,
    },
    {
      formControlName: 'os_version',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@repo.edit.label.os_version:OS Version`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@repo.edit.hint.os_version:OS version this repository is compatible with.`,
    },
    {
      formControlName: 'proxy',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@repo.edit.label.proxy:Proxy`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@repo.edit.hint.proxy:HTTP proxy URL for reaching the upstream mirror. Supports <<inherit>>.`,
    },
    {
      formControlName: 'createrepo_flags',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@repo.edit.label.createrepo_flags:createrepo Flags`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@repo.edit.hint.createrepo_flags:Flags passed to createrepo, e.g. "-c cache -g comps.xml". Supports <<inherit>>.`,
    },
    {
      formControlName: 'owners',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@repo.edit.label.owners:Owners`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
      hint: $localize`:@@repo.edit.hint.owners:Cobbler user accounts allowed to manage this item. Cosmetic only — not validated against real users. Supports <<inherit>>.`,
    },
    {
      formControlName: 'apt_components',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@repo.edit.label.apt_components:APT Components`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      hint: $localize`:@@repo.edit.hint.apt_components:Debian repository sections to mirror, e.g. "main contrib non-free".`,
    },
    {
      formControlName: 'apt_dists',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@repo.edit.label.apt_dists:APT Dists`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      hint: $localize`:@@repo.edit.hint.apt_dists:Debian distribution codenames to mirror, e.g. "bookworm bookworm-updates".`,
    },
    {
      formControlName: 'rpm_list',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@repo.edit.label.rpm_list:RPM List`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      hint: $localize`:@@repo.edit.hint.rpm_list:Limit the mirror to only these package names (space-separated). Leave empty to mirror everything.`,
    },
    {
      formControlName: 'environment',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@repo.edit.label.environment:Environment Variables`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: false,
      hint: $localize`:@@repo.edit.hint.environment:Environment variables set before each reposync run, as key=value pairs.`,
    },
    {
      formControlName: 'yumopts',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@repo.edit.label.yumopts:YUM Options`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: false,
      hint: $localize`:@@repo.edit.hint.yumopts:Additional options passed to yum/dnf during reposync, as key=value pairs.`,
    },
    {
      formControlName: 'rsyncopts',
      inputType: CobblerInputChoices.KEY_VALUE,
      label: $localize`:@@repo.edit.label.rsyncopts:rsync Options`,
      disabled: true,
      readonly: false,
      defaultValue: new Map<string, any>(),
      inherited: false,
      hint: $localize`:@@repo.edit.hint.rsyncopts:Additional options passed to rsync during reposync.`,
    },
  ];

  // Form
  name: string;
  repository: Repo;
  private readonly _formBuilder = inject(FormBuilder);
  repositoryReadonlyFormGroup = this._formBuilder.group({});
  repositoryFormGroup = this._formBuilder.group({});
  isEditMode: boolean = false;

  constructor() {
    this.name = this.route.snapshot.paramMap.get('name');
    Utils.fillupItemFormGroup(
      this.repositoryReadonlyFormGroup,
      this.repositoryFormGroup,
      this.repositoryReadonlyInputData,
      this.repositoryEditableInputData,
    );
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
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
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
                  this.router.navigate([
                    '/manage',
                    'items',
                    'repository',
                    newItemName,
                  ]);
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
