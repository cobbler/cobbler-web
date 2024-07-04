import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { COBBLER_URL, cobblerUrlFactory } from 'cobbler-api';
import { BuildISOComponent } from './actions/build-iso/build-iso.component';
import { CheckSysComponent } from './actions/check-sys/check-sys.component';
import { ImportDVDComponent } from './actions/import-dvd/import-dvd.component';
import { RepoSyncComponent } from './actions/repo-sync/repo-sync.component';
import { SyncComponent } from './actions/sync/sync.component';
import { AppEventsComponent } from './app-events/app-events.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppManageComponent } from './appManage';
import { EditableTreeComponent } from './common/editable-tree/editable-tree.component';
import { ViewableTreeComponent } from './common/viewable-tree/viewable-tree.component';
import { DistrosComponent } from './items/distros/distros.component';
import { FilesComponent } from './items/files/files.component';
import { ImagesComponent } from './items/images/images.component';
import { ManagementClassesComponent } from './items/management-classes/management-classes.component';
import { PackagesComponent } from './items/packages/packages.component';
import { ProfilesComponent } from './items/profiles/profiles.component';
import { ReposComponent } from './items/repos/repos.component';
import { SnippetsComponent } from './items/snippets/snippets.component';
import { SystemsComponent } from './items/systems/systems.component';
import { TemplatesComponent } from './items/templates/templates.component';
import { LogInFormComponent } from './login/login.component';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UserService } from './services/user.service';
import { SettingsEditComponent } from './settings/edit/settings-edit.component';
import { SettingsViewComponent } from './settings/view/settings-view.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

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
    TemplatesComponent,
    SnippetsComponent,
    ManagementClassesComponent,
    SettingsViewComponent,
    DistrosComponent,
    ProfilesComponent,
    SystemsComponent,
    ReposComponent,
    ImagesComponent,
    PackagesComponent,
    FilesComponent,
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
    EditableTreeComponent,
    ViewableTreeComponent,
    SettingsEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatTreeModule,
  ],
  providers: [
    {
      provide: COBBLER_URL,
      useFactory: cobblerUrlFactory
    },
    UserService,
    AuthGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
