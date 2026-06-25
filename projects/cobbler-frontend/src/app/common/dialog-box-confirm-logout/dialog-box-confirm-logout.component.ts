import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'cobbler-dialog-box-confirm-logout',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog-box-confirm-logout.component.html',
  styleUrl: './dialog-box-confirm-logout.component.scss',
})
export class DialogBoxConfirmLogoutComponent {}
