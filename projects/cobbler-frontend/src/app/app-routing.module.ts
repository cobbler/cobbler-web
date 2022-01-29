import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppManageComponent} from './appManage';
import {LogInFormComponent} from './login/login.component';
import {DistrosComponent} from './distros/distros.component';
import {ProfilesComponent} from './profiles/profiles.component';
import {SystemsComponent} from './systems/systems.component';
import {ReposComponent} from './repos/repos.component';
import {ImagesComponent} from './images/images.component';
import {AppTemplatesComponent} from './app-templates/app-templates.component';
import {SnippetsComponent} from './snippets/snippets.component';
import {ManagementClassesComponent} from './management-classes/management-classes.component';
import {AppSettingsComponent} from './app-settings/app-settings.component';
import {PackagesComponent} from './packages/packages.component';
import {AppFilesComponent} from './app-files/app-files.component';
import {ImportDVDComponent} from './import-dvd/import-dvd.component';
import {SyncComponent} from './sync/sync.component';
import {RepoSyncComponent} from './repo-sync/repo-sync.component';
import {BuildISOComponent} from './build-iso/build-iso.component';
import {CheckSysComponent} from './check-sys/check-sys.component';
import {AppEventsComponent} from './app-events/app-events.component';
import {AuthGuardService} from './services/auth-guard.service';
import {NotFoundComponent} from './not-found/not-found.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';


const routes: Routes = [

  {path: 'login', component: LogInFormComponent},
  {path: '', pathMatch: 'full', redirectTo: '/login' },
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: 'manage', component: AppManageComponent, canActivate: [AuthGuardService]},
  {path: 'Distros', component: DistrosComponent, canActivate: [AuthGuardService]},
  {path: 'Profiles', component: ProfilesComponent, canActivate: [AuthGuardService]},
  {path: 'Systems', component: SystemsComponent, canActivate: [AuthGuardService]},
  {path: 'Repos', component: ReposComponent, canActivate: [AuthGuardService]},
  {path: 'Images', component: ImagesComponent, canActivate: [AuthGuardService]},
  {path: 'Templates', component: AppTemplatesComponent, canActivate: [AuthGuardService]},
  {path: 'Snippets', component: SnippetsComponent, canActivate: [AuthGuardService]},
  {path: 'ManageClasses', component: ManagementClassesComponent, canActivate: [AuthGuardService]},
  {path: 'AppSettings', component: AppSettingsComponent, canActivate: [AuthGuardService]},
  {path: 'Packages', component: PackagesComponent, canActivate: [AuthGuardService]},
  {path: 'AppFiles', component: AppFilesComponent, canActivate: [AuthGuardService]},
  {path: 'ImportDVD', component: ImportDVDComponent, canActivate: [AuthGuardService]},
  {path: 'Sync', component: SyncComponent, canActivate: [AuthGuardService]},
  {path: 'RepoSync', component: RepoSyncComponent, canActivate: [AuthGuardService]},
  {path: 'BuildISO', component: BuildISOComponent, canActivate: [AuthGuardService]},
  {path: 'CheckSys', component: CheckSysComponent, canActivate: [AuthGuardService]},
  {path: 'AppEvents', component: AppEventsComponent, canActivate: [AuthGuardService]},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {onSameUrlNavigation: 'reload'}
    /*, { enableTracing: true })*/
  )],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
