/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />
/// <reference path="radar.ts" />
/// <reference path="auth.ts" />
/// <reference path="thing-list.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />

module TechRadar.Client {

    declare var d3: any;

    /// global singleton tab object.
    var currentTab: Tab;

    function showAlert(text: string) {
        $('#alert-text').html(text);
        $(".alert").show();
    }

    export function alertOnFail(request: JQueryXHR) {
        request.fail(function (xhr: JQueryXHR, textStatus: string, errorThrown: string) {
            showAlert("Server said: " + errorThrown);
        });
    }

    export function showTab(q: string) {
        currentTab = new Tab(q);
    }

    export class Tab {

        private thingsList: ThingList;

        constructor(q: string) {
        
            // remove earlier radars, if any.
            $('svg.radar').remove();

            var quad = (q === "all") ? null : Quadrants[parseInt(q, 10)];
            var classes = "quadrant-" + q;
            if (quad !== null) {
                classes += " single-quadrant";
            }
            var radar = new Radar(375, quad, (quad !== null), classes);
            if (AuthInfo.instance.isLoggedIn()) {
                getThingsAndOpinions(quad).done((data: { things: Thing[]; opinions: Opinion[]; }) => {
                    var things = data.things;
                    var opinions = data.opinions;

                    if (quad !== null) {
                        // recreate the interactive thing list, which allows additions and removals to the radar
                        this.thingsList = new ThingList(this, data.things, data.opinions, quad, radar);

                    } else {
                        this.showAllThings(data.opinions, radar);

                    }
                });
            }

        }

        /// Creates a new Thing on the server. Returns a promise with as a single argument all
        /// data fields (name, title, etc) of the newly created thing. Notably, this means that the
        /// server chooses how a thing's title is turned into a name.
        public addThing(thingname: string, quadrantnum: number) {
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

        public addOpinion(opinion: Opinion, radar: Radar) {
            radar.addOpinion(opinion);
            opinion.onChange(() => expandRant(opinion));

            //  TODO: maybe this logic belongs in the Opinion class, by refactoring
            // updateOpinion and storeNewOpinion into a single save() method?
            if (opinion.existsOnServer) {
                opinion.updateOpinion();
            } else {
                opinion.existsOnServer = true;
                opinion.storeNewOpinion();
            }
        }


        public removeOpinion(opinion: Opinion, radar: Radar) {
            radar.removeOpinion(opinion);
            opinion.onChange(null);
            opinion.existsOnServer = false; // not sure how much sense this makes, i guess the opinion object is gone for good now.
            opinion.deleteOpinion();
        }

        /// Shows the things for the overview tab, of all four quadrants
        public showAllThings(opinions: Opinion[], radar: Radar) {
            opinions.forEach(opinion => {
                this.addOpinion(opinion, radar);
            });
        }


    }



    /// Find the thing named `thingname` in `things`. Returns `null` if none found.
    export function findThing(thingname: string, things: Thing[]) {
        var things_matched = things.filter(t => t.name == thingname);
        if (things_matched.length != 1) {
            return null;
        }
        return things_matched[0];
    }


    function getThings(searchQuad: Quadrant) {

        var url = "/api/things/search";
        if (searchQuad != null) {
            url += "?Quadrant=" + searchQuad.id;
        }

        var d = $.Deferred();
        $.getJSON(url)
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
    function getThingsAndOpinions(searchQuad: Quadrant) {
        var d = $.Deferred();
        getThings(searchQuad).done(function (things) {
            $.getJSON("/api/opinions/" + AuthInfo.instance.username + "/")
                .done(function (data) {
                    var opinions: Opinion[] = [];

                    // go through all opinion data elements, and find the thing that has the same name.
                    for (var i = 0; i < data.length; i++) {

                        var thing = findThing(data[i].thingName, things);

                        if (thing != null) {
                            var opinion = new Opinion(thing, data[i].goodness, data[i].rant);
                            opinion.existsOnServer = true;
                            opinions.push(opinion);
                        }
                    }

                    d.resolve({ things: things, opinions: opinions });
                }).fail(d.reject);
        }).fail(d.reject);

        return d.promise();
    }




    function expandRant(opinion: Opinion) {
        console.log(opinion.thing.title);
        var el = $('#collapse' + opinion.thing.name);
        console.log(el);
        (<any>el).collapse('show');
    }




    function buildRantList(opinions: Opinion[]) {
        $('#rantList').remove();
        $('#contents').append('<div class="rants-list-right" id="rantList"></div>');
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

