import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppManageComponent} from './appManage';
import {LogInFormComponent} from './login/login.component';
import {DistrosComponent} from './items/distros/distros.component';
import {ProfilesComponent} from './items/profiles/profiles.component';
import {SystemsComponent} from './items/systems/systems.component';
import {ReposComponent} from './items/repos/repos.component';
import {ImagesComponent} from './items/images/images.component';
import {TemplatesComponent} from './items/templates/templates.component';
import {SnippetsComponent} from './items/snippets/snippets.component';
import {ManagementClassesComponent} from './items/management-classes/management-classes.component';
import {AppSettingsComponent} from './app-settings/app-settings.component';
import {PackagesComponent} from './items/packages/packages.component';
import {FilesComponent} from './items/files/files.component';
import {ImportDVDComponent} from './actions/import-dvd/import-dvd.component';
import {SyncComponent} from './actions/sync/sync.component';
import {RepoSyncComponent} from './actions/repo-sync/repo-sync.component';
import {BuildISOComponent} from './actions/build-iso/build-iso.component';
import {CheckSysComponent} from './actions/check-sys/check-sys.component';
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
  {path: 'templates', component: TemplatesComponent, canActivate: [AuthGuardService]},
  {path: 'snippets', component: SnippetsComponent, canActivate: [AuthGuardService]},
  {path: 'management-classes', component: ManagementClassesComponent, canActivate: [AuthGuardService]},
  {path: 'settings', component: AppSettingsComponent, canActivate: [AuthGuardService]},
  {path: 'packages', component: PackagesComponent, canActivate: [AuthGuardService]},
  {path: 'app-files', component: FilesComponent, canActivate: [AuthGuardService]},
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
