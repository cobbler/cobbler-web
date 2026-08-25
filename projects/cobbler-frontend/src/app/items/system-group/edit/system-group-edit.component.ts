import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, SystemGroup } from 'cobbler-api';
import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
import { UserService } from '../../../services/user.service';
import Utils, { CobblerInputChoices, CobblerInputData } from '../../../utils';
import { DialogBoxItemRenderedComponent } from '../../../common/dialog-box-item-rendered/dialog-box-item-rendered.component';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import { MultiSelectStrictComponent } from '../../../common/multi-select-strict/multi-select-strict.component';
import {
  cobblerItemEditableData,
  cobblerItemReadonlyData,
} from '../../metadata';
import { HelpButtonComponent } from '../../../common/help-button/help-button.component';

@Component({
  selector: 'cobbler-system-group-edit',
  imports: [
    FormsModule,
    MatButton,
    MatCheckbox,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    MatTooltip,
    ReactiveFormsModule,
    KeyValueEditorComponent,
    MultiSelectStrictComponent,
    HelpButtonComponent,
  ],
  templateUrl: './system-group-edit.component.html',
  styleUrl: './system-group-edit.component.scss',
})
export class SystemGroupEditComponent implements OnInit, OnDestroy {
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
  systemGroupReadonlyInputData = cobblerItemReadonlyData;
  systemGroupEditableInputData: Array<CobblerInputData> = [
    ...cobblerItemEditableData,
    {
      formControlName: 'parent',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@system-group.edit.label.parent:Parent`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@system-group.edit.hint.parent:Name of the parent system group.`,
    },
    {
      formControlName: 'members',
      inputType: CobblerInputChoices.MULTI_SELECT_STRICT_DROPDOWN,
      label: $localize`:@@system-group.edit.label.members:Members`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      options: [],
      hint: $localize`:@@system-group.edit.hint.members:The systems that belong to this group.`,
    },
  ];

  // Form
  name: string;
  systemGroup: SystemGroup;
  private readonly _formBuilder = inject(FormBuilder);
  systemGroupReadonlyFormGroup = this._formBuilder.group({});
  systemGroupFormGroup = this._formBuilder.group({});
  isEditMode: boolean = false;

  constructor() {
    this.name = this.route.snapshot.paramMap.get('name');
    Utils.fillupItemFormGroup(
      this.systemGroupReadonlyFormGroup,
      this.systemGroupFormGroup,
      this.systemGroupReadonlyInputData,
      this.systemGroupEditableInputData,
    );
  }

  ngOnInit(): void {
    this.refreshData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  refreshData(): void {
    forkJoin({
      systemGroup: this.cobblerApiService.get_system_group(
        this.name,
        false,
        false,
        this.userService.token,
      ),
      systems: this.cobblerApiService.get_systems(),
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: ({ systemGroup: value, systems }) => {
          this.systemGroup = value;

          // The members are stored as uids but need to be displayed as names.
          const membersInput = this.systemGroupEditableInputData.find(
            (input) => input.formControlName === 'members',
          );
          if (membersInput) {
            membersInput.options = systems.map((system) => ({
              value: system.uid,
              label: system.name,
            }));
          }

          this.systemGroupReadonlyFormGroup.patchValue({
            name: this.systemGroup.name,
            uid: this.systemGroup.uid,
            mtime: Utils.floatToDate(this.systemGroup.mtime).toString(),
            ctime: Utils.floatToDate(this.systemGroup.ctime).toString(),
            depth: this.systemGroup.depth,
            is_subobject: this.systemGroup.is_subobject,
          });
          this.systemGroupFormGroup.patchValue({
            comment: this.systemGroup.comment,
            parent: this.systemGroup.parent,
            members: this.systemGroup.members,
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
  }

  removeSystemGroup(): void {
    this.cobblerApiService
      .remove_system_group(this.systemGroup.uid, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this.router.navigate(['/items', 'system-group']);
          } else {
            this._snackBar.open(
              $localize`:@@error.delete-failed:Delete failed! Check server logs for more information.`,
              $localize`:@@snackbar.action.close:Close`,
            );
          }
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

  editSystemGroup(): void {
    this.isEditMode = true;
    this.systemGroupFormGroup.enable();
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmCancelEditComponent, {
      data: {
        name: this.systemGroup.name,
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === false) {
        // False means the user want's to continue
        return;
      }
      this.isEditMode = false;
      this.systemGroupFormGroup.disable();
      this.refreshData();
    });
  }

  showAsRendered(): void {
    this.cobblerApiService
      .get_system_group_as_rendered(
        this.systemGroup.name,
        this.userService.token,
      )
      .subscribe((value) => {
        this.dialog.open(DialogBoxItemRenderedComponent, {
          data: {
            itemType: 'SystemGroup',
            uid: this.systemGroup.uid,
            name: this.systemGroup.name,
            renderedData: value,
          },
        });
      });
  }

  copySystemGroup(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemCopyComponent, {
      data: {
        itemType: 'SystemGroup',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the system group
        return;
      }
      this.cobblerApiService
        .get_system_group_handle(name)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (systemGroupHandle) => {
            this.cobblerApiService
              .copy_system_group(
                systemGroupHandle,
                newItemName,
                this.userService.token,
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.router.navigate(['/items', 'system-group', newItemName]);
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

  saveSystemGroup(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.systemGroupFormGroup,
      Utils.getDirtyValues(this.systemGroupFormGroup),
    );
    this.cobblerApiService
      .get_system_group_handle(this.name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (systemGroupHandle) => {
          let modifyObservables: Observable<boolean>[] = [];
          dirtyValues.forEach((value, key) => {
            modifyObservables.push(
              this.cobblerApiService.modify_system_group(
                systemGroupHandle,
                [key],
                value,
                this.userService.token,
              ),
            );
          });
          if (modifyObservables.length === 0) {
            // combineLatest([]) completes without ever emitting, so short-circuit to the save.
            this.persistSystemGroup(systemGroupHandle);
            return;
          }
          combineLatest(modifyObservables).subscribe({
            next: () => {
              this.persistSystemGroup(systemGroupHandle);
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

  private persistSystemGroup(systemGroupHandle: string): void {
    this.cobblerApiService
      .save_system_group(
        systemGroupHandle,
        false,
        false,
        '',
        this.userService.token,
      )
      .subscribe({
        next: () => {
          this.isEditMode = false;
          this.systemGroupFormGroup.disable();
          this.refreshData();
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
