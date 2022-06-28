import {ExtendedModule, FlexModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatRadioModule} from '@angular/material/radio';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {COBBLER_URL, cobblerUrlFactory} from 'cobbler-api';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {AppManageComponent} from './appManage';
import {AppComponent} from './app.component';
import {LogInFormComponent} from './login/login.component';
import {DistrosComponent} from './items/distros/distros.component';
import {ProfilesComponent} from './items/profiles/profiles.component';
import {UserService} from './services/user.service';
import {SystemsComponent} from './items/systems/systems.component';
import {ReposComponent} from './items/repos/repos.component';
import {ImagesComponent} from './items/images/images.component';
import {TemplatesComponent} from './items/templates/templates.component';
import {SnippetsComponent} from './items/snippets/snippets.component';
import {ManagementClassesComponent} from './items/management-classes/management-classes.component';
import {SettingsViewComponent} from './settings/view/settings-view.component';
import {PackagesComponent} from './items/packages/packages.component';
import {FilesComponent} from './items/files/files.component';
import {ImportDVDComponent} from './actions/import-dvd/import-dvd.component';
import {SyncComponent} from './actions/sync/sync.component';
import {RepoSyncComponent} from './actions/repo-sync/repo-sync.component';
import {BuildISOComponent} from './actions/build-iso/build-iso.component';
import {CheckSysComponent} from './actions/check-sys/check-sys.component';
import {AppEventsComponent} from './app-events/app-events.component';
import {AuthGuardService} from './services/auth-guard.service';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {ManageMenuComponent} from './manage-menu/manage-menu.component';
import {NavbarComponent} from './navbar/navbar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {MatListModule} from '@angular/material/list';
import { EditableTreeComponent } from './common/editable-tree/editable-tree.component';
import { ViewableTreeComponent } from './common/viewable-tree/viewable-tree.component';
import { SettingsEditComponent } from './settings/edit/settings-edit.component';

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
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSidenavModule,
    FlexModule,
    ExtendedModule,
    LayoutModule,
    MatListModule,
    MatTableModule,
    MatTabsModule,
    MatSnackBarModule,
    MatRadioModule,
    MatTreeModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatPaginatorModule,
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
