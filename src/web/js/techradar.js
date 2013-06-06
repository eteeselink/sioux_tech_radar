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
            var things = [];
            $.ajaxSetup({
                async: false
            });
            $.getJSON("http://localhost:54321/api/things/search/").done(function (data) {
                for(var i = 0; i < data.length; i++) {
                    things.push(new Client.Thing(data[i].Title, quadrants[i % 4], TechRadar.random(0.1, 1)));
                }
            });
            $.ajaxSetup({
                async: true
            });
            return things;
        }
        function showTab(q) {
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

