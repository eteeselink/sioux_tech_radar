/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />
/// <reference path="radar.ts" />
/// <reference path="auth.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />

module TechRadar.Client {

    declare var d3: any;



    function getThings() {
        console.log("getting things");

        var d = $.Deferred();
        $.getJSON("/api/things/search/")
          .done(function (data) {
              var things = [];
              for (var i = 0; i < data.length; i++) {
                  var quadrant = data[i].Quadrantid.toString();
                  var quadrantid;
                  if (quadrant == "Techniques") quadrantid = 0;
                  else if (quadrant == "Tools") quadrantid = 1;
                  else if (quadrant == "Languages") quadrantid = 2;
                  else if (quadrant == "Platforms") quadrantid = 3;

                  things.push(new Thing(data[i].Name, data[i].Title, data[i].Description, quadrantid));			  // , random(0.1, 1.0)
              }//end for
              d.resolve(things);
          }).fail(d.reject);

        return d.promise();
    }

    /// Get all things and all opinions for the current user.
    /// Returns a promise. The data given to a done() call is an
    /// object of the form {opinions: Opinion[], things: Thing[]}.
    function getThingsAndOpinions() {
        console.log("getting things and opinions");
        var d = $.Deferred();
        getThings().done(function (things) {
            console.log("getting opinions");
            $.getJSON("/api/opinions")
                .done(function (data) {
                    var opinions: Opinion[] = [];

                    console.log('opinion api result: ' + JSON.stringify(data));
                    // go through all opinion data elements, and find the thing that has the same name.
                    for (var i = 0; i < data.length; i++) {

                        var thing = findThing(data[i].thingName, things);

                        if (thing != null) {
                            var opinion = new Opinion(thing, data[i].goodness, data[i].rant);
                            opinion.existsOnServer = true;
                            console.log(thing.name + " has an opinion!" + JSON.stringify(opinion));
                            opinions.push(opinion);
                        }
                    }

                    console.log("got opinions and  things " + JSON.stringify(opinions));
                    d.resolve({ things: things, opinions: opinions });
                }).fail(d.reject);
        }).fail(d.reject);

        return d.promise();
    }

    function showTab(q: string) {

        console.log("showTab : " + q);
        // remove earlier radars, if any.
        $('svg.radar').remove();
        $('#thingsList').remove();

        var quad = (q === "all") ? null : Quadrants[parseInt(q, 10)];
        var classes = "quadrant-" + q;
        if (quad !== null) {
            classes += " single-quadrant";
        }
        var radar = new Radar(500, quad, (quad !== null), classes);
        if (AuthInfo.instance.isLoggedIn()) {
            getThingsAndOpinions().done(function (data: { things: Thing[]; opinions: Opinion[]; }) {
                var things = data.things;
                var opinions = data.opinions;
                console.log("got my things =" + JSON.stringify(things));
                console.log("got my opinions =" + JSON.stringify(opinions));
                if (quad !== null) {
                    showList(data.things, data.opinions, quad, radar);
                } else {
                    showAllThings(data.opinions, radar);
                }
            });
        }
    }



    function addThing(thingname: string, quadrantnum: number) {
        var newThing = new Thing(null, thingname, thingname + " has no description", quadrantnum); // random(0.1, 1.0)

        var dataforjson = JSON.stringify({ "Title": newThing.title, "Description": newThing.description, "Quadrantid": quadrantnum });

        return $.ajax({
            url: "/api/things/",
            type: 'POST',
            contentType: 'application/json',
            data: dataforjson,
            dataType: 'json'
        });
    }

    function addOpinion(opinion: Opinion, radar: Radar) {
        radar.addOpinion(opinion);

        //  TODO: maybe this logic belongs in the Opinion class, by refactoring
        // updateOpinion and storeNewOpinion into a single save() method?
        if (opinion.existsOnServer) {
            opinion.updateOpinion();
        } else {
            opinion.existsOnServer = true;
            opinion.storeNewOpinion();
        }
    }
    
    /// Find the thing named `thingname` in `things`. Returns `null` if none found.
    function findThing(thingname: string, things: Thing[]) {
        var things_matched = things.filter(t => t.name == thingname);
        if (things_matched.length != 1) {
            return null;
        }
        return things_matched[0];
    }

    function removeOpinion(opinion: Opinion, radar: Radar) {
        radar.removeOpinion(opinion);
        opinion.existsOnServer = false; // not sure how much sense this makes, i guess the opinion object is gone for good now.
        opinion.deleteOpinion();
    }

    /// Shows the things for the overview tab, of all four quadrants
    function showAllThings(opinions: Opinion[], radar: Radar) {
        opinions.forEach(opinion => {
            addOpinion(opinion, radar);
        });
    }

