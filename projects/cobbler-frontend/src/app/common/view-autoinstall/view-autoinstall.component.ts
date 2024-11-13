import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cobbler-view-autoinstall',
  standalone: true,
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
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Data
  type: string;
  name: string;
  autoinstallFormControl = new FormControl('');
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cobblerApiService: CobblerApiService,
  ) {
    this.type = this.route.snapshot.url[0].path;
    this.name = this.route.snapshot.paramMap.get('name');
  }

  ngOnInit(): void {
    if (this.type === 'profile') {
      this.cobblerApiService
        .generate_autoinstall(this.name, '')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((value) => {
          this.autoinstallFormControl.setValue(value);
          this.autosize.resizeToFitContent(true);
        });
    } else if (this.type === 'system') {
      this.cobblerApiService
        .generate_autoinstall('', this.name)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((value) => {
          this.autoinstallFormControl.setValue(value);
          this.autosize.resizeToFitContent(true);
        });
    } else {
      throw new Error('Object type was neither profile nor system!');
    }
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
