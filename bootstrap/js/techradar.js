define(["require", "exports", 'radar', 'view-model'], function(require, exports, __RadarModule__, __ViewModel__) {
    /// <reference path="structs.ts" />
    /// <reference path="view-model.ts" />
    /// <reference path="radar.ts" />
    /// <reference path="ext/jquery-1.8.d.ts" />
    var RadarModule = __RadarModule__;

    var ViewModel = __ViewModel__;

    (function (TechRadar) {
        var Quadrant = ViewModel.Quadrant;
        var Thing = ViewModel.Thing;
        var Radar = RadarModule.Radar;
        var quadrants = [
            Quadrant.Techniques, 
            Quadrant.Tools, 
            Quadrant.Languages, 
            Quadrant.Platforms
        ];
        function getThings() {
            var things = [
                new Thing("C++", Quadrant.Languages, 0.9), 
                new Thing("Scala", Quadrant.Languages, 0.6), 
                new Thing("TypeScript", Quadrant.Languages, 0.7), 
                new Thing("C#", Quadrant.Languages, 0.1), 
                new Thing("APL", Quadrant.Languages, 0.8), 
                new Thing("Continuous Integration", Quadrant.Techniques, 0.8), 
                new Thing("CodeSourcery GCC", Quadrant.Platforms, 0.5), 
                new Thing("NCrunch", Quadrant.Tools, 0.5), 
                new Thing("Git", Quadrant.Tools, 0.6), 
                
            ];
            d3.range(60).forEach(function (i) {
                things.push(new Thing(i.toString(), quadrants[i % 4], RadarModule.random(0.1, 1)));
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
            var radar = new Radar(500, quad, (quad !== null), classes);
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
        TechRadar.Start = Start;
    })(exports.TechRadar || (exports.TechRadar = {}));

})