    function showList(things: Thing[], opinions: Opinion[], quadrant: Quadrant, radar: Radar) {
        var parentContainer = $('<div id="thingsList" class="thing-list-left btn-group btn-group-vertical">');
        var container = $('<div class=" btn-group  btn-group-vertical" data-toggle="buttons-checkbox">');

        // draw thing buttons
        var selectedThings = things.filter(o => o.quadrant() === quadrant);
        selectedThings.forEach(thing => {
            container.append('<button class="btn btn_thing thingButton" data-thing="' + thing.name + '">' + thing.title + '</button>')
        });

        // add opinions to radar and set thing button state
        var selectedOpinions = opinions.filter(o => o.thing.quadrant() === quadrant);
        console.log("Selected opinions: " + JSON.stringify(selectedOpinions));
        selectedOpinions.forEach(opinion => {
            var button = container.find('.thingButton[data-thing=' + opinion.thing.name + ']');
            button.addClass("active");
            button.data("opinion", opinion); // tie the Opinion object directly to the Button element, using jQuery. This way, we never lose it.
            addOpinion(opinion, radar)
        });

        // add handlers for thing-button clicks.
        container.find('.thingButton').click(function (ev) {
            var button = $(this);
            var thingname = button.data('thing');
            var thing = findThing(thingname, things);

            if (thing == null) {
                alert("Programmer bug! Amount of things matched to button unexpected.");
                throw new Error("Programmer bug! Amount of things matched to button unexpected.")
            }
            if (!button.hasClass('active')) {
                // create a new opinion object and add it to the radar. store the object with the button.
                var opinion = new Opinion(thing, random(0.0, 1.0), "");
                button.data('opinion', opinion);
                addOpinion(opinion, radar);
                buildRantList(selectedOpinions);

            } else {
                // get the opinion object back from the button, and remove it everywhere.
                var opinion: Opinion = button.data('opinion');
                removeOpinion(opinion, radar);
                button.data('opinion', null);
            }
        });


        //section for adding rants    
        buildRantList(selectedOpinions);


        //Section for adding a thing.       
        var btnAdd = $('<button class="btn btn_thing btn-info"  data-toggle="modal" data-target="#addThingsModal">Add</button>');
        parentContainer.append(btnAdd);

        $('#addthingsform').unbind('submit');
        $('#addthingsform').submit((ev) => {
            addThing($('input#titleInput').val(), quadrant.id).done(function (thing) {
                container.append('<button class="btn btn_thing thingButton" data-thing="' + thing.name + '">' + thing.title + '</button>')
                showTab(quadrant.id.toString());
                $('#addSuccess').text($('input#titleInput').val() + " has been added.");
                $('#addSuccess').show();
            });
            ev.preventDefault();
        });

        parentContainer.append(container);
        $('body').append(parentContainer);
    }

    function buildRantList(opinions: Opinion[]) {
        $('#rantList').remove();
        $('body').append('<div class="rants-list-right" id="rantList"></div>');
        $('#rantList').append('<p>click to add rant</p>');
        opinions.forEach(opinion => {
            $('#rantList').append(newRantForAccordion(opinion));
        });
        $('#rantList').show();
    }

    function newRantForAccordion(opinion: Opinion) {
        var thing = opinion.thing;
        console.log("adding rant for " + thing.name);
        var aGroup = $('<div class="accordion-group">');
        var ahead = $('<div class="accordion-heading">');
        ahead.append('<a class="accordion-toggle" data-toggle="collapse" data-parent="#rantList" href="#collapse' + thing.name + '">' + thing.title + '</a>');
        aGroup.append(ahead);

        var aBody = $('<div id="collapse' + thing.name + '" class="accordion-body collapse">');
        var subBody = $('<div class="accordion-inner">');
        aBody.append(subBody);
        var inputRant = $('<textarea id = "input' + thing.name + '" > ' + opinion.rant + ' </textarea>');
        subBody.append(inputRant);
        aGroup.append(aBody);

        var handler = function () {
            opinion.rant = inputRant.val();
            console.log("updating rant: " + opinion.rant);
            opinion.updateOpinion();
        };

        inputRant.change(handler);

        return aGroup;
    }


    function makeTabs() {
        $('a[data-toggle="tab"]').on('shown', e => showTab($(e.target).data('q')));
    }


    export function Start() {
        makeTabs();

        AuthInfo.instance.registerCallback(function () { showTab($('li.active a[data-toggle="tab"]').data('q')); });
        showTab($('li.active a[data-toggle="tab"]').data('q'));
        return this;
    }
}

