var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var TechRadar;
(function (TechRadar) {
    (function (Server) {
        var Person = (function () {
            function Person(username, fullName) {
                this.username = username;
                this.fullName = fullName;
            }
            Person.prototype.IsAllowedTo = function (action, thing) {
                return true;
            };
            return Person;
        })();
        Server.Person = Person;        
        var Action = (function (_super) {
            __extends(Action, _super);
            function Action() {
                        _super.call(this, Action);
            }
            Action.Create = new Action();
            Action.Read = new Action();
            Action.Update = new Action();
            return Action;
        })(TechRadar.Enum);
        Server.Action = Action;        
        var Persons = (function () {
            function Persons() { }
            Persons.GetCurrentUser = function GetCurrentUser() {
                return new Person("unknown", "Unk Nown");
            }
            return Persons;
        })();
        Server.Persons = Persons;        
    })(TechRadar.Server || (TechRadar.Server = {}));
    var Server = TechRadar.Server;

})(TechRadar || (TechRadar = {}));

