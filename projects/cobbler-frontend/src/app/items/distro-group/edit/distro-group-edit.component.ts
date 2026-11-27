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
import { CobblerApiService, DistroGroup } from 'cobbler-api';
import { forkJoin, Subject } from 'rxjs';
import { switchMap, takeUntil, finalize } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
import { UserService } from '../../../services/user.service';
import Utils, { CobblerInputChoices, CobblerInputData } from '../../../utils';
import { DialogBoxItemRenderedComponent } from '../../../common/dialog-box-item-rendered/dialog-box-item-rendered.component';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import { ItemReferenceComponent } from '../../../common/item-reference/item-reference.component';
import { MultiSelectStrictComponent } from '../../../common/multi-select-strict/multi-select-strict.component';
import {
  cobblerItemEditableData,
  cobblerItemReadonlyData,
} from '../../metadata';
import { HelpButtonComponent } from '../../../common/help-button/help-button.component';

@Component({
  selector: 'cobbler-distro-group-edit',
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
    ItemReferenceComponent,
    HelpButtonComponent,
  ],
  templateUrl: './distro-group-edit.component.html',
  styleUrl: './distro-group-edit.component.scss',
})
export class DistroGroupEditComponent implements OnInit, OnDestroy {
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
  distroGroupReadonlyInputData = cobblerItemReadonlyData;
  distroGroupEditableInputData: Array<CobblerInputData> = [
    ...cobblerItemEditableData,
    {
      formControlName: 'parent',
      inputType: CobblerInputChoices.ITEM_REFERENCE,
      label: $localize`:@@distro-group.edit.label.parent:Parent`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      options: [],
      itemRoute: ['/items', 'distro-group'],
      hint: $localize`:@@distro-group.edit.hint.parent:UID of the parent distro group.`,
    },
    {
      formControlName: 'members',
      inputType: CobblerInputChoices.MULTI_SELECT_STRICT_DROPDOWN,
      label: $localize`:@@distro-group.edit.label.members:Members`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      options: [],
      itemRoute: ['/items', 'distro'],
      hint: $localize`:@@distro-group.edit.hint.members:The distros that belong to this group.`,
    },
  ];

  // Form
  name: string;
  distroGroup: DistroGroup;
  private readonly _formBuilder = inject(FormBuilder);
  distroGroupReadonlyFormGroup = this._formBuilder.group({});
  distroGroupFormGroup = this._formBuilder.group({});
  isEditMode: boolean = false;
  saving: boolean = false;

  constructor() {
    Utils.fillupItemFormGroup(
      this.distroGroupReadonlyFormGroup,
      this.distroGroupFormGroup,
      this.distroGroupReadonlyInputData,
      this.distroGroupEditableInputData,
    );
  }

  ngOnInit(): void {
    // Copying navigates to the copy's URL, which reuses this component: reload on every name change.
    Utils.routeParamChanges(this.route, 'name')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((name) => {
        this.name = name;
        this.isEditMode = false;
        this.distroGroupFormGroup.disable();
        this.distroGroupFormGroup.markAsPristine();
        this.refreshData();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  refreshData(): void {
    this.cobblerApiService
      .get_distro_group_handle(this.name)
      .pipe(
        switchMap((uid) =>
          forkJoin({
            distroGroup: this.cobblerApiService.get_distro_group(
              uid,
              false,
              false,
              this.userService.token,
            ),
            distros: this.cobblerApiService.get_distros(),
            distroGroups: this.cobblerApiService.get_distro_groups(),
          }),
        ),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: ({ distroGroup: value, distros, distroGroups }) => {
          this.distroGroup = value;

          // The members are stored as uids but need to be displayed as names.
          const membersInput = this.distroGroupEditableInputData.find(
            (input) => input.formControlName === 'members',
          );
          if (membersInput) {
            membersInput.options = distros.map((distro) => ({
              value: distro.uid,
              label: distro.name,
            }));
          }

          const parentInput = this.distroGroupEditableInputData.find(
            (input) => input.formControlName === 'parent',
          );
          if (parentInput) {
            // A group cannot be its own parent.
            parentInput.options = distroGroups
              .filter((otherGroup) => otherGroup.uid !== value.uid)
              .map((otherGroup) => ({
                value: otherGroup.uid,
                label: otherGroup.name,
              }));
          }

          this.distroGroupReadonlyFormGroup.patchValue({
            name: this.distroGroup.name,
            uid: this.distroGroup.uid,
            mtime: Utils.floatToDate(this.distroGroup.mtime).toString(),
            ctime: Utils.floatToDate(this.distroGroup.ctime).toString(),
            depth: this.distroGroup.depth,
            is_subobject: this.distroGroup.is_subobject,
          });
          this.distroGroupFormGroup.patchValue({
            comment: this.distroGroup.comment,
            parent: this.distroGroup.parent,
            members: this.distroGroup.members,
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

  removeDistroGroup(): void {
    this.cobblerApiService
      .remove_distro_group(this.distroGroup.uid, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this.router.navigate(['/items', 'distro-group']);
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

  editDistroGroup(): void {
    this.isEditMode = true;
    this.distroGroupFormGroup.enable();
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmCancelEditComponent, {
      data: {
        name: this.distroGroup.name,
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === false) {
        // False means the user want's to continue
        return;
      }
      this.isEditMode = false;
      this.distroGroupFormGroup.disable();
      this.distroGroupFormGroup.markAsPristine();
      this.refreshData();
    });
  }

  showAsRendered(): void {
    this.cobblerApiService
      .get_distro_group_as_rendered(
        this.distroGroup.uid,
        this.userService.token,
      )
      .subscribe((value) => {
        this.dialog.open(DialogBoxItemRenderedComponent, {
          data: {
            itemType: 'DistroGroup',
            uid: this.distroGroup.uid,
            name: this.distroGroup.name,
            renderedData: value,
          },
        });
      });
  }

  copyDistroGroup(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemCopyComponent, {
      data: {
        itemType: 'DistroGroup',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the distro group
        return;
      }
      this.cobblerApiService
        .get_distro_group_handle(name)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (distroGroupHandle) => {
            this.cobblerApiService
              .copy_distro_group(
                distroGroupHandle,
                newItemName,
                this.userService.token,
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.router.navigate(['/items', 'distro-group', newItemName]);
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

  saveDistroGroup(): void {
    if (this.saving) {
      // A save is already in flight; a second modify/save sequence would race it on the server.
      return;
    }
    this.saving = true;
    const dirtyValues = Utils.deduplicateDirtyValues(
      this.distroGroupFormGroup,
      Utils.getDirtyValues(this.distroGroupFormGroup),
    );
    this.cobblerApiService
      .get_distro_group_handle(this.name)
      .pipe(
        switchMap((distroGroupHandle) =>
          Utils.modifySequentially(dirtyValues, (attribute, value) =>
            this.cobblerApiService.modify_distro_group(
              distroGroupHandle,
              [attribute],
              value,
              this.userService.token,
            ),
          ).pipe(
            switchMap(() =>
              this.cobblerApiService.save_distro_group(
                distroGroupHandle,
                true,
                true,
                'bypass',
                this.userService.token,
              ),
            ),
          ),
        ),
        finalize(() => (this.saving = false)),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: () => {
          this.isEditMode = false;
          this.distroGroupFormGroup.disable();
          this.distroGroupFormGroup.markAsPristine();
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
