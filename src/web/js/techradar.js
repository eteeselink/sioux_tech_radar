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
                    console.log("GetJSON quadrant : " + data[i].quadrant);
                    things.push(new Client.Thing(data[i].Title, i % 4, quadrants[i % 4], TechRadar.random(0.1, 1)));
                }
            });
            $.ajaxSetup({
                async: true
            });
            return things;
        }
        function showTab(q) {
            console.log("showTab : " + q);
            $('svg.radar').remove();
            $('div.thing-list').remove();
            var quad = (q === "all") ? null : quadrants[parseInt(q, 10)];
            var classes = "quadrant-" + q;
            if(quad !== null) {
                classes += " single-quadrant";
            }
            var radar = new Client.Radar(500, quad, (quad !== null), classes);
            if(quad !== null) {
                showList(getThings(), parseInt(q, 10), quad, radar);
            }
        }
        function addThing(thingname, quadrantnum, quadrant) {
            var newThing = new Client.Thing(thingname, quadrantnum, quadrant, TechRadar.random(0.1, 1));
            var dataforjson = JSON.stringify(newThing);
            console.log("dataforjson : ");
            console.log(dataforjson);
            $.ajax({
                url: "http://localhost:54321/api/things/",
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(newThing),
                dataType: 'json'
            }).done(function (data) {
                console.log("ajax (addThing) OK");
            });
        }
        function addOpinion(thingname, things, radar) {
            var things_matched = things.filter(function (t) {
                return t.name == thingname;
            });
            if(things_matched.length != 1) {
                alert("Amount of things matched to button unexpected : " + things_matched.length);
            }
            if(thingname.length > 0) {
                radar.addOpinion(things_matched[0]);
            }
            console.log("added opinion : " + things_matched[0].name + ", goodness: " + things_matched[0].goodness + ", quadrant:  " + things_matched[0].quadrant);
        }
        function removeOpinion(thingname, things, radar) {
            var things_matched = things.filter(function (t) {
                return t.name == thingname;
            });
            if(things_matched.length != 1) {
                alert("Amount of things matched to button unexpected : " + things_matched.length);
            }
            if(thingname.length > 0) {
                radar.removeOpinion(things_matched[0]);
            }
        }
        function showList(things, quadrantnum, quadrant, radar) {
            var contClass = quadrant.isLeft() ? "thing-list-left" : "thing-list-right";
            var container = $('<div class="btn-group btn-group-vertical thing-list ' + contClass + '" data-toggle="buttons-checkbox">');
            var selectedThings = things.filter(function (t) {
                return t.quadrant === quadrant;
            });
            selectedThings.forEach(function (thing) {
                container.append('<button class="btn" data-thing="' + thing.name + '">' + thing.name + '</button>');
            });
            container.find('.btn').click(function (ev) {
                var thingname = $(this).data('thing');
                console.log($(this).data('thing'));
                console.log("button pressed, name = " + thingname);
                if(!$(this).hasClass('active')) {
                    addOpinion(thingname, things, radar);
                } else {
                    removeOpinion(thingname, things, radar);
                }
                console.log("processed (added or removed opinion) : " + thingname);
            });
            container.append('<button class="addbtn">' + 'ADD' + '</button>');
            container.append('title: <input type="text" id="title">');
            container.find('.addbtn').click(function (ev) {
                addThing($("#title").val(), quadrantnum, quadrant);
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

//@ sourceMappingURL=techradar.js.map
