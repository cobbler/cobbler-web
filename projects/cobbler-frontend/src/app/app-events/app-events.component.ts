import { CommonModule, DatePipe } from '@angular/common';
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
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterOutlet } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CobblerApiService, Event } from 'cobbler-api';
import { DialogBoxTextConfirmComponent } from '../common/dialog-box-text-confirm/dialog-box-text-confirm';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'cobbler-app-events',
  templateUrl: './app-events.component.html',
  styleUrls: ['./app-events.component.css'],
  providers: [provideNativeDateAdapter()],
  imports: [
    RouterOutlet,
    MatListModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    DatePipe,
    CommonModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
})
export class AppEventsComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly dialog = inject<MatDialog>(MatDialog);
  private cobblerApiService = inject(CobblerApiService);

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Table
  displayedColumns: string[] = [
    'name',
    'state',
    'statetime',
    'readByWho',
    'actions',
  ];
  cobblerEvents = new MatTableDataSource<Event>([]);
  cobblerEventsNames: string[] = ['Loading items', 'Replicate'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('nameSelect') nameSelect!: MatSelect;
  @ViewChild('stateSelect') stateSelect!: MatSelect;
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.cobblerApiService
      .get_events('')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value: Array<Event>) => {
        this.cobblerEvents.data = value;
      });

    // Custom predicate to be able to filter events data table by different parameters
    this.cobblerEvents.filterPredicate = (
      data: Event,
      filter: string,
    ): boolean => {
      const searchTerms = JSON.parse(filter);

      // Validate selected name
      const matchesName = data.name
        ? data.name.toLowerCase().includes(searchTerms.name.toLowerCase())
        : true;

      // Validate selected state
      const matchesState = searchTerms.state
        ? data.state === searchTerms.state
        : true;

      // Validate selected date
      let matchesDate = true;
      if (searchTerms.date) {
        const filterDate = new Date(searchTerms.date).setHours(0, 0, 0, 0);
        const eventDate = new Date(data.statetime * 1000).setHours(0, 0, 0, 0);
        matchesDate = eventDate === filterDate;
      }

      return matchesName && matchesState && matchesDate;
    };
  }

  ngAfterViewInit(): void {
    this.cobblerEvents.paginator = this.paginator;
    this.cobblerEvents.sort = this.sort;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  applyFilter() {
    const filterValues = {
      name: this.nameSelect?.value || '',
      state: this.stateSelect?.value || '',
      date: this.dateInput.nativeElement.value || '',
    };

    this.cobblerEvents.filter = JSON.stringify(filterValues);

    if (this.cobblerEvents.paginator) {
      this.cobblerEvents.paginator.firstPage();
    }
  }

  showLogs(eventId: string, name: string) {
    this.cobblerApiService
      .get_event_log(eventId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value: string) => {
        const dialogRef = this.dialog.open(DialogBoxTextConfirmComponent, {
          data: {
            eventId: eventId,
            name: name,
            eventLog: value,
          },
        });

        dialogRef.afterClosed().subscribe();
      });
  }
}
