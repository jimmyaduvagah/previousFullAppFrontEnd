"use strict";
var authenticated_component_1 = require("./authenticated.component");
var AdminComponent = (function (_super) {
    __extends(AdminComponent, _super);
    function AdminComponent(_router, _sessionService) {
        var _this = _super.call(this, _router, _sessionService) || this;
        _this._router = _router;
        _this._sessionService = _sessionService;
        _this.isAuthenticated = false;
        return _this;
        //
    }
    AdminComponent.prototype.OnAuthenticated = function () {
        if (this._sessionService.user.userprofile.is_admin) {
            this.OnAdminAuthenticated();
        }
        else {
            this._router.navigate(['/']);
        }
    };
    AdminComponent.prototype.OnAdminAuthenticated = function () {
        //
    };
    return AdminComponent;
}(authenticated_component_1.AuthenticatedComponent));
exports.AdminComponent = AdminComponent;
