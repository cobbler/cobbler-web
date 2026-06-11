import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CobblerApiService, Image } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogItemRenameComponent } from '../../../common/dialog-item-rename/dialog-item-rename.component';
import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';
import { ImageCreateComponent } from '../create/image-create.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'cobbler-image-overview',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSort,
    MatInputModule,
    MatFormFieldModule,
    RouterLink,
  ],
  templateUrl: './image-overview.component.html',
  styleUrl: './image-overview.component.scss',
})
export class ImageOverviewComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  readonly dialog = inject<MatDialog>(MatDialog);
  private route = inject(ActivatedRoute);
  private targetImage: string | null = null;

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Table
  displayedColumns: string[] = [
    'name',
    'arch',
    'breed',
    'os_version',
    'actions',
  ];
  dataSource = new MatTableDataSource<Image>([]);

  @ViewChild(MatTable) table!: MatTable<Image>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') filterField!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.retrieveImages();
    this.targetImage = this.route.snapshot.queryParamMap.get('image');
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.targetImage) {
      this.filterField.nativeElement.value = this.targetImage;
      this.dataSource.filter = this.targetImage;
    } else {
      this.filterField.nativeElement.value = '';
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    // Remove query param on URL when filtering
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { image: null },
      queryParamsHandling: 'merge',
    });
  }

  private retrieveImages(): void {
    this.cobblerApiService
      .get_images()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.dataSource.data = value;
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }

  addImage(): void {
    const dialogRef = this.dialog.open(ImageCreateComponent, { width: '40%' });
    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'string') {
        this.router.navigate(['/manage', 'items', 'image', result]);
      }
    });
  }

  showImage(uid: string, name: string): void {
    this.router.navigate(['/manage', 'items', 'image', name]);
  }

  renameImage(uid: string, name: string): void {
    const dialogRef = this.dialog.open(DialogItemRenameComponent, {
      data: {
        itemType: 'Image',
        itemName: name,
        itemUid: uid,
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to rename the image
        return;
      }
      this.cobblerApiService
        .get_image_handle(name, this.userService.token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (imageHandle) => {
            this.cobblerApiService
              .rename_image(imageHandle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.retrieveImages();
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

  deleteImage(uid: string, name: string): void {
    this.cobblerApiService
      .remove_distro(name, this.userService.token, false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.retrieveImages();
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }
}
