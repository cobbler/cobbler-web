import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withViewTransitions } from '@angular/router';
import { COBBLER_URL, cobblerUrlFactory } from 'cobbler-api';
import { routes } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { AuthGuardService } from './app/services/auth-guard.service';
import { UserService } from './app/services/user.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withViewTransitions()),
    importProvidersFrom(CommonModule, BrowserModule),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: COBBLER_URL,
      useFactory: cobblerUrlFactory,
    },
    UserService,
    AuthGuardService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill', floatLabel: 'always' },
    },
  ],
}).catch((err) => console.error(err));
