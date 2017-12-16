"use strict";
var AuthenticatedComponent = (function () {
    function AuthenticatedComponent(_router, _sessionService) {
        this._router = _router;
        this._sessionService = _sessionService;
        this.isAuthenticated = false;
        this.start();
        return;
        //
    }
    AuthenticatedComponent.prototype.OnAuthenticated = function () {
        //
    };
    AuthenticatedComponent.prototype.start = function () {
        var _this = this;
        var sub;
        setTimeout(function () {
            if (typeof _this._sessionService.user !== 'undefined' && _this._sessionService.user !== null) {
                _this.user = _this._sessionService.user;
                _this.isAuthenticated = _this._sessionService.isLoggedIn();
                _this.OnAuthenticated();
            }
            else {
                sub = _this._sessionService.userObservable.subscribe(function (res) {
                    _this.user = res;
                    _this.OnAuthenticated();
                    _this.isAuthenticated = _this._sessionService.isLoggedIn();
                    sub.unsubscribe();
                    sub = null;
                });
            }
        }, 1);
    };
    return AuthenticatedComponent;
}());
exports.AuthenticatedComponent = AuthenticatedComponent;
