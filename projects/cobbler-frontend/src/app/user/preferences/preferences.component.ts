import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss',
})
export class PreferencesComponent {
  locales: LocaleOption[] = [
    { code: 'en-US', label: 'English' },
    { code: 'de', label: 'Deutsch' },
  ];

  currentLocale: string = this.detectCurrentLocale();

  private detectCurrentLocale(): string {
    const path = window.location.pathname;
    const match = path.match(/^\/(en-US|de)\//);
    return match ? match[1] : 'en-US';
  }

  onLanguageChange(locale: string): void {
    window.location.href = `/${locale}/`;
  }
}
