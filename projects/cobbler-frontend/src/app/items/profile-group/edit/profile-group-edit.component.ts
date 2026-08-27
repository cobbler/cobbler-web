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
import { CobblerApiService, ProfileGroup } from 'cobbler-api';
import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
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
  selector: 'cobbler-profile-group-edit',
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
  templateUrl: './profile-group-edit.component.html',
  styleUrl: './profile-group-edit.component.scss',
})
export class ProfileGroupEditComponent implements OnInit, OnDestroy {
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
  profileGroupReadonlyInputData = cobblerItemReadonlyData;
  profileGroupEditableInputData: Array<CobblerInputData> = [
    ...cobblerItemEditableData,
    {
      formControlName: 'parent',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@profile-group.edit.label.parent:Parent`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@profile-group.edit.hint.parent:Name of the parent profile group.`,
    },
    {
      formControlName: 'members',
      inputType: CobblerInputChoices.MULTI_SELECT_STRICT_DROPDOWN,
      label: $localize`:@@profile-group.edit.label.members:Members`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      options: [],
      itemRoute: ['/items', 'profile'],
      hint: $localize`:@@profile-group.edit.hint.members:The profiles that belong to this group.`,
    },
  ];

  // Form
  name: string;
  profileGroup: ProfileGroup;
  private readonly _formBuilder = inject(FormBuilder);
  profileGroupReadonlyFormGroup = this._formBuilder.group({});
  profileGroupFormGroup = this._formBuilder.group({});
  isEditMode: boolean = false;

  constructor() {
    this.name = this.route.snapshot.paramMap.get('name');
    Utils.fillupItemFormGroup(
      this.profileGroupReadonlyFormGroup,
      this.profileGroupFormGroup,
      this.profileGroupReadonlyInputData,
      this.profileGroupEditableInputData,
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
    this.cobblerApiService
      .get_profile_group_handle(this.name)
      .pipe(
        switchMap((uid) =>
          forkJoin({
            profileGroup: this.cobblerApiService.get_profile_group(
              uid,
              false,
              false,
              this.userService.token,
            ),
            profiles: this.cobblerApiService.get_profiles(),
          }),
        ),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: ({ profileGroup: value, profiles }) => {
          this.profileGroup = value;

          // The members are stored as uids but need to be displayed as names.
          const membersInput = this.profileGroupEditableInputData.find(
            (input) => input.formControlName === 'members',
          );
          if (membersInput) {
            membersInput.options = profiles.map((profile) => ({
              value: profile.uid,
              label: profile.name,
            }));
          }

          this.profileGroupReadonlyFormGroup.patchValue({
            name: this.profileGroup.name,
            uid: this.profileGroup.uid,
            mtime: Utils.floatToDate(this.profileGroup.mtime).toString(),
            ctime: Utils.floatToDate(this.profileGroup.ctime).toString(),
            depth: this.profileGroup.depth,
            is_subobject: this.profileGroup.is_subobject,
          });
          this.profileGroupFormGroup.patchValue({
            comment: this.profileGroup.comment,
            parent: this.profileGroup.parent,
            members: this.profileGroup.members,
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

  removeProfileGroup(): void {
    this.cobblerApiService
      .remove_profile_group(
        this.profileGroup.uid,
        this.userService.token,
        false,
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this.router.navigate(['/items', 'profile-group']);
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

  editProfileGroup(): void {
    this.isEditMode = true;
    this.profileGroupFormGroup.enable();
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmCancelEditComponent, {
      data: {
        name: this.profileGroup.name,
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === false) {
        // False means the user want's to continue
        return;
      }
      this.isEditMode = false;
      this.profileGroupFormGroup.disable();
      this.refreshData();
    });
  }

  showAsRendered(): void {
    this.cobblerApiService
      .get_profile_group_as_rendered(
        this.profileGroup.name,
        this.userService.token,
      )
      .subscribe((value) => {
        this.dialog.open(DialogBoxItemRenderedComponent, {
          data: {
            itemType: 'ProfileGroup',
            uid: this.profileGroup.uid,
            name: this.profileGroup.name,
            renderedData: value,
          },
        });
      });
  }

  copyProfileGroup(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemCopyComponent, {
      data: {
        itemType: 'ProfileGroup',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the profile group
        return;
      }
      this.cobblerApiService
        .get_profile_group_handle(name)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (profileGroupHandle) => {
            this.cobblerApiService
              .copy_profile_group(
                profileGroupHandle,
                newItemName,
                this.userService.token,
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.router.navigate([
                    '/items',
                    'profile-group',
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

  saveProfileGroup(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.profileGroupFormGroup,
      Utils.getDirtyValues(this.profileGroupFormGroup),
    );
    this.cobblerApiService
      .get_profile_group_handle(this.name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (profileGroupHandle) => {
          let modifyObservables: Observable<boolean>[] = [];
          dirtyValues.forEach((value, key) => {
            modifyObservables.push(
              this.cobblerApiService.modify_profile_group(
                profileGroupHandle,
                [key],
                value,
                this.userService.token,
              ),
            );
          });
          if (modifyObservables.length === 0) {
            // combineLatest([]) completes without ever emitting, so short-circuit to the save.
            this.persistProfileGroup(profileGroupHandle);
            return;
          }
          combineLatest(modifyObservables).subscribe({
            next: () => {
              this.persistProfileGroup(profileGroupHandle);
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

  private persistProfileGroup(profileGroupHandle: string): void {
    this.cobblerApiService
      .save_profile_group(
        profileGroupHandle,
        false,
        false,
        '',
        this.userService.token,
      )
      .subscribe({
        next: () => {
          this.isEditMode = false;
          this.profileGroupFormGroup.disable();
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
