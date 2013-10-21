var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TechRadar;
(function (TechRadar) {
    (function (Client) {
        var deg45 = Math.PI / 4;
        var Quadrant = (function (_super) {
            __extends(Quadrant, _super);
            function Quadrant(xloc, yloc, angle, id) {
                        _super.call(this, Quadrant);
                this.xloc = xloc;
                this.yloc = yloc;
                this.angle = angle;
                this.id = id;
            }
            Quadrant.Techniques = new Quadrant(-1, -1, 3 * deg45, 0);
            Quadrant.Tools = new Quadrant(1, -1, 1 * deg45, 1);
            Quadrant.Languages = new Quadrant(1, 1, -1 * deg45, 2);
            Quadrant.Platforms = new Quadrant(-1, 1, -3 * deg45, 3);
            Quadrant.prototype.angleLower = function () {
                return this.angle - deg45;
            };
            Quadrant.prototype.angleUpper = function () {
                return this.angle + deg45;
            };
            Quadrant.prototype.isLeft = function () {
                return this.xloc < 0;
            };
            Quadrant.prototype.isTop = function () {
                return this.yloc < 0;
            };
            return Quadrant;
        })(TechRadar.Enum);
        Client.Quadrant = Quadrant;        
        function storeDto(url, dto) {
            return $.ajax({
                url: url,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(dto),
                dataType: 'json'
            });
        }
        Client.Quadrants = [
            Quadrant.Techniques, 
            Quadrant.Tools, 
            Quadrant.Languages, 
            Quadrant.Platforms
        ];
        var Thing = (function () {
            function Thing(name, title, description, quadrantid) {
                this.name = name;
                this.title = title;
                this.description = description;
                this.quadrantid = quadrantid;
            }
            Thing.prototype.quadrant = function () {
                return Client.Quadrants[this.quadrantid];
            };
            Thing.prototype.updateDescription = function () {
                console.log("ajax (updateDescription) called");
                var thing = {
                    description: this.description
                };
                var url = "/api/things/" + encodeURIComponent(this.name);
                return storeDto(url, thing);
            };
            return Thing;
        })();
        Client.Thing = Thing;        
        var Opinion = (function (_super) {
            __extends(Opinion, _super);
            function Opinion(thing, goodness, rant) {
                        _super.call(this, null, null);
                this.thing = thing;
                this.rant = rant;
                this.onSelectCallback = function () {
                };
                this.onChangeCallback = function () {
                };
                this.onMoveCallback = function () {
                };
                this.existsOnServer = false;
                this.previousGoodness = goodness;
                this.setgoodness(goodness);
            }
            Opinion.functionify = function functionify(f) {
                return f || function () {
                };
            };
            Opinion.prototype.element = function () {
                return $('#opinion_' + this.thing.name);
            };
            Opinion.prototype.onSelect = function (callback) {
                this.onSelectCallback = Opinion.functionify(callback);
            };
            Opinion.prototype.onChange = function (callback) {
                this.onChangeCallback = Opinion.functionify(callback);
            };
            Opinion.prototype.onMove = function (callback) {
                this.onMoveCallback = Opinion.functionify(callback);
            };
            Opinion.prototype.notifyServer = function () {
                if(!this.isBeingDragged()) {
                    var goodnessDiff = Math.abs(this.previousGoodness - this.goodness());
                    if(isNaN(goodnessDiff) || !isFinite(goodnessDiff) || goodnessDiff <= 0.05) {
                        return;
                    }
                    this.previousGoodness = this.goodness();
                    this.updateOpinion();
                    this.onChangeCallback();
                }
                this.onMoveCallback();
            };
            Opinion.prototype.deleteOpinion = function () {
                console.log("ajax (deleteOpinion) called");
                return $.ajax({
                    url: "/api/opinions/" + Client.AuthInfo.instance.userid + "/" + encodeURIComponent(this.thing.name),
                    type: 'DELETE',
                    contentType: 'application/json',
                    dataType: 'json'
                });
            };
            Opinion.prototype.updateOpinion = function () {
                console.log("ajax (updateOpinion) called");
                var opinion = {
                    thingName: this.thing.name,
                    rant: this.rant,
                    goodness: this.goodness()
                };
                return this.store(opinion);
            };
            Opinion.prototype.storeNewOpinion = function () {
                console.log("ajax (storeNewOpinion) called");
                var opinion = {
                    thingName: this.thing.name,
                    goodness: this.goodness()
                };
                return this.store(opinion);
            };
            Opinion.prototype.store = function (opinion) {
                var url = "/api/opinions/" + Client.AuthInfo.instance.userid + "/" + encodeURIComponent(opinion.thingName);
                return storeDto(url, opinion);
            };
            Opinion.prototype.updatePolar = function (goodnessEditable) {
                this.prevPolar = this.polar;
                this.polar = Client.Polar.fromPoint(this.x, this.y);
                if(goodnessEditable) {
                    this.notifyServer();
                }
            };
            Opinion.prototype.fixRadius = function (goodnessEditable) {
                if((!this.isBeingDragged()) || (!goodnessEditable)) {
                    this.polar.r = this.prevPolar.r;
                }
            };
            Opinion.prototype.updateXY = function () {
                this.x = this.polar.x();
                this.y = this.polar.y();
            };
            Opinion.prototype.isBeingDragged = function () {
                return (this.fixed & 2) !== 0;
            };
            Opinion.prototype.goodness = function () {
                return this.polar.r / Client.Radar.radius;
            };
            Opinion.prototype.setgoodness = function (goodness) {
                var r = goodness * Client.Radar.radius;
                var phi = this.thing.quadrant().angle + TechRadar.random(0.01, 0.02);
                this.polar = new Client.Polar(r, phi);
                this.updateXY();
            };
            return Opinion;
        })(Client.D3Node);
        Client.Opinion = Opinion;        
    })(TechRadar.Client || (TechRadar.Client = {}));
    var Client = TechRadar.Client;
})(TechRadar || (TechRadar = {}));
