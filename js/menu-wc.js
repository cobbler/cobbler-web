'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Cobbler Frontend Docs</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter additional">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#additional-pages"'
                            : 'data-target="#xs-additional-pages"' }>
                            <span class="icon ion-ios-book"></span>
                            <span>Additional documentation</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="additional-pages"' : 'id="xs-additional-pages"' }>
                                    <li class="link ">
                                        <a href="additional-documentation/development-setup.html" data-type="entity-link" data-context-id="additional">Development Setup</a>
                                    </li>
                        </ul>
                    </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-0c19b912971fa127db83b85a1fb3003ec704528ca0d23e0456a06a65dbdf0870ddf7a0d2d6015475927abc046fa5c6717f7b1a2490145908827f634dd93fbf6c"' : 'data-target="#xs-components-links-module-AppModule-0c19b912971fa127db83b85a1fb3003ec704528ca0d23e0456a06a65dbdf0870ddf7a0d2d6015475927abc046fa5c6717f7b1a2490145908827f634dd93fbf6c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-0c19b912971fa127db83b85a1fb3003ec704528ca0d23e0456a06a65dbdf0870ddf7a0d2d6015475927abc046fa5c6717f7b1a2490145908827f634dd93fbf6c"' :
                                            'id="xs-components-links-module-AppModule-0c19b912971fa127db83b85a1fb3003ec704528ca0d23e0456a06a65dbdf0870ddf7a0d2d6015475927abc046fa5c6717f7b1a2490145908827f634dd93fbf6c"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppEventsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppEventsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppFilesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppFilesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppManageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppManageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppTemplatesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppTemplatesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BuildISOComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BuildISOComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CheckSysComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CheckSysComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DistrosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DistrosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImagesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImagesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImportDVDComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImportDVDComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogInFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogInFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManageMenuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManageMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManagementClassesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManagementClassesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotFoundComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PackagesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PackagesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfilesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfilesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RepoSyncComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoSyncComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReposComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReposComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SnippetsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SnippetsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SyncComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SyncComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SystemsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SystemsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UnauthorizedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UnauthorizedComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppManageComponent.html" data-type="entity-link" >AppManageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthenticationComponent.html" data-type="entity-link" >AuthenticationComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link" >AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/DateFormatter.html" data-type="entity-link" >DateFormatter</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AngularXmlrpcService.html" data-type="entity-link" >AngularXmlrpcService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppSystemsService.html" data-type="entity-link" >AppSystemsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CobblerApiService.html" data-type="entity-link" >CobblerApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataDistroService.html" data-type="entity-link" >DataDistroService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FilesService.html" data-type="entity-link" >FilesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GetObjService.html" data-type="entity-link" >GetObjService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImagesService.html" data-type="entity-link" >ImagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ItemSettingsService.html" data-type="entity-link" >ItemSettingsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MngclassesService.html" data-type="entity-link" >MngclassesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PackagesService.html" data-type="entity-link" >PackagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileService.html" data-type="entity-link" >ProfileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReposService.html" data-type="entity-link" >ReposService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserStatusService.html" data-type="entity-link" >UserStatusService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuardService.html" data-type="entity-link" >AuthGuardService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/BackgroundAclSetupOptions.html" data-type="entity-link" >BackgroundAclSetupOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BackgroundBuildisoOptions.html" data-type="entity-link" >BackgroundBuildisoOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BackgroundImportOptions.html" data-type="entity-link" >BackgroundImportOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BackgroundPowerSystem.html" data-type="entity-link" >BackgroundPowerSystem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BackgroundReplicateOptions.html" data-type="entity-link" >BackgroundReplicateOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BackgroundReposyncOptions.html" data-type="entity-link" >BackgroundReposyncOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Distro.html" data-type="entity-link" >Distro</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExtendedVersion.html" data-type="entity-link" >ExtendedVersion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/File.html" data-type="entity-link" >File</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Image.html" data-type="entity-link" >Image</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Item.html" data-type="entity-link" >Item</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Member.html" data-type="entity-link" >Member</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MethodFault.html" data-type="entity-link" >MethodFault</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Mgmgtclass.html" data-type="entity-link" >Mgmgtclass</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Package.html" data-type="entity-link" >Package</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageInfo.html" data-type="entity-link" >PageInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PagesItemsResult.html" data-type="entity-link" >PagesItemsResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Param.html" data-type="entity-link" >Param</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Profile.html" data-type="entity-link" >Profile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterOptions.html" data-type="entity-link" >RegisterOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Repo.html" data-type="entity-link" >Repo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SyncOptions.html" data-type="entity-link" >SyncOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SyncSystemsOptions.html" data-type="entity-link" >SyncSystemsOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/System.html" data-type="entity-link" >System</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Version.html" data-type="entity-link" >Version</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/XmlRpcArray.html" data-type="entity-link" >XmlRpcArray</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/XmlRpcStruct.html" data-type="entity-link" >XmlRpcStruct</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});