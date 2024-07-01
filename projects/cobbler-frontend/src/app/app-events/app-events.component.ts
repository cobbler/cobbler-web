import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {CobblerApiService, Event} from 'cobbler-api';

export interface DialogData {
  eventId: string,
  name: string,
  eventLog: string,
}

@Component({
  selector: 'cobbler-app-events',
  templateUrl: './app-events.component.html',
  styleUrls: ['./app-events.component.css']
})
export class AppEventsComponent {
  displayedColumns: string[] = ['name', 'state', 'statetime', 'readByWho', 'actions'];
  cobblerEvents = new MatTableDataSource<Event>([]);

  constructor(
    @Inject(MatDialog) readonly dialog: MatDialog,
    private cobblerApiService: CobblerApiService,
  ) {
    cobblerApiService.get_events("").subscribe((value: Array<Event>) => {
      this.cobblerEvents.data = value
      console.log(value)
    })
    // TODO: Have page with fixed top for event details and scrollable text field for the log
  }

  showLogs(eventId: string, name: string) {
    this.cobblerApiService.get_event_log(eventId).subscribe((value: string) => {
      const dialogRef = this.dialog.open(DialogContentExampleDialog, {
        data: {
          eventId: eventId,
          name: name,
          eventLog: value
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    })
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
  styleUrls: ['./dialog-content-example-dialog.css']
})
export class DialogContentExampleDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

}

