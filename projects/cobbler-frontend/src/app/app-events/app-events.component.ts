import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterOutlet } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CobblerApiService, Event } from 'cobbler-api';
import { DialogBoxTextConfirmComponent } from '../common/dialog-box-text-confirm/dialog-box-text-confirm';

@Component({
  selector: 'cobbler-app-events',
  templateUrl: './app-events.component.html',
  styleUrls: ['./app-events.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    MatListModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    DatePipe,
    CommonModule,
  ],
})
export class AppEventsComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'state',
    'statetime',
    'readByWho',
    'actions',
  ];
  cobblerEvents = new MatTableDataSource<Event>([]);

  constructor(
    @Inject(MatDialog) readonly dialog: MatDialog,
    private cobblerApiService: CobblerApiService,
  ) {}

  ngOnInit(): void {
    this.cobblerApiService.get_events('').subscribe((value: Array<Event>) => {
      this.cobblerEvents.data = value;
    });
  }

  showLogs(eventId: string, name: string) {
    this.cobblerApiService.get_event_log(eventId).subscribe((value: string) => {
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
