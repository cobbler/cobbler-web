import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from '../../services/user.service';

export interface LocaleOption {
  code: string;
  label: string;
}

@Component({
  selector: 'cobbler-preferences',
  imports: [
    MatExpansionModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss',
})
export class PreferencesComponent implements OnInit {
  locales: LocaleOption[] = [
    { code: 'en-US', label: 'English' },
    { code: 'de', label: 'Deutsch' },
  ];

  swithTheme = new FormControl(false);
  darkTheme = 'dark-theme';

  currentLocale: string = this.detectCurrentLocale();
  overlay = inject(OverlayContainer);
  userSerivce = inject(UserService);

  private detectCurrentLocale(): string {
    const path = window.location.pathname;
    const match = path.match(/^\/(en-US|de)\//);
    return match ? match[1] : 'en-US';
  }

  ngOnInit(): void {
    // Check if dark mode is on before clicking toggler
    const isDarkMode = this.userSerivce.darkMode;
    if (isDarkMode) {
      if (isDarkMode === 'true') {
        this.swithTheme.setValue(true);
      } else {
        this.swithTheme.setValue(false);
      }
    }

    this.swithTheme.valueChanges.subscribe((currentMode: boolean) => {
      const body = document.body.classList;

      // Set boolean in local storage so that toggler doesn't deactivate automatically when reloading page
      this.userSerivce.darkMode = currentMode;

      if (currentMode) {
        body.add(this.darkTheme);
        this.overlay.getContainerElement().classList.add(this.darkTheme);
      } else {
        body.remove(this.darkTheme);
        this.overlay.getContainerElement().classList.remove(this.darkTheme);
      }
    });
  }

  onLanguageChange(locale: string): void {
    window.location.href = `/${locale}/`;
  }
}
