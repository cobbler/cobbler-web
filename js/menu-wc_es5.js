'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

customElements.define('compodoc-menu', /*#__PURE__*/function (_HTMLElement) {
  _inherits(_class, _HTMLElement);

  var _super = _createSuper(_class);

  function _class() {
    var _this;

    _classCallCheck(this, _class);

    _this = _super.call(this);
    _this.isNormalMode = _this.getAttribute('mode') === 'normal';
    return _this;
  }

  _createClass(_class, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.render(this.isNormalMode);
    }
  }, {
    key: "render",
    value: function render(isNormalMode) {
      var tp = lithtml.html("\n        <nav>\n            <ul class=\"list\">\n                <li class=\"title\">\n                    <a href=\"index.html\" data-type=\"index-link\">Cobbler Frontend Docs</a>\n                </li>\n\n                <li class=\"divider\"></li>\n                ".concat(isNormalMode ? "<div id=\"book-search-input\" role=\"search\"><input type=\"text\" placeholder=\"Type to search\"></div>" : '', "\n                <li class=\"chapter\">\n                    <a data-type=\"chapter-link\" href=\"index.html\"><span class=\"icon ion-ios-home\"></span>Getting started</a>\n                    <ul class=\"links\">\n                        <li class=\"link\">\n                            <a href=\"overview.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-keypad\"></span>Overview\n                            </a>\n                        </li>\n                        <li class=\"link\">\n                            <a href=\"index.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-paper\"></span>README\n                            </a>\n                        </li>\n                                <li class=\"link\">\n                                    <a href=\"dependencies.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-list\"></span>Dependencies\n                                    </a>\n                                </li>\n                    </ul>\n                </li>\n                    <li class=\"chapter additional\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#additional-pages"' : 'data-target="#xs-additional-pages"', ">\n                            <span class=\"icon ion-ios-book\"></span>\n                            <span>Additional documentation</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="additional-pages"' : 'id="xs-additional-pages"', ">\n                                    <li class=\"link \">\n                                        <a href=\"additional-documentation/development-setup.html\" data-type=\"entity-link\" data-context-id=\"additional\">Development Setup</a>\n                                    </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter modules\">\n                        <a data-type=\"chapter-link\" href=\"modules.html\">\n                            <div class=\"menu-toggler linked\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"', ">\n                                <span class=\"icon ion-ios-archive\"></span>\n                                <span class=\"link-name\">Modules</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                        </a>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"', ">\n                            <li class=\"link\">\n                                <a href=\"modules/AppModule.html\" data-type=\"entity-link\" >AppModule</a>\n                                    <li class=\"chapter inner\">\n                                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#components-links-module-AppModule-7a3e49fa35c6f4361afae85af57bd55352d2834608364991859ed8a66aded0e73508c88e83a7e52592d7395fa17b6d19613997fcac229bdc15c1b0ac156c4797"' : 'data-target="#xs-components-links-module-AppModule-7a3e49fa35c6f4361afae85af57bd55352d2834608364991859ed8a66aded0e73508c88e83a7e52592d7395fa17b6d19613997fcac229bdc15c1b0ac156c4797"', ">\n                                            <span class=\"icon ion-md-cog\"></span>\n                                            <span>Components</span>\n                                            <span class=\"icon ion-ios-arrow-down\"></span>\n                                        </div>\n                                        <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="components-links-module-AppModule-7a3e49fa35c6f4361afae85af57bd55352d2834608364991859ed8a66aded0e73508c88e83a7e52592d7395fa17b6d19613997fcac229bdc15c1b0ac156c4797"' : 'id="xs-components-links-module-AppModule-7a3e49fa35c6f4361afae85af57bd55352d2834608364991859ed8a66aded0e73508c88e83a7e52592d7395fa17b6d19613997fcac229bdc15c1b0ac156c4797"', ">\n                                            <li class=\"link\">\n                                                <a href=\"components/AppComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/AppEventsComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppEventsComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/AppFilesComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppFilesComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/AppManageComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppManageComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/AppSettingsComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppSettingsComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/AppTemplatesComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppTemplatesComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/BuildISOComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >BuildISOComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/CheckSysComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >CheckSysComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/CurrentOBJComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >CurrentOBJComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/DistrosComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >DistrosComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/ImagesComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >ImagesComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/ImportDVDComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >ImportDVDComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/LogInFormComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >LogInFormComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/ManageMenuComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >ManageMenuComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/ManagementClassesComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >ManagementClassesComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/NavbarComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >NavbarComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/NotFoundComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >NotFoundComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/PackagesComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >PackagesComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/ProfilesComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >ProfilesComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/RepoSyncComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >RepoSyncComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/ReposComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >ReposComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/SnippetsComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >SnippetsComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/SyncComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >SyncComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/SystemsComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >SystemsComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/TestServicesComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >TestServicesComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/UnauthorizedComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >UnauthorizedComponent</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/AppRoutingModule.html\" data-type=\"entity-link\" >AppRoutingModule</a>\n                            </li>\n                </ul>\n                </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#components-links"' : 'data-target="#xs-components-links"', ">\n                            <span class=\"icon ion-md-cog\"></span>\n                            <span>Components</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="components-links"' : 'id="xs-components-links"', ">\n                            <li class=\"link\">\n                                <a href=\"components/AppManageComponent.html\" data-type=\"entity-link\" >AppManageComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/AuthenticationComponent.html\" data-type=\"entity-link\" >AuthenticationComponent</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"', ">\n                            <span class=\"icon ion-ios-paper\"></span>\n                            <span>Classes</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"', ">\n                            <li class=\"link\">\n                                <a href=\"classes/AppPage.html\" data-type=\"entity-link\" >AppPage</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/DateFormatter.html\" data-type=\"entity-link\" >DateFormatter</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class=\"chapter\">\n                            <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#injectables-links"' : 'data-target="#xs-injectables-links"', ">\n                                <span class=\"icon ion-md-arrow-round-down\"></span>\n                                <span>Injectables</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                            <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"', ">\n                                <li class=\"link\">\n                                    <a href=\"injectables/AngularXmlrpcService.html\" data-type=\"entity-link\" >AngularXmlrpcService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/AppSystemsService.html\" data-type=\"entity-link\" >AppSystemsService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/CobblerApiService.html\" data-type=\"entity-link\" >CobblerApiService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/DataDistroService.html\" data-type=\"entity-link\" >DataDistroService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/FilesService.html\" data-type=\"entity-link\" >FilesService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/GetObjService.html\" data-type=\"entity-link\" >GetObjService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/GetXMLService.html\" data-type=\"entity-link\" >GetXMLService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/ImagesService.html\" data-type=\"entity-link\" >ImagesService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/ItemSettingsService.html\" data-type=\"entity-link\" >ItemSettingsService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/MngclassesService.html\" data-type=\"entity-link\" >MngclassesService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/PackagesService.html\" data-type=\"entity-link\" >PackagesService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/ProfileService.html\" data-type=\"entity-link\" >ProfileService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/ReposService.html\" data-type=\"entity-link\" >ReposService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/UserStatusService.html\" data-type=\"entity-link\" >UserStatusService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/XmlServicesService.html\" data-type=\"entity-link\" >XmlServicesService</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#guards-links"' : 'data-target="#xs-guards-links"', ">\n                            <span class=\"icon ion-ios-lock\"></span>\n                            <span>Guards</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"', ">\n                            <li class=\"link\">\n                                <a href=\"guards/AuthGuardService.html\" data-type=\"entity-link\" >AuthGuardService</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#interfaces-links"' : 'data-target="#xs-interfaces-links"', ">\n                            <span class=\"icon ion-md-information-circle-outline\"></span>\n                            <span>Interfaces</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"', ">\n                            <li class=\"link\">\n                                <a href=\"interfaces/Distro.html\" data-type=\"entity-link\" >Distro</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/File.html\" data-type=\"entity-link\" >File</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/Image.html\" data-type=\"entity-link\" >Image</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/Item.html\" data-type=\"entity-link\" >Item</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/Member.html\" data-type=\"entity-link\" >Member</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/MethodFault.html\" data-type=\"entity-link\" >MethodFault</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/Mgmgtclass.html\" data-type=\"entity-link\" >Mgmgtclass</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/MyStack.html\" data-type=\"entity-link\" >MyStack</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/Package.html\" data-type=\"entity-link\" >Package</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/Param.html\" data-type=\"entity-link\" >Param</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/Profile.html\" data-type=\"entity-link\" >Profile</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/Repo.html\" data-type=\"entity-link\" >Repo</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/System.html\" data-type=\"entity-link\" >System</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/XmlRpcArray.html\" data-type=\"entity-link\" >XmlRpcArray</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/XmlRpcStruct.html\" data-type=\"entity-link\" >XmlRpcStruct</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"', ">\n                            <span class=\"icon ion-ios-cube\"></span>\n                            <span>Miscellaneous</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"', ">\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/functions.html\" data-type=\"entity-link\">Functions</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/typealiases.html\" data-type=\"entity-link\">Type aliases</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/variables.html\" data-type=\"entity-link\">Variables</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class=\"chapter\">\n                            <a data-type=\"chapter-link\" href=\"routes.html\"><span class=\"icon ion-ios-git-branch\"></span>Routes</a>\n                        </li>\n                    <li class=\"chapter\">\n                        <a data-type=\"chapter-link\" href=\"coverage.html\"><span class=\"icon ion-ios-stats\"></span>Documentation coverage</a>\n                    </li>\n                    <li class=\"divider\"></li>\n                    <li class=\"copyright\">\n                        Documentation generated using <a href=\"https://compodoc.app/\" target=\"_blank\">\n                            <img data-src=\"images/compodoc-vectorise.png\" class=\"img-responsive\" data-type=\"compodoc-logo\">\n                        </a>\n                    </li>\n            </ul>\n        </nav>\n        "));
      this.innerHTML = tp.strings;
    }
  }]);

  return _class;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement)));