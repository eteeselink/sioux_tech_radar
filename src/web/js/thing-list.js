var TechRadar;
(function (TechRadar) {
    (function (Client) {
        var ThingList = (function () {
            function ThingList(tab, things, opinions, quadrant) {
                this.tab = tab;
                this.things = things;
                this.opinions = opinions;
                this.quadrant = quadrant;
                var _this = this;
                ThingList.remove();
                var parentContainer = $('<div id="thingsList" class="thing-list-left">');
                this.container = $('<div class=" btn-group  btn-group-vertical" data-toggle="buttons-checkbox">');
                this.drawThingButtons();
                var selectedOpinions = this.opinions.filter(function (o) {
                    return o.thing.quadrant() === _this.quadrant;
                });
                this.addOpinions(selectedOpinions);
                var buttons = this.container.find('.thingButton');
                buttons.click(function (ev) {
                    return _this.onButtonClick(ev);
                });
                buttons.mouseover(function (ev) {
                    return _this.onMouseOver(ev);
                });
                buttons.mouseout(function (ev) {
                    return _this.onMouseOut(ev);
                });
                parentContainer.append(this.container);
                $('#contents').append(parentContainer);
                this.drawAddThingButton();
            }
            ThingList.remove = function remove() {
                $('#thingsList').remove();
            };
            ThingList.prototype.findThing = function (button) {
                var thingname = button.data('thing');
                return Client.findThing(thingname, this.things);
            };
            ThingList.prototype.onMouseOver = function (ev) {
                var button = $(ev.target);
                var thing = this.findThing(button);
                this.tab.showDescOverlay(thing);
            };
            ThingList.prototype.onMouseOut = function (ev) {
                var button = $(ev.target);
                var thing = this.findThing(button);
                $('#desc-overlay-container').hide();
                var desc = $('#desc-container');
                if(this.tab.hasActiveSelection()) {
                    desc.show();
                }
            };
            ThingList.prototype.onButtonClick = function (ev) {
                var button = $(ev.target);
                var thing = this.findThing(button);
                if(thing == null) {
                    Client.showAlert("Programmer bug! Amount of things matched to button unexpected.");
                    throw new Error("Programmer bug! Amount of things matched to button unexpected.");
                }
                if(!button.hasClass('active')) {
                    if(this.tab.countOpinions() >= 5) {
                        Client.showAlert("Je mag maximaal 5 meningen geven per onderwerp. Kies de belangrijkste uit!");
                        return false;
                    }
                    var opinion = new Client.Opinion(thing, TechRadar.random(0.0, 1.0), "");
                    button.data('opinion', opinion);
                    this.tab.addOpinion(opinion);
                    this.tab.selectOpinion(opinion);
                } else {
                    var opinion = button.data('opinion');
                    this.tab.removeOpinion(opinion);
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
                    _this.tab.addOpinion(opinion);
                });
            };
            ThingList.prototype.drawAddThingButton = function () {
                var _this = this;
                $('#thingsList').append('<div><input type="text" id="thing-add-title"><button class="btn" id="thing-add-submit">+</button></div>');
                $('#thing-add-submit').click(function (ev) {
                    var request = _this.tab.addThing($('#thing-add-title').val(), _this.quadrant.id);
                    request.done(function (thing) {
                        _this.container.append('<button class="btn btn_thing thingButton" data-thing="' + thing.name + '">' + thing.title + '</button>');
                        Client.Tab.show(_this.quadrant.id.toString());
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
