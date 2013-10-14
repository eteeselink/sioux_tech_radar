var TechRadar;
(function (TechRadar) {
    (function (Client) {
        var Tab = (function () {
            function Tab(q) {
                var _this = this;
                $('svg.radar').remove();
                var quad = (q === "all") ? null : Client.Quadrants[parseInt(q, 10)];
                var classes = "quadrant-" + q;
                if(quad !== null) {
                    classes += " single-quadrant";
                }
                var radar = new Client.Radar(375, quad, (quad !== null), classes);
                if(Client.AuthInfo.instance.isLoggedIn()) {
                    Client.getThingsAndOpinions(quad).done(function (data) {
                        var things = data.things;
                        var opinions = data.opinions;
                        if(quad !== null) {
                            _this.thingsList = new Client.ThingList(_this, data.things, data.opinions, quad, radar);
                        } else {
                            _this.showAllThings(data.opinions, radar);
                        }
                    });
                }
            }
            Tab.prototype.addThing = function (thingname, quadrantnum) {
                var newThing = new Client.Thing(null, thingname, thingname + " has no description", quadrantnum);
                var dataforjson = JSON.stringify({
                    "Title": newThing.title,
                    "Description": newThing.description,
                    "Quadrantid": quadrantnum
                });
                return $.ajax({
                    url: "/api/things/",
                    type: 'POST',
                    contentType: 'application/json',
                    data: dataforjson,
                    dataType: 'json'
                });
            };
            Tab.prototype.addOpinion = function (opinion, radar) {
                radar.addOpinion(opinion);
                opinion.onChange(function () {
                    return expandRant(opinion);
                });
                if(opinion.existsOnServer) {
                    opinion.updateOpinion();
                } else {
                    opinion.existsOnServer = true;
                    opinion.storeNewOpinion();
                }
            };
            Tab.prototype.removeOpinion = function (opinion, radar) {
                radar.removeOpinion(opinion);
                opinion.onChange(null);
                opinion.existsOnServer = false;
                opinion.deleteOpinion();
            };
            Tab.prototype.showAllThings = function (opinions, radar) {
                var _this = this;
                opinions.forEach(function (opinion) {
                    _this.addOpinion(opinion, radar);
                });
            };
            return Tab;
        })();
        Client.Tab = Tab;        
        function expandRant(opinion) {
            console.log(opinion.thing.title);
            var el = $('#collapse' + opinion.thing.name);
            console.log(el);
            (el).collapse('show');
        }
    })(TechRadar.Client || (TechRadar.Client = {}));
    var Client = TechRadar.Client;
})(TechRadar || (TechRadar = {}));
