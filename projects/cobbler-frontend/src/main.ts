import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { COBBLER_URL, cobblerUrlFactory } from 'cobbler-api';
import { routes } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { AppConfigService } from './app/services/app-config.service';
import { AuthGuardService } from './app/services/auth-guard.service';
import { UserService } from './app/services/user.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(
      routes,
      withViewTransitions(),
      // Default 'emptyOnly' only inherits ancestor route params into a path-less child route
      // whose own PARENT also has a component-less/path-less segment. Every level of this app's
      // shell/edit nesting (e.g. system/:name/interface -> '' or system/:name/interface/:interface)
      // has a real component at each level, so 'emptyOnly' never bridges more than one level and
      // route.snapshot.paramMap.get('name') silently returns null two or more levels down —
      // exactly the failure behind "Type of value node could not be detected!" when that null is
      // passed to an XML-RPC call. 'always' merges every ancestor's resolved params down the whole
      // chain (a child's own param always wins on a name collision), which is what every component
      // in this app already assumes when it reads route.snapshot.paramMap.get(...).
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    importProvidersFrom(CommonModule, BrowserModule),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: COBBLER_URL,
      useFactory: cobblerUrlFactory,
    },
    UserService,
    AuthGuardService,
    AppConfigService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill', floatLabel: 'always' },
    },
  ],
}).catch((err) => console.error(err));
