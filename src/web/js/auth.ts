/// <reference path="ext/jquery-1.8.d.ts" />
/// <reference path="techradar.ts" />

module TechRadar.Client {

    // singleton. Dont call constructor. Talk to AuthInfo.instance instead.
    export class AuthInfo {

        private url = "/api/auth/credentials?format=json";
        public username: string;
        private loggedIn = false;
        private callbacks: { (isloggedin: Boolean): void; }[] = [];

        constructor(
            callback: (isloggedin: bool) => any,
            public userid: string
        ) {
            $('#login-form').submit(e => this.login());
            $('#logout_button').click(e => this.logout());

            // UNTODO: flip comments when not debugging
            this.checkLoggedIn();
            //$('#username').val('tech');
            //$('#password').val('radar');

            AuthInfo.instance = this;

            this.registerCallback(callback);

            if (this.canGetUserData()) {
                this.getUsername();
            }
        }

        public registerCallback(callback: (isloggedin: bool) => any) {
            this.callbacks.push(callback);
        }

        private getUsername() {
            var request = $.ajax({
                url: '/api/users/' + this.userid,
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json'
            });

            request.done(data => {
                this.username = data.Username;
            });

            alertOnFail(request);

            request.always(() => this.updateUi());
        }


        private checkLoggedIn() {
            var request = $.getJSON("/api/session");

            request.done(data => {
                this.loggedIn = true;
                this.username = data.UserName;
                this.userid   = data.UserId;
            });

            request.fail(data => {
                this.loggedIn = false;
            });

            request.always(() => this.updateUi());
        }



        private login() {
            var body = JSON.stringify({
                UserName: $('#username').val(),
                Password: $('#password').val(),
                RememberMe: true
            })

            var request = $.ajax({
                url: this.url,
                type: 'POST',
                contentType: 'application/json',
                data: body,
                dataType: 'json'
            })

            request.done(data => {
                this.loggedIn = true;
                this.username = data.UserName;
                this.userid = data.UserId;
            });

            request.fail(data => {
                this.loggedIn = false;
                showAlert("Inloggen mislukt. Corrigeer je gebruikersnaam of wachtwoord en probeer het nog eens.");
            });

            request.always(() => this.updateUi());
            return false;
        }

        private logout() {
            var request = $.ajax({
                url: this.url + "&UserName=" + this.username,
                type: 'DELETE'
            });

            request.done(data => {
                this.loggedIn = false;
                location.reload();
            });

            request.fail(data => {
                showAlert("Bug! Something went wrong.");
                console.log(data);
            });

            request.always(() => this.updateUi());
        }

        private updateUi() {
            $('.logged-yes').toggle(this.loggedIn);
            $('.logged-no').toggle(!this.loggedIn);

            if (this.loggedIn) {
                $('#current_username').text(this.username);
            }

            for (var i = 0; i < this.callbacks.length; i++) {
                this.callbacks[i](this.loggedIn);
            }
        }

        public isLoggedIn(): bool {
            return this.loggedIn;
        }

        public canGetUserData(): bool {
            return this.userid !== null;
        }

        public static init(callback: (isloggedin: bool) => any, userid: string = null) {
            new AuthInfo(callback, userid);
        }

        private static instance: AuthInfo;
    }

}