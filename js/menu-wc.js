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
                            <a href="contributing.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CONTRIBUTING
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter additional">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#additional-pages"'
                            : 'data-bs-target="#xs-additional-pages"' }>
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
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppEventsComponent.html" data-type="entity-link" >AppEventsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppManageComponent.html" data-type="entity-link" >AppManageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BuildISOComponent.html" data-type="entity-link" >BuildISOComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CheckSysComponent.html" data-type="entity-link" >CheckSysComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogBoxConfirmCancelEditComponent.html" data-type="entity-link" >DialogBoxConfirmCancelEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogBoxTextConfirmComponent.html" data-type="entity-link" >DialogBoxTextConfirmComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogItemCopyComponent.html" data-type="entity-link" >DialogItemCopyComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogItemRenameComponent.html" data-type="entity-link" >DialogItemRenameComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogKeyValueInputComponent.html" data-type="entity-link" >DialogKeyValueInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogTextInputComponent.html" data-type="entity-link" >DialogTextInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DistroEditComponent.html" data-type="entity-link" >DistroEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DistrosOverviewComponent.html" data-type="entity-link" >DistrosOverviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FileEditComponent.html" data-type="entity-link" >FileEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FileOverviewComponent.html" data-type="entity-link" >FileOverviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HardlinkComponent.html" data-type="entity-link" >HardlinkComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ImageEditComponent.html" data-type="entity-link" >ImageEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ImageOverviewComponent.html" data-type="entity-link" >ImageOverviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ImportDVDComponent.html" data-type="entity-link" >ImportDVDComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/KeyValueEditorComponent.html" data-type="entity-link" >KeyValueEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LogInFormComponent.html" data-type="entity-link" >LogInFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ManagementClassEditComponent.html" data-type="entity-link" >ManagementClassEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ManagementClassOverviewComponent.html" data-type="entity-link" >ManagementClassOverviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ManageMenuComponent.html" data-type="entity-link" >ManageMenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MkloadersComponent.html" data-type="entity-link" >MkloadersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MultiSelectComponent.html" data-type="entity-link" >MultiSelectComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavbarComponent.html" data-type="entity-link" >NavbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotFoundComponent.html" data-type="entity-link" >NotFoundComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PackageEditComponent.html" data-type="entity-link" >PackageEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PackageOverviewComponent.html" data-type="entity-link" >PackageOverviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileEditComponent.html" data-type="entity-link" >ProfileEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileOverviewComponent.html" data-type="entity-link" >ProfileOverviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ReplicateComponent.html" data-type="entity-link" >ReplicateComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RepositoryEditComponent.html" data-type="entity-link" >RepositoryEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RepositoryOverviewComponent.html" data-type="entity-link" >RepositoryOverviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RepoSyncComponent.html" data-type="entity-link" >RepoSyncComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SettingsViewComponent.html" data-type="entity-link" >SettingsViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SignaturesComponent.html" data-type="entity-link" >SignaturesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SnippetEditComponent.html" data-type="entity-link" >SnippetEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SnippetOverviewComponent.html" data-type="entity-link" >SnippetOverviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StatusComponent.html" data-type="entity-link" >StatusComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SyncComponent.html" data-type="entity-link" >SyncComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SystemEditComponent.html" data-type="entity-link" >SystemEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SystemOverviewComponent.html" data-type="entity-link" >SystemOverviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TemplateEditComponent.html" data-type="entity-link" >TemplateEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TemplateOverviewComponent.html" data-type="entity-link" >TemplateOverviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UnauthorizedComponent.html" data-type="entity-link" >UnauthorizedComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ValidateAutoinstallsComponent.html" data-type="entity-link" >ValidateAutoinstallsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewableTreeComponent.html" data-type="entity-link" >ViewableTreeComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
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
                            <li class="link">
                                <a href="classes/Utils.html" data-type="entity-link" >Utils</a>
                            </li>
                            <li class="link">
                                <a href="classes/Utils-1.html" data-type="entity-link" >Utils</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AngularXmlrpcService.html" data-type="entity-link" >AngularXmlrpcService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppConfigService.html" data-type="entity-link" >AppConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthGuardService.html" data-type="entity-link" >AuthGuardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CobblerApiService.html" data-type="entity-link" >CobblerApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GetObjService.html" data-type="entity-link" >GetObjService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ItemSettingsService.html" data-type="entity-link" >ItemSettingsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AppConfig.html" data-type="entity-link" >AppConfig</a>
                            </li>
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
                                <a href="interfaces/DialogConfirmCancelData.html" data-type="entity-link" >DialogConfirmCancelData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogItemCopyData.html" data-type="entity-link" >DialogItemCopyData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogItemRenameData.html" data-type="entity-link" >DialogItemRenameData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogKeyValueInputReturnData.html" data-type="entity-link" >DialogKeyValueInputReturnData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogTextInputData.html" data-type="entity-link" >DialogTextInputData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Distro.html" data-type="entity-link" >Distro</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DistroSignatureOsVersion.html" data-type="entity-link" >DistroSignatureOsVersion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DistroSignatures.html" data-type="entity-link" >DistroSignatures</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Event.html" data-type="entity-link" >Event</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExampleFlatNode.html" data-type="entity-link" >ExampleFlatNode</a>
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
                                <a href="interfaces/InstallationStatus.html" data-type="entity-link" >InstallationStatus</a>
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
                                <a href="interfaces/MethodResponse.html" data-type="entity-link" >MethodResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Mgmgtclass.html" data-type="entity-link" >Mgmgtclass</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NetworkInterface.html" data-type="entity-link" >NetworkInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ObjectNode.html" data-type="entity-link" >ObjectNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OsBreedFlatNode.html" data-type="entity-link" >OsBreedFlatNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OsNode.html" data-type="entity-link" >OsNode</a>
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
                                <a href="interfaces/SettingsTableRowData.html" data-type="entity-link" >SettingsTableRowData</a>
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
                                <a href="interfaces/TableRow.html" data-type="entity-link" >TableRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/V3_3_1.html" data-type="entity-link" >V3_3_1</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/V3_3_2.html" data-type="entity-link" >V3_3_2</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/V3_3_3.html" data-type="entity-link" >V3_3_3</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/V3_4_0.html" data-type="entity-link" >V3_4_0</a>
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
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
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
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});