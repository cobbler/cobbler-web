import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DistrosComponent } from './components/configuration/distros/distros.component';
import { ProfilesComponent } from './components/configuration/profiles/profiles.component';
import { SystemsComponent } from './components/configuration/systems/systems.component';
import { ReposComponent } from './components/configuration/repos/repos.component';
import { ImagesComponent } from './components/configuration/images/images.component';
import { TemplatesComponent } from './components/configuration/templates/templates.component';
import { SnippetsComponent } from './components/configuration/snippets/snippets.component';
// Services
import { DistroService } from './services/distro.service';
import { ProfileService } from './services/profile.service';
import { SystemService } from './services/system.service';
import { ImageService } from './services/image.service';
import { SnippetService } from './services/snippet.service';
import { TemplateService } from './services/template.service';
import { RepoService } from './services/repo.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    DistrosComponent,
    ProfilesComponent,
    SystemsComponent,
    ReposComponent,
    ImagesComponent,
    TemplatesComponent,
    SnippetsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    DistroService,
    ProfileService,
    SystemService,
    SnippetService,
    TemplateService,
    RepoService,
    ImageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
