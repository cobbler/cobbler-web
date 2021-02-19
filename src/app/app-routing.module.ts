import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistrosComponent } from './components/configuration/distros/distros.component';
import { ImagesComponent } from './components/configuration/images/images.component';
import { ProfilesComponent } from './components/configuration/profiles/profiles.component';
import { ReposComponent } from './components/configuration/repos/repos.component';
import { SnippetsComponent } from './components/configuration/snippets/snippets.component';
import { SystemsComponent } from './components/configuration/systems/systems.component';
import { TemplatesComponent } from './components/configuration/templates/templates.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  // ** Configurations
  { path: 'distros', component: DistrosComponent },
  // { path: 'distros/:id', component: DistrosDetailComponent },
  { path: 'profiles', component: ProfilesComponent },
  // { path: 'profiles/:id', component: ProfilesDetailComponent },
  { path: 'systems', component: SystemsComponent },
  // { path: 'systems/:id', component: SystemsDetailComponent },
  { path: 'images', component: ImagesComponent },
  // { path: 'images/:id', component: ImagesDetailComponent },
  { path: 'repos', component: ReposComponent },
  // { path: 'repos/:id', component: ReposDetailComponent },
  // templates and snippets could have same detail component as they both have only a single editable textarea
  { path: 'templates', component: TemplatesComponent },
  // { path: 'templates/:id', component: TemplatesDetailComponent },
  { path: 'snippets', component: SnippetsComponent }
  // { path: 'snippets/:id', component: SnippetsDetailComponent }
  // ** Resources

  // ** Actions

  // ** Other
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
