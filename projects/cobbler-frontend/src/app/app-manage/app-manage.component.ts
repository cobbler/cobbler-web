import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CobblerApiService } from 'cobbler-api';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import Utils from '../utils';

interface LandingPageStatsCard {
  cardTitle: string;
  cardData: BehaviorSubject<string>;
}

@Component({
  selector: 'cobbler-app-manage',
  templateUrl: './app-manage.component.html',
  styleUrls: ['./app-manage.component.scss'],
  imports: [MatGridListModule, MatCardModule, AsyncPipe],
})
export class AppManageComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Content
  distroCard: LandingPageStatsCard = {
    cardTitle: 'Distro count',
    cardData: new BehaviorSubject(''),
  };
  profileCard: LandingPageStatsCard = {
    cardTitle: 'Profile count',
    cardData: new BehaviorSubject(''),
  };
  systemCard: LandingPageStatsCard = {
    cardTitle: 'System count',
    cardData: new BehaviorSubject(''),
  };
  repoCard: LandingPageStatsCard = {
    cardTitle: 'Repository count',
    cardData: new BehaviorSubject(''),
  };
  imageCard: LandingPageStatsCard = {
    cardTitle: 'Image count',
    cardData: new BehaviorSubject(''),
  };
  menuCard: LandingPageStatsCard = {
    cardTitle: 'Menu count',
    cardData: new BehaviorSubject(''),
  };
  templateCard: LandingPageStatsCard = {
    cardTitle: 'Template count',
    cardData: new BehaviorSubject(''),
  };
  snippetCard: LandingPageStatsCard = {
    cardTitle: 'Snippet count',
    cardData: new BehaviorSubject(''),
  };
  landingPageCards: LandingPageStatsCard[] = [
    this.distroCard,
    this.profileCard,
    this.systemCard,
    this.repoCard,
    this.imageCard,
    this.menuCard,
    this.templateCard,
    this.snippetCard,
  ];

  ngOnInit() {
    this.cobblerApiService
      .get_item_names('distro')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.distroCard.cardData.next(value.length.toString());
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
    this.cobblerApiService
      .get_item_names('profile')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.profileCard.cardData.next(value.length.toString());
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
    this.cobblerApiService
      .get_item_names('system')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.systemCard.cardData.next(value.length.toString());
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
    this.cobblerApiService
      .get_item_names('repo')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.repoCard.cardData.next(value.length.toString());
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
    this.cobblerApiService
      .get_item_names('image')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.imageCard.cardData.next(value.length.toString());
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
    this.cobblerApiService
      .get_item_names('menu')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.menuCard.cardData.next(value.length.toString());
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
    this.cobblerApiService
      .get_autoinstall_templates(this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.templateCard.cardData.next(value.length.toString());
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
    this.cobblerApiService
      .get_autoinstall_snippets(this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.snippetCard.cardData.next(value.length.toString());
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
}
