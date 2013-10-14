var TechRadar;
(function (TechRadar) {
    (function (Client) {
        var ThingList = (function () {
            function ThingList(tab, things, opinions, quadrant, radar) {
                this.tab = tab;
                this.things = things;
                this.opinions = opinions;
                this.quadrant = quadrant;
                this.radar = radar;
                var _this = this;
                $('#thingsList').remove();
                var parentContainer = $('<div id="thingsList" class="thing-list-left">');
                this.container = $('<div class=" btn-group  btn-group-vertical" data-toggle="buttons-checkbox">');
                this.drawThingButtons();
                var selectedOpinions = this.opinions.filter(function (o) {
                    return o.thing.quadrant() === _this.quadrant;
                });
                this.addOpinions(selectedOpinions);
                this.container.find('.thingButton').click(function (ev) {
                    return _this.onButtonClick(ev);
                });
                parentContainer.append(this.container);
                $('#contents').append(parentContainer);
                this.drawAddThingButton();
            }
            ThingList.prototype.onButtonClick = function (ev) {
                var button = $(ev.target);
                var thingname = button.data('thing');
                var thing = Client.findThing(thingname, this.things);
                if(thing == null) {
                    alert("Programmer bug! Amount of things matched to button unexpected.");
                    throw new Error("Programmer bug! Amount of things matched to button unexpected.");
                }
                if(!button.hasClass('active')) {
                    var opinion = new Client.Opinion(thing, TechRadar.random(0.0, 1.0), "");
                    button.data('opinion', opinion);
                    this.tab.addOpinion(opinion, this.radar);
                } else {
                    var opinion = button.data('opinion');
                    this.tab.removeOpinion(opinion, this.radar);
                    button.data('opinion', null);
                }
            };
            ThingList.prototype.drawThingButtons = function () {
                var _this = this;
                var selectedThings = this.things.filter(function (o) {
                    return o.quadrant() === _this.quadrant;
                });
                selectedThings.forEach(function (thing) {
                    _this.container.append('<button class="btn btn_thing thingButton" data-thing="' + thing.name + '">' + thing.title + '</button>');
                });
            };
            ThingList.prototype.addOpinions = function (selectedOpinions) {
                var _this = this;
                selectedOpinions.forEach(function (opinion) {
                    var button = _this.container.find('.thingButton[data-thing=\'' + opinion.thing.name + '\']');
                    button.addClass("active");
                    button.data("opinion", opinion);
                    _this.tab.addOpinion(opinion, _this.radar);
                });
            };
            ThingList.prototype.drawAddThingButton = function () {
                var _this = this;
                $('#thingsList').append('<div><input type="text" id="thing-add-title"><button class="btn" id="thing-add-submit">+</button></div>');
                $('#thing-add-submit').click(function (ev) {
                    var request = _this.tab.addThing($('#thing-add-title').val(), _this.quadrant.id);
                    request.done(function (thing) {
                        _this.container.append('<button class="btn btn_thing thingButton" data-thing="' + thing.name + '">' + thing.title + '</button>');
                        Client.showTab(_this.quadrant.id.toString());
                    });
                    Client.alertOnFail(request);
                    ev.preventDefault();
                });
            };
            return ThingList;
        })();
        Client.ThingList = ThingList;        
    })(TechRadar.Client || (TechRadar.Client = {}));
    var Client = TechRadar.Client;
})(TechRadar || (TechRadar = {}));
