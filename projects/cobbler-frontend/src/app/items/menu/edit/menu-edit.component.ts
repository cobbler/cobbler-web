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
import { CobblerApiService, Menu } from 'cobbler-api';
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
  templateUrl: './menu-edit.component.html',
  styleUrl: './menu-edit.component.scss',
})
export class MenuEditComponent implements OnInit, OnDestroy {
  // Bring Enum to HTML scope
  protected readonly CobblerInputChoices = CobblerInputChoices;

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form data
  menuReadonlyInputData: Array<CobblerInputData> = [
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
  menuEditableInputData: Array<CobblerInputData> = [
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
      formControlName: 'display_name',
      inputType: CobblerInputChoices.TEXT,
      label: 'Display Name',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
  ];

  // Form
  name: string;
  menu: Menu;
  private readonly _formBuilder = inject(FormBuilder);
  menuReadonlyFormGroup = this._formBuilder.group({});
  menuFormGroup = this._formBuilder.group({});
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
    this.menuReadonlyInputData.forEach((value) => {
      this.menuReadonlyFormGroup.addControl(
        value.formControlName,
        new FormControl({
          value: value.defaultValue,
          disabled: value.disabled,
        }),
      );
      if (value.inherited) {
        this.menuReadonlyFormGroup.addControl(
          value.formControlName + '_inherited',
          new FormControl({
            value: false,
            disabled: value.disabled,
          }),
        );
      }
    });
    this.menuEditableInputData.forEach((value) => {
      this.menuFormGroup.addControl(
        value.formControlName,
        new FormControl({
          value: value.defaultValue,
          disabled: value.disabled,
        }),
      );
      if (value.inherited) {
        this.menuFormGroup.addControl(
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
      .get_menu(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.menu = value;
          this.menuReadonlyFormGroup.patchValue({
            name: this.menu.name,
            uid: this.menu.uid,
            mtime: Utils.floatToDate(this.menu.mtime).toString(),
            ctime: Utils.floatToDate(this.menu.ctime).toString(),
            depth: this.menu.depth,
            is_subobject: this.menu.is_subobject,
          });
          this.menuFormGroup.patchValue({
            comment: this.menu.comment,
            display_name: this.menu.display_name,
          });
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }

  removeMenu(): void {
    this.cobblerApiService
      .remove_menu(this.name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this.router.navigate(['/items', 'menu']);
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

  editMenu(): void {
    this.isEditMode = true;
    this.menuFormGroup.enable();
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmCancelEditComponent, {
      data: {
        name: this.menu.name,
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === false) {
        // False means the user want's to continue
        return;
      }
      this.isEditMode = false;
      this.menuFormGroup.disable();
      this.refreshData();
    });
  }

  showAsRendered(): void {
    this.cobblerApiService
      .get_menu_as_rendered(this.menu.name, this.userService.token)
      .subscribe((value) => {
        this.dialog.open(DialogBoxItemRenderedComponent, {
          data: {
            itemType: 'Menu',
            uid: this.menu.uid,
            name: this.menu.name,
            renderedData: value,
          },
        });
      });
  }

  copyMenu(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemCopyComponent, {
      data: {
        itemType: 'Menu',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the menu
        return;
      }
      this.cobblerApiService
        .get_menu_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (menuHandle) => {
            this.cobblerApiService
              .copy_menu(menuHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.router.navigate(['/items', 'menu', newItemName]);
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

  saveMenu(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.menuFormGroup,
      Utils.getDirtyValues(this.menuFormGroup),
    );
    this.cobblerApiService
      .get_menu_handle(this.name, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (menuHandle) => {
          let modifyObservables: Observable<boolean>[] = [];
          dirtyValues.forEach((value, key) => {
            modifyObservables.push(
              this.cobblerApiService.modify_menu(
                menuHandle,
                key,
                value,
                this.userService.token,
              ),
            );
          });
          combineLatest(modifyObservables).subscribe({
            next: () => {
              this.cobblerApiService
                .save_menu(menuHandle, this.userService.token)
                .subscribe({
                  next: () => {
                    this.isEditMode = false;
                    this.menuFormGroup.disable();
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
