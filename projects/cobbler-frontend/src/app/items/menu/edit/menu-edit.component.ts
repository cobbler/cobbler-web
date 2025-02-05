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
    MatTooltip,
    ReactiveFormsModule,
  ],
  templateUrl: './menu-edit.component.html',
  styleUrl: './menu-edit.component.scss',
})
export class MenuEditComponent implements OnInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  name: string;
  menu: Menu;
  private readonly _formBuilder = inject(FormBuilder);
  menuReadonlyFormGroup = this._formBuilder.group({
    name: new FormControl({ value: '', disabled: false }),
    uid: new FormControl({ value: '', disabled: false }),
    mtime: new FormControl({ value: '', disabled: false }),
    ctime: new FormControl({ value: '', disabled: false }),
    depth: new FormControl({ value: 0, disabled: false }),
    is_subobject: new FormControl({ value: false, disabled: false }),
  });
  menuFormGroup = this._formBuilder.group({
    comment: new FormControl({ value: '', disabled: true }),
    display_name: new FormControl({ value: '', disabled: true }),
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
      .get_menu(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.menu = value;
          this.menuReadonlyFormGroup.controls.name.setValue(this.menu.name);
          this.menuReadonlyFormGroup.controls.uid.setValue(this.menu.uid);
          this.menuReadonlyFormGroup.controls.mtime.setValue(
            new Date(this.menu.mtime * 1000).toString(),
          );
          this.menuReadonlyFormGroup.controls.ctime.setValue(
            new Date(this.menu.ctime * 1000).toString(),
          );
          this.menuReadonlyFormGroup.controls.depth.setValue(this.menu.depth);
          this.menuReadonlyFormGroup.controls.is_subobject.setValue(
            this.menu.is_subobject,
          );
          this.menuFormGroup.controls.comment.setValue(this.menu.comment);
          this.menuFormGroup.controls.display_name.setValue(
            this.menu.display_name,
          );
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
        const dialogRef = this.dialog.open(DialogBoxItemRenderedComponent, {
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
                next: (value) => {
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
            next: (value) => {
              this.cobblerApiService
                .save_menu(menuHandle, this.userService.token)
                .subscribe({
                  next: (value1) => {
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
