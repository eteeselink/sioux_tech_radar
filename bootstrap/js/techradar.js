/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />
/// <reference path="radar.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />
var TechRadar;
(function (TechRadar) {
    (function (Client) {
        var quadrants = [
            Client.Quadrant.Techniques, 
            Client.Quadrant.Tools, 
            Client.Quadrant.Languages, 
            Client.Quadrant.Platforms
        ];
        function getThings() {
            var things = [
                new Client.Thing("C++", Client.Quadrant.Languages, 0.9), 
                new Client.Thing("Scala", Client.Quadrant.Languages, 0.6), 
                new Client.Thing("TypeScript", Client.Quadrant.Languages, 0.7), 
                new Client.Thing("C#", Client.Quadrant.Languages, 0.1), 
                new Client.Thing("APL", Client.Quadrant.Languages, 0.8), 
                new Client.Thing("Continuous Integration", Client.Quadrant.Techniques, 0.8), 
                new Client.Thing("CodeSourcery GCC", Client.Quadrant.Platforms, 0.5), 
                new Client.Thing("NCrunch", Client.Quadrant.Tools, 0.5), 
                new Client.Thing("Git", Client.Quadrant.Tools, 0.6), 
                
            ];
            d3.range(60).forEach(function (i) {
                things.push(new Client.Thing(i.toString(), quadrants[i % 4], TechRadar.random(0.1, 1)));
            });
            return things;
        }
        function showTab(q) {
            // remove earlier radars, if any.
            $('svg.radar').remove();
            $('div.thing-list').remove();
            var quad = (q === "all") ? null : quadrants[parseInt(q, 10)];
            var classes = "quadrant-" + q;
            if(quad !== null) {
                classes += " single-quadrant";
            }
            var radar = new Client.Radar(500, quad, (quad !== null), classes);
            var things = getThings();
            radar.addThings(things);
            if(quad !== null) {
                showList(things, quad, radar);
            }
        }
        function showList(things, quadrant, radar) {
            var contClass = quadrant.isLeft() ? "thing-list-left" : "thing-list-right";
            var container = $('<div class="btn-group btn-group-vertical thing-list ' + contClass + '" data-toggle="buttons-checkbox">');
            var selectedThings = things.filter(function (t) {
                return t.quadrant === quadrant;
            });
            selectedThings.forEach(function (thing) {
                container.append('<button class="btn" data-thing="' + thing.name + '">' + thing.name + '</button>');
            });
            container.find('.btn').click(function (ev) {
                var _this = this;
                var thing = things.filter(function (t) {
                    return t.name == $(_this).data('thing');
                });
                if(!$(this).hasClass('active')) {
                    radar.addThings(thing);
                } else {
                }
            });
            $('body').append(container);
        }
        function makeTabs() {
            $('a[data-toggle="tab"]').on('shown', function (e) {
                return showTab($(e.target).data('q'));
            });
        }
        function Start() {
            makeTabs();
            showTab($('li.active a[data-toggle="tab"]').data('q'));
            return this;
        }
        Client.Start = Start;
    })(TechRadar.Client || (TechRadar.Client = {}));
    var Client = TechRadar.Client;

})(TechRadar || (TechRadar = {}));

