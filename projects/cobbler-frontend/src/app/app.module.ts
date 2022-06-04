import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
// Components and services
import { AppManageComponent } from './appManage';
import { AppComponent } from './app.component';
import { LogInFormComponent } from './login/login.component';
import { DistrosComponent } from './distros/distros.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { UserService } from './services/user.service';
import { SystemsComponent } from './systems/systems.component';
import { ReposComponent } from './repos/repos.component';
import { ImagesComponent } from './images/images.component';
import { AppTemplatesComponent } from './app-templates/app-templates.component';
import { SnippetsComponent } from './snippets/snippets.component';
import { ManagementClassesComponent } from './management-classes/management-classes.component';
import { AppSettingsComponent } from './app-settings/app-settings.component';
import { PackagesComponent } from './packages/packages.component';
import { AppFilesComponent } from './app-files/app-files.component';
import { ImportDVDComponent } from './import-dvd/import-dvd.component';
import { SyncComponent } from './sync/sync.component';
import { RepoSyncComponent } from './repo-sync/repo-sync.component';
import { BuildISOComponent } from './build-iso/build-iso.component';
import { CheckSysComponent } from './check-sys/check-sys.component';
import { AppEventsComponent } from './app-events/app-events.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LogInFormComponent,
    AppManageComponent,
    DistrosComponent,
    ProfilesComponent,
    SystemsComponent,
    ReposComponent,
    ImagesComponent,
    AppTemplatesComponent,
    SnippetsComponent,
    ManagementClassesComponent,
    AppSettingsComponent,
    DistrosComponent,
    ProfilesComponent,
    SystemsComponent,
    ReposComponent,
    ImagesComponent,
    PackagesComponent,
    AppFilesComponent,
    ImportDVDComponent,
    SyncComponent,
    RepoSyncComponent,
    BuildISOComponent,
    CheckSysComponent,
    AppEventsComponent,
    UnauthorizedComponent,
    NotFoundComponent,
    ManageMenuComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // MatTableModule,
  ],
  providers: [
    UserService,
    AuthGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
