/* eslint-disable max-len */
import { Routes } from '@angular/router';
import { BuildISOComponent } from './actions/build-iso/build-iso.component';
import { CheckSysComponent } from './actions/check-sys/check-sys.component';
import { HardlinkComponent } from './actions/hardlink/hardlink.component';
import { ImportDVDComponent } from './actions/import-dvd/import-dvd.component';
import { ReplicateComponent } from './actions/replicate/replicate.component';
import { RepoSyncComponent } from './actions/repo-sync/repo-sync.component';
import { StatusComponent } from './actions/status/status.component';
import { SyncComponent } from './actions/sync/sync.component';
import { ValidateAutoinstallsComponent } from './actions/validate-autoinstalls/validate-autoinstalls.component';
import { AppEventsComponent } from './app-events/app-events.component';
import { AppManageComponent } from './appManage';
import { ViewAutoinstallComponent } from './common/view-autoinstall/view-autoinstall.component';
import { DistroEditComponent } from './items/distro/edit/distro-edit.component';
import { DistrosOverviewComponent } from './items/distro/overview/distros-overview.component';
import { FileEditComponent } from './items/file/edit/file-edit.component';
import { FileOverviewComponent } from './items/file/overview/file-overview.component';
import { MenuEditComponent } from './items/menu/edit/menu-edit.component';
import { MenuOverviewComponent } from './items/menu/overview/menu-overview.component';
import { ImageEditComponent } from './items/image/edit/image-edit.component';
import { ImageOverviewComponent } from './items/image/overview/image-overview.component';
import { ManagementClassEditComponent } from './items/management-class/edit/management-class-edit.component';
import { ManagementClassOverviewComponent } from './items/management-class/overview/management-class-overview.component';
import { NetworkInterfaceEditComponent } from './items/network-interface/edit/network-interface-edit.component';
import { NetworkInterfaceOverviewComponent } from './items/network-interface/overview/network-interface-overview.component';
import { PackageEditComponent } from './items/package/edit/package-edit.component';
import { PackageOverviewComponent } from './items/package/overview/package-overview.component';
import { ProfileEditComponent } from './items/profile/edit/profile-edit.component';
import { ProfileOverviewComponent } from './items/profile/overview/profile-overview.component';
import { RepositoryEditComponent } from './items/repository/edit/repository-edit.component';
import { RepositoryOverviewComponent } from './items/repository/overview/repository-overview.component';
import { SnippetEditComponent } from './items/snippet/edit/snippet-edit.component';
import { SnippetOverviewComponent } from './items/snippet/overview/snippet-overview.component';
import { SystemEditComponent } from './items/system/edit/system-edit.component';
import { SystemOverviewComponent } from './items/system/overview/system-overview.component';
import { TemplateEditComponent } from './items/template/edit/template-edit.component';
import { TemplateOverviewComponent } from './items/template/overview/template-overview.component';
import { LogInFormComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuardService } from './services/auth-guard.service';
import { SettingsViewComponent } from './settings/view/settings-view.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { SignaturesComponent } from './signatures/signatures.component';
import { MkloadersComponent } from './actions/mkloaders/mkloaders.component';
import { PreferencesComponent } from './user/preferences/preferences.component';
/* eslint-enable max-len */

export const routes: Routes = [
  { path: 'login', component: LogInFormComponent },
  {
    path: 'user/:name/preferences',
    component: PreferencesComponent,
    canActivate: [AuthGuardService],
  },
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: 'manage',
    component: AppManageComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'actions',
    children: [
      {
        path: 'import',
        component: ImportDVDComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'sync',
        component: SyncComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'reposync',
        component: RepoSyncComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'buildiso',
        component: BuildISOComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'check',
        component: CheckSysComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'status',
        component: StatusComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'hardlink',
        component: HardlinkComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'mkloaders',
        component: MkloadersComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'validate-autoinstalls',
        component: ValidateAutoinstallsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'replicate',
        component: ReplicateComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },
  {
    path: 'items',
    children: [
      {
        path: 'distro',
        component: DistrosOverviewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'distro/:name',
        component: DistroEditComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'profile',
        component: ProfileOverviewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'profile/:name',
        component: ProfileEditComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'profile/:name/autoinstall',
        component: ViewAutoinstallComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'system',
        component: SystemOverviewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'system/:name',
        component: SystemEditComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'system/:name/interface',
        component: NetworkInterfaceOverviewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'system/:name/interface/:interface',
        component: NetworkInterfaceEditComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'system/:name/autoinstall',
        component: ViewAutoinstallComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'repository',
        component: RepositoryOverviewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'repository/:name',
        component: RepositoryEditComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'image',
        component: ImageOverviewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'image/:name',
        component: ImageEditComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'template',
        component: TemplateOverviewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'template/:name',
        component: TemplateEditComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'snippet',
        component: SnippetOverviewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'snippet/:name',
        component: SnippetEditComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'management-class',
        component: ManagementClassOverviewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'management-class/:name',
        component: ManagementClassEditComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'package',
        component: PackageOverviewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'package/:name',
        component: PackageEditComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'file',
        component: FileOverviewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'file/:name',
        component: FileEditComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'menu',
        component: MenuOverviewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'menu/:name',
        component: MenuEditComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },
  {
    path: 'settings',
    component: SettingsViewComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'events',
    component: AppEventsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'signatures',
    component: SignaturesComponent,
    canActivate: [AuthGuardService],
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];
