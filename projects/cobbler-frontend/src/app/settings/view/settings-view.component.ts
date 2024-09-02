import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Settings } from '../../../../../cobbler-api/src/lib/custom-types/settings';
import { ItemSettingsService } from '../../services/item-settings.service';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { ViewableTreeComponent } from '../../common/viewable-tree/viewable-tree.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

interface SettingsTableRowData {
  name: string;
  value: any;
  type: any;
}

@Component({
  selector: 'cobbler-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css'],

  standalone: true,
  imports: [
    RouterOutlet,
    MatFormFieldModule,
    MatPaginatorModule,
    MatIconModule,
    MatSlideToggleModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    ViewableTreeComponent,
    MatTooltipModule,
    MatSortModule,
  ],
})
export class SettingsViewComponent implements AfterViewInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Table
  data = new MatTableDataSource<SettingsTableRowData>([]);
  displayedColumns: string[] = ['name', 'value', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(service: ItemSettingsService) {
    service.getAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: Settings) => {
        const settings_data: SettingsTableRowData[] = [];
        for (const key in data) {
          settings_data.push({
            name: key,
            value: data[key],
            type: typeof data[key],
          });
      }
      this.data.data = settings_data;
    });
  }

  ngAfterViewInit() {
    this.data.paginator = this.paginator;
    this.data.sort = this.sort;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();

    if (this.data.paginator) {
      this.data.paginator.firstPage();
    }
  }

  isArray(input: any): boolean {
    return Array.isArray(input);
  }
}
