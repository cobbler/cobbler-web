var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"projects/cobbler-frontend/src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"login","component":"LogInFormComponent"},{"path":"","pathMatch":"full","redirectTo":"/login"},{"path":"unauthorized","component":"UnauthorizedComponent"},{"path":"manage","component":"AppManageComponent","canActivate":["AuthGuardService"]},{"path":"test","component":"TestServicesComponent","canActivate":["AuthGuardService"]},{"path":"Distros","component":"DistrosComponent","canActivate":["AuthGuardService"]},{"path":"Profiles","component":"ProfilesComponent","canActivate":["AuthGuardService"]},{"path":"Systems","component":"SystemsComponent","canActivate":["AuthGuardService"]},{"path":"Repos","component":"ReposComponent","canActivate":["AuthGuardService"]},{"path":"Images","component":"ImagesComponent","canActivate":["AuthGuardService"]},{"path":"Templates","component":"AppTemplatesComponent","canActivate":["AuthGuardService"]},{"path":"Snippets","component":"SnippetsComponent","canActivate":["AuthGuardService"]},{"path":"ManageClasses","component":"ManagementClassesComponent","canActivate":["AuthGuardService"]},{"path":"AppSettings","component":"AppSettingsComponent","canActivate":["AuthGuardService"]},{"path":"Packages","component":"PackagesComponent","canActivate":["AuthGuardService"]},{"path":"AppFiles","component":"AppFilesComponent","canActivate":["AuthGuardService"]},{"path":"ImportDVD","component":"ImportDVDComponent","canActivate":["AuthGuardService"]},{"path":"Sync","component":"SyncComponent","canActivate":["AuthGuardService"]},{"path":"RepoSync","component":"RepoSyncComponent","canActivate":["AuthGuardService"]},{"path":"BuildISO","component":"BuildISOComponent","canActivate":["AuthGuardService"]},{"path":"CheckSys","component":"CheckSysComponent","canActivate":["AuthGuardService"]},{"path":"AppEvents","component":"AppEventsComponent","canActivate":["AuthGuardService"]},{"path":"404","component":"NotFoundComponent"},{"path":"**","redirectTo":"/404"}],"kind":"module"}]}
