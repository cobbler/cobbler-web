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
import { AppManageComponent } from './app-manage';
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
import { ProfileOverviewComponent } from './items/profile/overview/profile-overview.component';
import { RepositoryEditComponent } from './items/repository/edit/repository-edit.component';
import { RepositoryOverviewComponent } from './items/repository/overview/repository-overview.component';
import { SnippetEditComponent } from './items/snippet/edit/snippet-edit.component';
import { SnippetOverviewComponent } from './items/snippet/overview/snippet-overview.component';
import { SystemEditComponent } from './items/system/edit/system-edit/system-edit.component';
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
import { DistroShellComponent } from './items/distro/distro-shell.component';
import { ProfileShellComponent } from './items/profile/profile-shell.component';
import { ProfileShellEditComponent } from './items/profile/edit/profile-edit-shell.component';
import { ProfileEditComponent } from './items/profile/edit/edit-profile/profile-edit.component';
import { SystemShellComponent } from './items/system/system-shell.component';
import { SystemShellEditComponent } from './items/system/edit/system-edit-shell.component';
import { NetworkInterfaceShellComponent } from './items/network-interface/network-interface-shell.component';
import { RepositoryShellComponent } from './items/repository/repository-shell.component';
import { ImageShellComponent } from './items/image/image-shell.component';
import { TemplateShellComponent } from './items/template/template-shell.component';
import { SnippetShellComponent } from './items/snippet/snippet-shell.component';
import { ManagementClassShellComponent } from './items/management-class/managemenet-class-shell';
import { PackageShellComponent } from './items/package/package-shell.component';
import { FileShellComponent } from './items/file/file-shell.component';
import { MenuShellComponent } from './items/menu/menu-shell.component';
/* eslint-enable max-len */

