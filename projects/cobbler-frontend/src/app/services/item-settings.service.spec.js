"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var item_settings_service_1 = require("./item-settings.service");
describe("ItemSettingsService", function () {
  var service;
  beforeEach(function () {
    testing_1.TestBed.configureTestingModule({});
    service = testing_1.TestBed.inject(
      item_settings_service_1.ItemSettingsService,
    );
  });
  it("should be created", function () {
    expect(service).toBeTruthy();
  });
});
//# sourceMappingURL=item-settings.service.spec.js.map
