var TechRadar;
(function (TechRadar) {
    (function (Client) {
        var AuthInfo = (function () {
            function AuthInfo() {
                var _this = this;
                this.url = "/api/auth/credentials?format=json";
                this.loggedIn = false;
                this.callbacks = [];
                $('#login_button').click(function (e) {
                    return _this.login();
                });
                $('#logout_button').click(function (e) {
                    return _this.logout();
                });
                this.checkLoggedIn();
            }
            AuthInfo.prototype.registerCallback = function (callback) {
                this.callbacks.push(callback);
            };
            AuthInfo.prototype.login = function () {
                var _this = this;
                console.log(4);
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
                });
                request.fail(function (data) {
                    _this.loggedIn = false;
                    alert("Could not log in. Incorrect u/p?");
                });
                request.always(function () {
                    return _this.updateUi();
                });
            };
            AuthInfo.prototype.logout = function () {
                var _this = this;
                var request = $.ajax({
                    url: this.url + "&UserName=" + this.username,
                    type: 'DELETE'
                });
                request.done(function (data) {
                    _this.loggedIn = false;
                });
                request.fail(function (data) {
                    alert("Bug! Something went wrong.");
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
            AuthInfo.prototype.checkLoggedIn = function () {
                var _this = this;
                var request = $.getJSON("/api/session");
                request.done(function (data) {
                    _this.loggedIn = true;
                });
                request.fail(function (data) {
                    _this.loggedIn = false;
                });
                request.always(function () {
                    return _this.updateUi();
                });
            };
            AuthInfo.prototype.isLoggedIn = function () {
                return this.loggedIn;
            };
            AuthInfo.instance = new AuthInfo();
            return AuthInfo;
        })();
        Client.AuthInfo = AuthInfo;        
    })(TechRadar.Client || (TechRadar.Client = {}));
    var Client = TechRadar.Client;
})(TechRadar || (TechRadar = {}));
