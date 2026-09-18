import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Utils from '../../utils';

@Component({
  selector: 'cobbler-view-autoinstall',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './view-autoinstall.component.html',
  styleUrl: './view-autoinstall.component.scss',
})
export class ViewAutoinstallComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Data
  type: string;
  name: string;
  autoinstallFormControl = new FormControl('');
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor() {
    this.type = this.route.snapshot.data['autoinstallType'];
    this.name = this.route.snapshot.paramMap.get('name');
  }

  ngOnInit(): void {
    if (this.type !== 'profile' && this.type !== 'system') {
      throw new Error('Object type was neither profile nor system!');
    }
    this.cobblerApiService
      .generate_autoinstall(this.name, this.type, 'name', '', '')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.autoinstallFormControl.setValue(value);
          this.autosize?.resizeToFitContent(true);
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  triggerResize() {
    this.autosize.resizeToFitContent(true);
  }

  backToItem() {
    this.router.navigate(['/items', this.type, this.name]);
  }
}
