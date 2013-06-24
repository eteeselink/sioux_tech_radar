/// <reference path="ext/jquery-1.8.d.ts" />

module TechRadar.Client {
  
  // singleton. Dont call constructor. Talk to AuthInfo.instance instead.
  export class AuthInfo {

    private url = "/api/auth/credentials?format=json";
    private username: string;
    private loggedIn = false;
    private callbacks: { (isloggedin: Boolean): void; }[] = [];

    constructor() {
      $('#login_button').click(e => this.login());
      $('#logout_button').click(e => this.logout());
      this.checkLoggedIn();
    }

    public registerCallback(callback: (isloggedin: Boolean) => any) {
      this.callbacks.push(callback);
    }


    private login() {
      console.log(4);

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
      });

      request.fail(data => {
        this.loggedIn = false;
        alert("Could not log in. Incorrect u/p?");
      });

      request.always(() => this.updateUi());
    }

    private logout() {
      var request = $.ajax({
        url: this.url + "&UserName=" + this.username,
        type: 'DELETE'
      });

      request.done(data => {
        this.loggedIn = false;
      });

      request.fail(data => {  
        alert("Bug! Something went wrong.");
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

    private checkLoggedIn() {
      var request = $.getJSON("/api/session");
      
      request.done(data => {
        this.loggedIn = true;
        this.username = data.UserName;
      });

      request.fail(data => {
        this.loggedIn = false;
      }); 

      request.always(() => this.updateUi());
    }

    public isLoggedIn(): Boolean {
      return this.loggedIn;
    }

    private static instance: AuthInfo = new AuthInfo();
  }

}