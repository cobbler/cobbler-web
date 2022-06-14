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
  {path: 'distros', component: DistrosComponent, canActivate: [AuthGuardService]},
  {path: 'profiles', component: ProfilesComponent, canActivate: [AuthGuardService]},
  {path: 'systems', component: SystemsComponent, canActivate: [AuthGuardService]},
  {path: 'repos', component: ReposComponent, canActivate: [AuthGuardService]},
  {path: 'images', component: ImagesComponent, canActivate: [AuthGuardService]},
  {path: 'templates', component: AppTemplatesComponent, canActivate: [AuthGuardService]},
  {path: 'snippets', component: SnippetsComponent, canActivate: [AuthGuardService]},
  {path: 'management-classes', component: ManagementClassesComponent, canActivate: [AuthGuardService]},
  {path: 'settings', component: AppSettingsComponent, canActivate: [AuthGuardService]},
  {path: 'packages', component: PackagesComponent, canActivate: [AuthGuardService]},
  {path: 'app-files', component: AppFilesComponent, canActivate: [AuthGuardService]},
  {path: 'import', component: ImportDVDComponent, canActivate: [AuthGuardService]},
  {path: 'sync', component: SyncComponent, canActivate: [AuthGuardService]},
  {path: 'reposync', component: RepoSyncComponent, canActivate: [AuthGuardService]},
  {path: 'buildiso', component: BuildISOComponent, canActivate: [AuthGuardService]},
  {path: 'check', component: CheckSysComponent, canActivate: [AuthGuardService]},
  {path: 'events', component: AppEventsComponent, canActivate: [AuthGuardService]},
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