export const routes: Routes = [
  { path: 'login', component: LogInFormComponent },
  {
    path: 'user/:name/preferences',
    component: PreferencesComponent,
    canActivate: [AuthGuardService],
    data: { breadcrumb: { skip: true } },
  },
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    data: { breadcrumb: { skip: true } },
  },
  {
    path: 'manage',
    component: AppManageComponent,
    canActivate: [AuthGuardService],
    pathMatch: 'full',
    data: { breadcrumb: { skip: true } },
  },
  {
    path: 'actions',
    children: [
      {
        path: 'import',
        component: ImportDVDComponent,
        canActivate: [AuthGuardService],
        data: { breadcrumb: 'Import DVD' },
      },
      {
        path: 'sync',
        component: SyncComponent,
        canActivate: [AuthGuardService],
        data: { breadcrumb: 'Sync' },
      },
      {
        path: 'reposync',
        component: RepoSyncComponent,
        canActivate: [AuthGuardService],
        data: { breadcrumb: 'Sync Repository' },
      },
      {
        path: 'buildiso',
        component: BuildISOComponent,
        canActivate: [AuthGuardService],
        data: { breadcrumb: 'Build ISO' },
      },
      {
        path: 'check',
        component: CheckSysComponent,
        canActivate: [AuthGuardService],
        data: { breadcrumb: 'Check' },
      },
      {
        path: 'status',
        component: StatusComponent,
        canActivate: [AuthGuardService],
        data: { breadcrumb: 'Status' },
      },
      {
        path: 'hardlink',
        component: HardlinkComponent,
        canActivate: [AuthGuardService],
        data: { breadcrumb: 'Headlink' },
      },
      {
        path: 'mkloaders',
        component: MkloadersComponent,
        canActivate: [AuthGuardService],
        data: { breadcrumb: 'Mkloaders' },
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
        data: { breadcrumb: 'Replicate' },
      },
    ],
    data: { breadcrumb: { label: 'Actions', skip: false, disable: true } },
  },
  {
    path: 'items',
    children: [
      {
        path: 'distro',
        component: DistroShellComponent, // Shell
        children: [
          {
            path: '',
            component: DistrosOverviewComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: 'Distros' },
          },
          {
            path: ':name',
            component: DistroEditComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: { alias: 'itemName' } },
          },
        ],
      },
      {
        path: 'profile',
        component: ProfileShellComponent, // Shell
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            component: ProfileOverviewComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: 'Profiles' },
          },
          {
            path: ':name',
            component: ProfileShellEditComponent, // Shell
            canActivate: [AuthGuardService],
            children: [
              {
                path: '',
                component: ProfileEditComponent,
                canActivate: [AuthGuardService],
                data: { breadcrumb: { alias: 'itemName' } },
              },
              {
                path: 'autoinstall',
                component: ViewAutoinstallComponent,
                canActivate: [AuthGuardService],
                data: { breadcrumb: 'Autoinstall' },
              },
            ],
          },
        ],
      },
      {
        path: 'system',
        component: SystemShellComponent, // Shell
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            component: SystemOverviewComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: 'Systems' },
          },
          {
            path: ':name',
            component: SystemShellEditComponent, // Shell
            canActivate: [AuthGuardService],
            children: [
              {
                path: '',
                component: SystemEditComponent,
                canActivate: [AuthGuardService],
                data: { breadcrumb: { alias: 'itemName' } },
              },
              {
                path: 'interface',
                component: NetworkInterfaceShellComponent, // Shell
                canActivate: [AuthGuardService],
                children: [
                  {
                    path: '',
                    component: NetworkInterfaceOverviewComponent,
                    canActivate: [AuthGuardService],
                    data: { breadcrumb: 'Interfaces' },
                  },
                  {
                    path: ':interface',
                    component: NetworkInterfaceEditComponent,
                    canActivate: [AuthGuardService],
                    data: { breadcrumb: { alias: 'itemName' } },
                  },
                ],
              },
              {
                path: 'autoinstall',
                component: ViewAutoinstallComponent,
                canActivate: [AuthGuardService],
                data: { breadcrumb: 'Autoinstall' },
              },
            ],
          },
        ],
      },
      {
        path: 'repository',
        component: RepositoryShellComponent, // Shell
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            component: RepositoryOverviewComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: 'Repositories' },
          },
          {
            path: ':name',
            component: RepositoryEditComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: { alias: 'itemName' } },
          },
        ],
      },
      {
        path: 'image',
        component: ImageShellComponent, // Shell
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            component: ImageOverviewComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: 'Images' },
          },
          {
            path: ':name',
            component: ImageEditComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: { alias: 'itemName' } },
          },
        ],
      },
      {
        path: 'template',
        component: TemplateShellComponent, // Shell
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            component: TemplateOverviewComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: 'Templates' },
          },
          {
            path: ':name',
            component: TemplateEditComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: { alias: 'itemName' } },
          },
        ],
      },
      {
        path: 'snippet',
        component: SnippetShellComponent, // Shell
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            component: SnippetOverviewComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: 'Snippets' },
          },
          {
            path: ':name',
            component: SnippetEditComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: { alias: 'itemName' } },
          },
        ],
      },
      {
        path: 'management-class',
        component: ManagementClassShellComponent, // Shell
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            component: ManagementClassOverviewComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: 'Management Classes' },
          },
          {
            path: ':name',
            component: ManagementClassEditComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: { alias: 'itemName' } },
          },
        ],
      },
      {
        path: 'package',
        component: PackageShellComponent, // Shell
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            component: PackageOverviewComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: 'Packages' },
          },
          {
            path: ':name',
            component: PackageEditComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: { alias: 'itemname' } },
          },
        ],
      },
      {
        path: 'file',
        component: FileShellComponent, // Shell
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            component: FileOverviewComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: 'Files' },
          },
          {
            path: ':name',
            component: FileEditComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: { alias: 'itemName' } },
          },
        ],
      },
      {
        path: 'menu',
        component: MenuShellComponent, // Shell
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            component: MenuOverviewComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: 'Menus' },
          },
          {
            path: ':name',
            component: MenuEditComponent,
            canActivate: [AuthGuardService],
            data: { breadcrumb: { alias: 'itemName' } },
          },
        ],
      },
    ],
    data: { breadcrumb: { label: 'Items', skip: false, disable: true } },
  },
  {
    path: 'settings',
    component: SettingsViewComponent,
    canActivate: [AuthGuardService],
    data: { breadcrumb: { skip: true } },
  },
  {
    path: 'events',
    component: AppEventsComponent,
    canActivate: [AuthGuardService],
    data: { breadcrumb: { skip: true } },
  },
  {
    path: 'signatures',
    component: SignaturesComponent,
    canActivate: [AuthGuardService],
    data: { breadcrumb: { skip: true } },
  },
  {
    path: '404',
    component: NotFoundComponent,
    data: { breadcrumb: { skip: true } },
  },
  { path: '**', redirectTo: '/404' },
];
