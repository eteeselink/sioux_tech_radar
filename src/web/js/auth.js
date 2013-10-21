var TechRadar;
(function (TechRadar) {
    (function (Client) {
        var AuthInfo = (function () {
            function AuthInfo(callback, userid) {
                this.userid = userid;
                var _this = this;
                this.url = "/api/auth/credentials?format=json";
                this.loggedIn = false;
                this.callbacks = [];
                $('#login-form').submit(function (e) {
                    return _this.login();
                });
                $('#logout_button').click(function (e) {
                    return _this.logout();
                });
                this.checkLoggedIn();
                AuthInfo.instance = this;
                this.registerCallback(callback);
                if(this.canGetUserData()) {
                    this.getUsername();
                }
            }
            AuthInfo.prototype.registerCallback = function (callback) {
                this.callbacks.push(callback);
            };
            AuthInfo.prototype.getUsername = function () {
                var _this = this;
                var request = $.ajax({
                    url: '/api/users/' + this.userid,
                    type: 'GET',
                    contentType: 'application/json',
                    dataType: 'json'
                });
                request.done(function (data) {
                    _this.username = data.Username;
                });
                Client.alertOnFail(request);
                request.always(function () {
                    return _this.updateUi();
                });
            };
            AuthInfo.prototype.checkLoggedIn = function () {
                var _this = this;
                var request = $.getJSON("/api/session");
                request.done(function (data) {
                    _this.loggedIn = true;
                    _this.username = data.UserName;
                    _this.userid = data.UserId;
                });
                request.fail(function (data) {
                    _this.loggedIn = false;
                });
                request.always(function () {
                    return _this.updateUi();
                });
            };
            AuthInfo.prototype.login = function () {
                var _this = this;
                var body = JSON.stringify({
                    UserName: $('#username').val(),
                    Password: $('#password').val(),
                    RememberMe: true
                });
                var request = $.ajax({
                    url: this.url,
                    type: 'POST',
                    contentType: 'application/json',
                    data: body,
                    dataType: 'json'
                });
                request.done(function (data) {
                    _this.loggedIn = true;
                    _this.username = data.UserName;
                    _this.userid = data.UserId;
                });
                request.fail(function (data) {
                    _this.loggedIn = false;
                    Client.showAlert("Inloggen mislukt. Corrigeer je gebruikersnaam of wachtwoord en probeer het nog eens.");
                });
                request.always(function () {
                    return _this.updateUi();
                });
                return false;
            };
            AuthInfo.prototype.logout = function () {
                var _this = this;
                var request = $.ajax({
                    url: this.url + "&UserName=" + this.username,
                    type: 'DELETE'
                });
                request.done(function (data) {
                    _this.loggedIn = false;
                    location.reload();
                });
                request.fail(function (data) {
                    Client.showAlert("Bug! Something went wrong.");
                    console.log(data);
                });
                request.always(function () {
                    return _this.updateUi();
                });
            };
            AuthInfo.prototype.updateUi = function () {
                $('.logged-yes').toggle(this.loggedIn);
                $('.logged-no').toggle(!this.loggedIn);
                if(this.loggedIn) {
                    $('#current_username').text(this.username);
                }
                for(var i = 0; i < this.callbacks.length; i++) {
                    this.callbacks[i](this.loggedIn);
                }
            };
            AuthInfo.prototype.isLoggedIn = function () {
                return this.loggedIn;
            };
            AuthInfo.prototype.canGetUserData = function () {
                return this.userid !== null;
            };
            AuthInfo.init = function init(callback, userid) {
                if (typeof userid === "undefined") { userid = null; }
                new AuthInfo(callback, userid);
            };
            return AuthInfo;
        })();
        Client.AuthInfo = AuthInfo;        
    })(TechRadar.Client || (TechRadar.Client = {}));
    var Client = TechRadar.Client;
})(TechRadar || (TechRadar = {}));
